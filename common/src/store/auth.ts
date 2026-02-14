import { AuthStorage } from '@familyflow/common/types/auth';

let storage: AuthStorage | null = null;

export const initAuthStorage = (authStorage: AuthStorage) => {
  storage = authStorage;
};

export const authStorage = {
  getMode() {
    return storage?.mode
  },

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
