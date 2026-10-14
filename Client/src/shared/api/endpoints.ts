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
  FAMILY: {
    ROOT: '/family',
    MEMBERS: '/family/members',
    MEMBER_BY_ID: (userId: number | string) => `/family/members/${userId}`,
  },
  GOAL: {
    ROOT: '/goal',
    BY_ID: (id: number | string) => `/goal/${id}`,
  },
} as const;

export type ApiEndpoints = typeof API_ENDPOINTS;
