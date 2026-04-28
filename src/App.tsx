import { BrowserRouter } from 'react-router-dom';
import { useAuth } from '@hooks/AuthHooks';
import { LogoutButton, NavMenu, ToastContainer } from '@/ui';
import AppRoutes from '@router/AppRoutes';

export default function App() {
  const isAuth = useAuth();
  return (
    <div className="container">
      <BrowserRouter>
        {isAuth && <NavMenu />}
        <AppRoutes isAuth={isAuth} />
        <LogoutButton />
        <ToastContainer />
      </BrowserRouter>
    </div>
  );
}
