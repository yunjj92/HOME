import { create } from 'zustand';

type AuthState = {
  userName: string | null;
  isLoggedIn: boolean;
  sessionExpiry: number | null;
  refreshToken: string | null;
  login: (userName: string, expiry?: number | null, refreshToken?: string | null) => void;
  logout: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  userName: null,
  isLoggedIn: false,
  sessionExpiry: null,
  refreshToken: null,

  login: (userName, expiry = null, refreshToken = null) =>
    set({
      userName,
      isLoggedIn: true,
      sessionExpiry: expiry,
      refreshToken,
    }),

  logout: () =>
    set({
      userName: null,
      isLoggedIn: false,
      sessionExpiry: null,
      refreshToken: null,
    }),
}));