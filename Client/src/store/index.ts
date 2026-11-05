import { useAuthStore } from '@features/auth';

export const useStore = () => ({
  auth: useAuthStore(),
});
