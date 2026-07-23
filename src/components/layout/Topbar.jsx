import { Menu, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

export default function Topbar({ title, onMenu }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate('/login', { replace: true });
  }

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="flex items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="rounded-lg p-2 text-slate-700 hover:bg-slate-100 lg:hidden"
            onClick={onMenu}
            aria-label="Abrir menú"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div>
            <p className="text-xs text-slate-500">Panel administrativo</p>
            <h2 className="text-base font-semibold text-slate-900 sm:text-lg">{title}</h2>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden text-right sm:block">
            <p className="text-sm font-medium text-slate-800">
              {user?.nombre_completo || user?.nombre_usuario}
            </p>
            <p className="text-xs text-slate-500">{user?.rol}</p>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex items-center gap-2 rounded-lg bg-slate-100 px-3 py-2 text-sm text-slate-700 hover:bg-slate-200"
            aria-label="Cerrar sesión"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">Cerrar sesión</span>
          </button>
        </div>
      </div>
    </header>
  );
}
