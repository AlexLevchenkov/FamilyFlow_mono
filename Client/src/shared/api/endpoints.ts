/**
 * FamilyFlow API Endpoints
 * Centralized registry of all server route paths and dynamic path generators.
 * Prevents hardcoded URLs and ensures type safety across client requests.
 */

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    REFRESH_TOKEN: '/auth/refresh-token',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
    VERIFY_EMAIL: '/auth/verify-email',
  },
  EVENT: {
    ROOT: '/event',
    BY_ID: (id: number) => `/event/${id}`,
  },
  GOAL: {
    ROOT: '/goal',
    BY_ID: (id: number) => `/goal/${id}`,
  },
  TASK: {
    ROOT: '/task',
    BY_ID: (id: number) => `/task/${id}`,
  },
  USER: {
    ROOT: '/user',
    BY_ID: (id: number) => `/user/${id}`,
    ME: '/user/me',
  },
  FAMILY: {
    ROOT: '/family',
    BY_ID: (id: number) => `/family/${id}`,
    MY: '/family/my',
    MEMBERS: {
      ROOT: (familyId: number) => `/family/${familyId}/member`,
      BY_ID: (familyId: number, userId: number) =>
        `/family/${familyId}/member/${userId}`,
    },
  },
} as const;

export type ApiEndpoints = typeof API_ENDPOINTS;
