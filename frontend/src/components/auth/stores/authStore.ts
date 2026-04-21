import { create } from 'zustand';

type AuthState = {
  userName: string | null;
  isLoggedIn: boolean;
  login: (userName: string) => void;
  logout: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  userName: null,
  isLoggedIn: false,

  login: (userName) =>
    set({
      userName,
      isLoggedIn: true,
    }),

  logout: () =>
    set({
      userName: null,
      isLoggedIn: false,
    }),
}));