import { create } from "zustand";
import type { IUser } from "@/types/user";

interface AuthState {
  accessToken: string | null;
  isAuthenticated: boolean;
  user: IUser | null;
  login: (tokens: { accessToken: string; rememberMe: boolean, me: IUser }) => void;
  logout: () => void;
  refreshTokens: (tokens: { access: string }) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken'),
  isAuthenticated: !!(localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken')),
  user: {
    name: localStorage.getItem('name') || sessionStorage.getItem('name'),
    avatar: localStorage.getItem('avatar') || sessionStorage.getItem('avatar'),
  },
  login: ({ accessToken, rememberMe, me }) => {
    if (rememberMe) {
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('name', me.name || "");
      localStorage.setItem('avatar', me.avatar || "");
    } else {
      sessionStorage.setItem('accessToken', accessToken);
      sessionStorage.setItem('name', me.name || "");
      sessionStorage.setItem('avatar', me.avatar || "");
    }
    set({ accessToken, isAuthenticated: true, user: me });
  },
  logout: () => {
    localStorage.clear();
    sessionStorage.clear();
    set({ accessToken: null, isAuthenticated: false, user: null });
  },
  refreshTokens: ({ access }) => {
    if (localStorage.getItem('accessToken')) {
      localStorage.setItem('accessToken', access);
    } else {
      sessionStorage.setItem('accessToken', access);
    }
    set({ accessToken: access });
  },
}));