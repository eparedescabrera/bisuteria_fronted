import { Navigate, Outlet, useLocation } from 'react-router-dom';
import Spinner from '../components/feedback/Spinner';
import { useAuth } from '../hooks/useAuth';
import { isAdmin, isSuperAdmin } from '../utils/permissions';

/** Panel de empresa: solo Administrador */
export default function ProtectedRoute() {
  const { booting, isAuthenticated, user } = useAuth();
  const location = useLocation();

  if (booting) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100">
        <Spinner label="Validando sesión" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (isSuperAdmin(user)) {
    return <Navigate to="/super-admin" replace />;
  }

  if (!isAdmin(user)) {
    return <Navigate to="/403" replace />;
  }

  return <Outlet />;
}

/** Panel Super Admin: solo SuperAdministrador */
export function SuperAdminRoute() {
  const { booting, isAuthenticated, user } = useAuth();
  const location = useLocation();

  if (booting) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100">
        <Spinner label="Validando sesión" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (!isSuperAdmin(user)) {
    return <Navigate to={isAdmin(user) ? '/admin' : '/403'} replace />;
  }

  return <Outlet />;
}
