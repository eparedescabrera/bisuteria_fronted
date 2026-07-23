import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Outlet } from 'react-router-dom';
import { getPublicConfig } from '../services/publicApi';
import { APP_NAME } from '../utils/constants';
import { cloudinaryUrl } from '../utils/publicHelpers';
import { enableAdminPwa } from '../utils/adminPwa';

export default function AuthLayout() {
  useEffect(() => enableAdminPwa(), []);

  const configQuery = useQuery({
    queryKey: ['public', 'configuracion'],
    queryFn: getPublicConfig,
    staleTime: 5 * 60 * 1000,
    retry: 1
  });

  const config = configQuery.data?.data;
  const brand = config?.nombre_negocio || APP_NAME;
  const logoUrl = config?.logo_url
    ? cloudinaryUrl(config.logo_url, { width: 120 })
    : null;

  return (
    <div className="relative flex min-h-svh items-center justify-center overflow-x-hidden bg-gradient-to-br from-navy-900 via-navy-800 to-slate-900 px-4 py-8">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(47,111,237,0.25),transparent_45%)]" />
      <div className="relative w-full max-w-md rounded-2xl bg-white p-5 shadow-xl sm:p-8">
        <div className="mb-6 text-center">
          {logoUrl ? (
            <img
              src={logoUrl}
              alt={brand}
              className="mx-auto h-16 w-16 rounded-full object-cover ring-2 ring-navy-100"
            />
          ) : (
            <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-navy-800 text-lg font-semibold text-white">
              {(brand || 'AA').slice(0, 2).toUpperCase()}
            </span>
          )}
          <p className="mt-3 text-xs font-semibold uppercase tracking-[0.2em] text-navy-600">
            {brand}
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
