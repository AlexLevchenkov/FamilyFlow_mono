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
  USER: {
    ROOT: '/user',
    BY_ID: (id: number | string) => `/user/${id}`,
  },
  LIST: {
    ROOT: '/list',
    BY_ID: (id: number | string) => `/list/${id}`,
    SHARE: '/list/share',
  },
  LIST_ITEM: {
    ROOT: '/listItem',
    BY_ID: (id: number | string) => `/listItem/${id}`,
  },
} as const;

export type ApiEndpoints = typeof API_ENDPOINTS;
