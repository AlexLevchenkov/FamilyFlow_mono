import { create } from 'zustand';

interface AuthState {
  accessToken: string | null;
  isAuthenticated: boolean;
  login: (tokens: { accessToken: string; rememberMe: boolean }) => void;
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
    sessionStorage.getItem('accessToken') ||
    '',
  isAuthenticated: !!(
    localStorage.getItem('accessToken') ||
    sessionStorage.getItem('accessToken') ||
    false
  ),
  login: ({ accessToken, rememberMe }) => {
    clearPersistedAuth();

    if (rememberMe) {
      localStorage.setItem('accessToken', accessToken);
    } else {
      sessionStorage.setItem('accessToken', accessToken);
    }
    set({ accessToken, isAuthenticated: true });
  },
  logout: () => {
    clearPersistedAuth();
    set({ accessToken: null, isAuthenticated: false });
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

// Debug helper
if (import.meta.env.DEV) {
  Object.assign(window, { useAuthStore });
}
