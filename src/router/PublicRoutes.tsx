import {
  AuthPage
} from '@/pages';

export const publicRoutes = [
  { path: '/login', element: <AuthPage view="login" /> },
  { path: '/registration', element: <AuthPage view="register" /> },
  { path: '/forgot-password', element: <AuthPage view="reset" /> },
  // { path: '/verify-email/:token', element: <AuthPage view="verify" /> },
];