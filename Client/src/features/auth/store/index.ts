import { useAuthStore } from './auth';

export const useStore = () => ({
  auth: useAuthStore(),
});
