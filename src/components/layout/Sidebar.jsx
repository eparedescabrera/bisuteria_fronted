import { NavLink } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  LayoutDashboard,
  Tags,
  Package,
  Boxes,
  FileBarChart,
  Settings,
  X
} from 'lucide-react';
import { getSettings } from '../../api/settingsApi';
import { APP_NAME } from '../../utils/constants';
import { cloudinaryUrl } from '../../utils/publicHelpers';

const links = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/categorias', label: 'Categorías', icon: Tags },
  { to: '/admin/productos', label: 'Productos', icon: Package },
  { to: '/admin/inventario', label: 'Inventario', icon: Boxes },
  { to: '/admin/reportes', label: 'Reportes', icon: FileBarChart },
  { to: '/admin/configuracion', label: 'Configuración', icon: Settings }
];

export default function Sidebar({ open, onClose }) {
  const settingsQuery = useQuery({
    queryKey: ['configuracion'],
    queryFn: getSettings,
    staleTime: 5 * 60 * 1000
  });

  const config = settingsQuery.data?.data;
  const brand = config?.nombre_negocio || APP_NAME;
  const logoUrl = config?.logo_url
    ? cloudinaryUrl(config.logo_url, { width: 96 })
    : null;

  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-black/40 lg:hidden ${open ? 'block' : 'hidden'}`}
        onClick={onClose}
        aria-hidden="true"
      />
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[min(18rem,85vw)] flex-col bg-navy-900 text-white transition-transform lg:static lg:w-72 lg:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between gap-3 border-b border-white/10 px-4 py-4 sm:px-5">
          <div className="flex min-w-0 items-center gap-3">
            {logoUrl ? (
              <img
                src={logoUrl}
                alt={brand}
                className="h-10 w-10 shrink-0 rounded-full object-cover ring-2 ring-white/20"
              />
            ) : (
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-navy-600 text-sm font-semibold">
                {(brand || 'AA').slice(0, 2).toUpperCase()}
              </span>
            )}
            <div className="min-w-0">
              <p className="text-[10px] uppercase tracking-wider text-navy-100">Admin</p>
              <h1 className="truncate text-base font-semibold leading-tight sm:text-lg">
                {brand}
              </h1>
            </div>
          </div>
          <button
            type="button"
            className="shrink-0 rounded-lg p-2 hover:bg-white/10 lg:hidden"
            onClick={onClose}
            aria-label="Cerrar menú"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <nav className="flex-1 space-y-1 overflow-y-auto p-3">
          {links.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition ${
                  isActive
                    ? 'bg-navy-600 text-white'
                    : 'text-navy-100 hover:bg-white/10'
                }`
              }
            >
              <Icon className="h-4 w-4 shrink-0" />
              {label}
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
}
