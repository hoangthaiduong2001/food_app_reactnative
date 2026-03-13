import { IUser } from "@/types/user";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ACCESS_TOKEN = "ACCESS_TOKEN";
const REFRESH_TOKEN = "REFRESH_TOKEN";
const USER_INFO = "USER_INFO";

export const saveTokens = async (
  accessToken: string,
  refreshToken: string,
  user?: IUser,
) => {
  await AsyncStorage.multiSet([
    [ACCESS_TOKEN, accessToken],
    [REFRESH_TOKEN, refreshToken],
    [USER_INFO, JSON.stringify(user)],
  ]);
};

export const getAccessToken = async () => {
  return AsyncStorage.getItem(ACCESS_TOKEN);
};

export const getRefreshToken = async () => {
  return AsyncStorage.getItem(REFRESH_TOKEN);
};

export const clearTokens = async () => {
  await AsyncStorage.multiRemove([ACCESS_TOKEN, REFRESH_TOKEN]);
};

export const getUser = async (): Promise<IUser | null> => {
  const user = await AsyncStorage.getItem(USER_INFO);

  if (!user) return null;

  return JSON.parse(user);
};
