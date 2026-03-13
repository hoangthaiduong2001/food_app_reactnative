import axios from "axios";
import {
  clearTokens,
  getAccessToken,
  getRefreshToken,
  saveTokens,
} from "../utils/tokenStorage";

export const API_URL = process.env.EXPO_PUBLIC_API_URL;

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
});

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

api.interceptors.request.use(async (config) => {
  const accessToken = await getAccessToken();
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const status = error.response?.status;

    if (
      status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url?.includes("/auth/login") &&
      !originalRequest.url?.includes("/auth/refreshToken")
    ) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          originalRequest.headers.Authorization = "Bearer " + token;
          return api(originalRequest);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = await getRefreshToken();

        const response = await axios.post(`${API_URL}/auth/refreshToken`, {
          refreshToken,
        });

        const newAccessToken = response.data.accessToken;

        await saveTokens(newAccessToken, refreshToken!);

        processQueue(null, newAccessToken);

        originalRequest.headers.Authorization = "Bearer " + newAccessToken;

        return api(originalRequest);
      } catch (err: any) {
        processQueue(err, null);
        await clearTokens();
        return Promise.reject(
          err?.response?.data ?? {
            message:
              error.response?.data?.message ||
              error.message ||
              "Something went wrong",
          },
        );
      } finally {
        isRefreshing = false;
      }
    }
    return Promise.reject(error);
  },
);

export default api;
