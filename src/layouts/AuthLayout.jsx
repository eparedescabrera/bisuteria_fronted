import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { PLATFORM_BRAND, PLATFORM_LOGO_URL } from '../utils/constants';
import { enableAdminPwa } from '../utils/adminPwa';

export default function AuthLayout() {
  useEffect(() => enableAdminPwa(), []);

  return (
    <div className="relative flex min-h-svh items-center justify-center overflow-x-hidden bg-gradient-to-br from-[#0a1628] via-[#0f2744] to-slate-900 px-4 py-8">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(56,189,248,0.18),transparent_45%)]" />
      <div className="relative w-full max-w-md rounded-2xl bg-white p-5 shadow-xl sm:p-8">
        <div className="mb-6 text-center">
          <img
            src={PLATFORM_LOGO_URL}
            alt={PLATFORM_BRAND}
            className="mx-auto h-24 w-24 rounded-2xl object-cover shadow-md ring-2 ring-sky-100 sm:h-28 sm:w-28"
          />
          <p className="mt-3 text-xs font-semibold uppercase tracking-[0.2em] text-sky-800">
            {PLATFORM_BRAND}
          </p>
          <h1 className="mt-2 text-xl font-semibold text-slate-900 sm:text-2xl">
            Acceso administrativo
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Gestiona inventario, catálogo y configuración
          </p>
        </div>
        <Outlet />
      </div>
    </div>
  );
}
