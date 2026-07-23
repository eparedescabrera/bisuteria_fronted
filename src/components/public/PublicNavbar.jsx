import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { FiMenu, FiSearch, FiX } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import { useCatalog } from '../../context/CatalogContext';
import { buildWhatsAppUrl, cloudinaryUrl } from '../../utils/publicHelpers';

const links = [
  { to: '/', label: 'Inicio', end: true },
  { to: '/productos', label: 'Productos' },
  { to: '/productos', label: 'Categorías', hash: true },
  { to: '/nosotros', label: 'Nosotros' },
  { to: '/contacto', label: 'Contacto' }
];

export default function PublicNavbar() {
  const { config } = useCatalog();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState('');

  const wa = buildWhatsAppUrl(
    config?.whatsapp,
    config?.mensaje_bienvenida || 'Hola, deseo consultar por sus accesorios.'
  );

  const onSearch = (e) => {
    e.preventDefault();
    const term = q.trim();
    navigate(term ? `/productos?busqueda=${encodeURIComponent(term)}` : '/productos');
    setOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 border-b border-stone-200/80 bg-[#faf7f2]/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center gap-2 px-3 py-3 sm:gap-4 sm:px-4">
        <Link to="/" className="flex min-w-0 flex-1 items-center gap-2 sm:gap-3" aria-label="Inicio">
          {config?.logo_url ? (
            <img
              src={cloudinaryUrl(config.logo_url, { width: 96 })}
              alt={config.nombre_negocio || 'Logo'}
              className="h-9 w-9 shrink-0 rounded-full object-cover sm:h-10 sm:w-10"
            />
          ) : (
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#3d2c29] text-sm font-semibold text-[#f3e6d8] sm:h-10 sm:w-10">
              AA
            </span>
          )}
          <span className="truncate font-[family-name:Georgia,serif] text-base text-[#3d2c29] sm:text-lg">
            {config?.nombre_negocio || 'Accesorios Anny'}
          </span>
        </Link>

        <nav className="ml-auto hidden items-center gap-1 md:flex" aria-label="Principal">
          {links.map((link) => (
            <NavLink
              key={link.label}
              to={link.to}
              end={link.end}
              className={({ isActive }) =>
                `rounded-full px-3 py-2 text-sm transition ${
                  isActive && !link.hash
                    ? 'bg-[#3d2c29] text-[#f3e6d8]'
                    : 'text-[#5c4a45] hover:bg-stone-200/70'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <form
          onSubmit={onSearch}
          className="hidden items-center gap-2 rounded-full border border-stone-300 bg-white px-3 py-1.5 lg:flex"
          role="search"
        >
          <FiSearch className="text-stone-500" aria-hidden />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Buscar accesorios…"
            className="w-36 bg-transparent text-sm outline-none xl:w-44"
            aria-label="Buscar productos"
          />
        </form>

        {wa ? (
          <a
            href={wa}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden items-center gap-2 rounded-full bg-[#25D366] px-3 py-2 text-sm font-medium text-white md:inline-flex"
          >
            <FaWhatsapp aria-hidden />
            WhatsApp
          </a>
        ) : null}

        <button
          type="button"
          className="shrink-0 rounded-lg p-2 text-[#3d2c29] md:hidden"
          aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <FiX size={22} /> : <FiMenu size={22} />}
        </button>
      </div>

      {open ? (
        <div className="border-t border-stone-200 bg-[#faf7f2] px-4 py-4 md:hidden">
          <form onSubmit={onSearch} className="mb-3 flex gap-2" role="search">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Buscar…"
              className="flex-1 rounded-xl border border-stone-300 bg-white px-3 py-2 text-sm"
              aria-label="Buscar productos"
            />
            <button
              type="submit"
              className="rounded-xl bg-[#3d2c29] px-3 py-2 text-sm text-white"
            >
              Buscar
            </button>
          </form>
          <div className="flex flex-col gap-1">
            {links.map((link) => (
              <Link
                key={link.label}
                to={link.to}
                onClick={() => setOpen(false)}
                className="rounded-xl px-3 py-2 text-[#3d2c29] hover:bg-stone-200/60"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      ) : null}
    </header>
  );
}
