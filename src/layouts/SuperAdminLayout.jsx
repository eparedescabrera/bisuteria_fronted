import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Button from '../components/common/Button';
import { PLATFORM_BRAND, PLATFORM_LOGO_URL } from '../utils/constants';

const links = [
  { to: '/super-admin', end: true, label: 'Dashboard' },
  { to: '/super-admin/empresas', label: 'Empresas' }
];

export default function SuperAdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const onLogout = async () => {
    await logout();
    navigate('/login', { replace: true });
  };

  return (
    <div className="min-h-screen bg-stone-100 text-stone-900">
      <header className="border-b border-stone-200 bg-[#0a1628] text-stone-100">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-3 px-4 py-3">
          <div className="mr-auto flex items-center gap-3">
            <img
              src={PLATFORM_LOGO_URL}
              alt={PLATFORM_BRAND}
              className="h-11 w-11 rounded-xl object-cover ring-1 ring-sky-400/40"
            />
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-sky-300/80">
                {PLATFORM_BRAND}
              </p>
              <h1 className="text-lg font-semibold">Super Administrador</h1>
            </div>
          </div>
          <nav className="flex flex-wrap gap-1">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.end}
                className={({ isActive }) =>
                  `rounded-md px-3 py-1.5 text-sm ${
                    isActive
                      ? 'bg-stone-100 text-stone-900'
                      : 'text-stone-300 hover:bg-stone-800'
                  }`
                }
              >
                {l.label}
              </NavLink>
            ))}
          </nav>
          <div className="flex items-center gap-2 text-sm">
            <span className="hidden text-stone-400 sm:inline">
              {user?.nombre_usuario}
            </span>
            <Button type="button" variant="secondary" onClick={onLogout}>
              Salir
            </Button>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-6">
        <Outlet />
      </main>
    </div>
  );
}
