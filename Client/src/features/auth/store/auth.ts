import { create } from 'zustand';
import type { IUser } from '@features/auth';

interface AuthState {
  accessToken: string | null;
  isAuthenticated: boolean;
  user: IUser | null;
  login: (tokens: {
    accessToken: string;
    rememberMe: boolean;
    me: IUser;
  }) => void;
  logout: () => void;
  refreshTokens: (tokens: { access: string }) => void;
}

function clearPersistedAuth() {
  for (const key of ['accessToken', 'name', 'avatar']) {
    localStorage.removeItem(key);
    sessionStorage.removeItem(key);
  }
}

export const useAuthStore = create<AuthState>(set => ({
  accessToken:
    localStorage.getItem('accessToken') ||
    sessionStorage.getItem('accessToken'),
  isAuthenticated: !!(
    localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken')
  ),
  user: {
    name: localStorage.getItem('name') || sessionStorage.getItem('name'),
    avatar: localStorage.getItem('avatar') || sessionStorage.getItem('avatar'),
  },
  login: ({ accessToken, rememberMe, me }) => {
    clearPersistedAuth();

    if (rememberMe) {
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('name', me.name || '');
      localStorage.setItem('avatar', me.avatar || '');
    } else {
      sessionStorage.setItem('accessToken', accessToken);
      sessionStorage.setItem('name', me.name || '');
      sessionStorage.setItem('avatar', me.avatar || '');
    }
    set({ accessToken, isAuthenticated: true, user: me });
  },
  logout: () => {
    clearPersistedAuth();
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
