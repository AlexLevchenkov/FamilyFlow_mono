import type { IAuthStorage } from '@/types/auth';

let storage: IAuthStorage | null = null;

export const initAuthStorage = (authStorage: IAuthStorage) => {
  storage = authStorage;
};

export const authStorage = {
  getAccessToken() {
    if (!storage) throw new Error("AuthStorage not initialized");
    return storage.getAccessToken();
  },

  setAccessToken(token: string) {
    if (!storage) throw new Error("AuthStorage not initialized");
    return storage.setAccessToken(token);
  },

  removeAccessToken() {
    if (!storage) throw new Error("AuthStorage not initialized");
    return storage.removeAccessToken();
  },
};
