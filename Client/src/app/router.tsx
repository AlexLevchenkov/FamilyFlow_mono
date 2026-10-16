import { createBrowserRouter } from 'react-router-dom';
import { AuthPage, Calendar, Family, Goals, Home, MyTasks } from '@pages';
import {
  PrivacyPage,
  PublicOnly,
  RequireAuth,
  ResetPasswordRoute,
  RootLayout,
  RouteFallback,
  SettingsPage,
  SupportPage,
  TasksLayout,
  TermsPage,
  VerifyEmailRoute,
} from './RouteElements';

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      {
        element: <PublicOnly />,
        children: [
          { path: '/login', element: <AuthPage view="login" /> },
          { path: '/register', element: <AuthPage view="register" /> },
          { path: '/forgot-password', element: <AuthPage view="reset" /> },
          { path: '/reset-password', element: <AuthPage view="reset" /> },
          { path: '/reset-password/:token', element: <ResetPasswordRoute /> },
        ],
      },
      {
        element: <RequireAuth />,
        children: [
          {
            element: <TasksLayout />,
            children: [
              { path: '/', element: <Home /> },
              { path: '/my_tasks', element: <MyTasks /> },
              { path: '/calendar', element: <Calendar /> },
              { path: '/family', element: <Family /> },
              { path: '/goals', element: <Goals /> },
              { path: '/settings', element: <SettingsPage /> },
            ],
          },
        ],
      },
      { path: '/verify-email/:token', element: <VerifyEmailRoute /> },
      { path: '/support', element: <SupportPage /> },
      { path: '/privacy', element: <PrivacyPage /> },
      { path: '/terms', element: <TermsPage /> },
      { path: '*', element: <RouteFallback /> },
    ],
  },
]);
