import { Outlet } from 'react-router-dom';
import { APP_NAME } from '../utils/constants';

export default function AuthLayout() {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-navy-900 via-navy-800 to-slate-900 px-4">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(47,111,237,0.25),transparent_45%)]" />
      <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-xl sm:p-8">
        <div className="mb-6 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-navy-600">
            {APP_NAME}
          </p>
          <h1 className="mt-2 text-2xl font-semibold text-slate-900">Acceso administrativo</h1>
          <p className="mt-1 text-sm text-slate-500">
            Gestiona inventario, catálogo y configuración
          </p>
        </div>
        <Outlet />
      </div>
    </div>
  );
}
