import { Routes, Navigate, Route } from 'react-router-dom';
import { publicRoutes } from './PublicRoutes';
import { privateRoutes } from './PrivateRoutes';
import { universalRoutes } from './UniversalRoutes';

const AppRoutes = ({ isAuth }: { isAuth: boolean }) => (
  <Routes>
    {isAuth ? (
      <>
        {privateRoutes.map(r => (
          <Route key={r.path} path={r.path} element={r.element} />
        ))}

        {publicRoutes.map(r => (
          <Route
            key={r.path}
            path={r.path}
            element={<Navigate to="/" replace />}
          />
        ))}
      </>
    ) : (
      <>
        {publicRoutes.map(r => (
          <Route key={r.path} path={r.path} element={r.element} />
        ))}

        {privateRoutes.map(r => (
          <Route
            key={r.path}
            path={r.path}
            element={<Navigate to="/login" replace />}
          />
        ))}
      </>
    )}

    {universalRoutes.map(r => (
      <Route key={r.path} path={r.path} element={r.element} />
    ))}
  </Routes>
);

export default AppRoutes;
