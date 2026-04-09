import { create } from "zustand";

type AuthState = {
  token: string | null;
  userId: string | null;
  username: string | null;
  setToken: (token: string | null) => void;
  setUser: (userId: string | null, username: string | null) => void;
  logout: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  userId: null,
  username: null,

  setToken: (token) => set({ token }),

  setUser: (userId, username) =>
    set({
      userId,
      username,
    }),

  logout: () =>
    set({
      token: null,
      userId: null,
      username: null,
    }),
}));
