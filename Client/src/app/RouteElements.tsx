import { useEffect, useState } from 'react';
import {
  Navigate,
  Outlet,
  useLocation,
  useNavigate,
  useParams,
} from 'react-router-dom';
import { AuthPage, VerifyEmailPage } from '@pages';
import { authApi } from '@api/auth.api';
import { ToastContainer } from '@ui';
import { useAuthStore } from '@store/auth';
import { TasksProvider } from '@features/tasks/hooks/TasksProvider';
import { useTasksContext } from '@features/tasks/hooks/useTasks';
import { MainLayout } from '@layouts/MainLayout';
import { LogoutButton } from '@features/auth/components/LogoutButton';
import { ProfileUser } from '@features/auth/components/ProfileUser';
import { PrivacyPage } from '@pages/Privacy';
import { SupportPage } from '@pages/Support';
import { TermsPage } from '@pages/Terms';
import { SettingsPage } from '@pages/Settings';

let sessionBootstrapPromise: Promise<void> | null = null;

function bootstrapSession() {
  if (!useAuthStore.getState().accessToken) return Promise.resolve();

  if (!sessionBootstrapPromise) {
    sessionBootstrapPromise = authApi
      .refreshToken()
      .then((response) => {
        useAuthStore.getState().refreshTokens({
          access: response.data.data.accessToken,
        });
      })
      .catch(() => {
        useAuthStore.getState().logout();
      })
      .finally(() => {
        sessionBootstrapPromise = null;
      });
  }

  return sessionBootstrapPromise;
}

export function RootLayout() {
  const [authReady, setAuthReady] = useState(false);

  useEffect(() => {
    let active = true;
    bootstrapSession().finally(() => {
      if (active) setAuthReady(true);
    });
    return () => {
      active = false;
    };
  }, []);

  if (!authReady) {
    return (
      <>
        <main
          className="grid min-h-screen place-items-center bg-white text-sm text-page-muted"
          aria-busy="true"
        >
          Перевірка сесії…
        </main>
        <ToastContainer />
      </>
    );
  }

  return (
    <>
      <Outlet />
      <ToastContainer />
    </>
  );
}

export function RequireAuth() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const location = useLocation();

  return isAuthenticated ? (
    <Outlet />
  ) : (
    <Navigate to="/login" replace state={{ from: location }} />
  );
}

export function PublicOnly() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  return isAuthenticated ? <Navigate to="/" replace /> : <Outlet />;
}

const navPaths: Record<string, string> = {
  Огляд: '/',
  'Мої справи': '/my_tasks',
  Календар: '/calendar',
  Цілі: '/goals',
  Родина: '/family',
  Налаштування: '/settings',
};

export function DashboardLayout() {
  const { tasks } = useTasksContext();
  const location = useLocation();
  const navigate = useNavigate();
  const activeNav =
    Object.entries(navPaths).find(([, path]) => path === location.pathname)?.[0] ??
    'Огляд';

  return (
    <MainLayout
      activeNav={activeNav}
      setActiveNav={(nav) => navigate(navPaths[nav] ?? '/')}
      activeTasksCount={tasks.filter((task) => !task.done).length}
      logoutSlot={<LogoutButton />}
      profileSlot={<ProfileUser />}
    >
      <Outlet />
    </MainLayout>
  );
}

export function TasksLayout() {
  return (
    <TasksProvider>
      <DashboardLayout />
    </TasksProvider>
  );
}

export function VerifyEmailRoute() {
  const { token } = useParams();
  return <VerifyEmailPage token={token ?? ''} />;
}

export function ResetPasswordRoute() {
  const { token } = useParams();
  return <AuthPage view="reset-password" token={token} />;
}

export function RouteFallback() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  return <Navigate to={isAuthenticated ? '/' : '/login'} replace />;
}

export { PrivacyPage, SupportPage, TermsPage, SettingsPage };
