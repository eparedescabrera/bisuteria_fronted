import { Navigate, Outlet, useLocation } from 'react-router-dom';
import Spinner from '../components/feedback/Spinner';
import { useAuth } from '../hooks/useAuth';
import { isAdmin } from '../utils/permissions';

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

  if (!isAdmin(user)) {
    return <Navigate to="/403" replace />;
  }

  return <Outlet />;
}
