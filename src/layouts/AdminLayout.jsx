import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Outlet, useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import Sidebar from '../components/layout/Sidebar';
import Topbar from '../components/layout/Topbar';
import { enableAdminPwa } from '../utils/adminPwa';
import { getSettings } from '../api/settingsApi';
import { useAuth } from '../hooks/useAuth';

const titles = {
  '/admin': 'Dashboard',
  '/admin/categorias': 'Categorías',
  '/admin/productos': 'Productos',
  '/admin/productos/nuevo': 'Nuevo producto',
  '/admin/inventario': 'Inventario',
  '/admin/reportes': 'Reportes',
  '/admin/configuracion': 'Configuración'
};

export default function AdminLayout() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const { user } = useAuth();

  const settingsQuery = useQuery({
    queryKey: ['configuracion', user?.id_empresa ?? 'none'],
    queryFn: getSettings,
    staleTime: 5 * 60 * 1000,
    enabled: Boolean(user?.id_empresa)
  });

  const brand = settingsQuery.data?.data?.nombre_negocio || 'Mi negocio';

  useEffect(() => enableAdminPwa({ brand }), [brand]);

  let title = titles[location.pathname] || 'Administración';
  if (location.pathname.includes('/editar')) title = 'Editar producto';
  else if (/\/admin\/productos\/\d+$/.test(location.pathname)) title = 'Detalle producto';

  return (
    <div className="min-h-svh overflow-x-hidden bg-slate-100 lg:flex">
      <Helmet>
        <title>
          {title} | {brand}
        </title>
      </Helmet>
      <Sidebar open={open} onClose={() => setOpen(false)} />
      <div className="flex min-h-svh min-w-0 flex-1 flex-col">
        <Topbar title={title} onMenu={() => setOpen(true)} />
        <main className="min-w-0 flex-1 px-3 py-4 sm:px-6 sm:py-5">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
