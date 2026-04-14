import { create } from "zustand";

type AuthState = {
  token: string | null;
  userId: string | null;
  username: string | null;
  setToken: (token: string | null) => void;
  setUser: (
    userId: string | null,
    username: string | null,
    hasWallet: boolean,
  ) => void;
  logout: () => void;
  hasWallet: boolean;
};

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  userId: null,
  username: null,
  hasWallet: false,
  setToken: (token) => set({ token }),

  setUser: (userId, username, hasWallet) =>
    set({
      userId,
      username,
      hasWallet,
    }),

  logout: () =>
    set({
      token: null,
      userId: null,
      username: null,
      hasWallet: false,
    }),
}));
