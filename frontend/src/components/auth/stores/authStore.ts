import { create } from 'zustand';

type AuthState = {
  userName: string | null;
  isLoggedIn: boolean;
  sessionExpiry: number | null;
  login: (userName: string, expiry?: number | null) => void;
  logout: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  userName: null,
  isLoggedIn: false,
  sessionExpiry: null,

  login: (userName, expiry = null) =>
    set({
      userName,
      isLoggedIn: true,
      sessionExpiry: expiry,
    }),

  logout: () =>
    set({
      userName: null,
      isLoggedIn: false,
      sessionExpiry: null,
    }),
}));