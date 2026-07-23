import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Tags,
  Package,
  Boxes,
  FileBarChart,
  Settings,
  X
} from 'lucide-react';
import { APP_NAME } from '../../utils/constants';

const links = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/categorias', label: 'Categorías', icon: Tags },
  { to: '/admin/productos', label: 'Productos', icon: Package },
  { to: '/admin/inventario', label: 'Inventario', icon: Boxes },
  { to: '/admin/reportes', label: 'Reportes', icon: FileBarChart },
  { to: '/admin/configuracion', label: 'Configuración', icon: Settings }
];

export default function Sidebar({ open, onClose }) {
  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-black/40 lg:hidden ${open ? 'block' : 'hidden'}`}
        onClick={onClose}
        aria-hidden="true"
      />
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col bg-navy-900 text-white transition-transform lg:static lg:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
          <div>
            <p className="text-xs uppercase tracking-wider text-navy-100">Admin</p>
            <h1 className="text-lg font-semibold">{APP_NAME}</h1>
          </div>
          <button
            type="button"
            className="rounded-lg p-2 hover:bg-white/10 lg:hidden"
            onClick={onClose}
            aria-label="Cerrar menú"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <nav className="flex-1 space-y-1 p-3">
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
              <Icon className="h-4 w-4" />
              {label}
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
}
