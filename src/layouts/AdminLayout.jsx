import { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar';
import Topbar from '../components/layout/Topbar';
import { enableAdminPwa } from '../utils/adminPwa';

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

  useEffect(() => enableAdminPwa(), []);

  let title = titles[location.pathname] || 'Administración';
  if (location.pathname.includes('/editar')) title = 'Editar producto';
  else if (/\/admin\/productos\/\d+$/.test(location.pathname)) title = 'Detalle producto';

  return (
    <div className="min-h-svh overflow-x-hidden bg-slate-100 lg:flex">
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
