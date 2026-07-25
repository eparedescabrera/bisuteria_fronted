/** Slug por defecto (tienda principal Accesorios Anny) */
export const DEFAULT_TIENDA_SLUG = 'accesorios-anny';

/** Rutas / slugs reservados del sistema (no pueden ser tiendas) */
export const RESERVED_TIENDA_SLUGS = new Set([
  'admin',
  'login',
  'super-admin',
  'superadmin',
  'api',
  'suscribirse',
  't',
  'www',
  'static',
  'assets',
  'public',
  'favicon',
  'robots',
  'sitemap'
]);

const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

let currentPublicSlug = null;

export function setPublicTiendaSlug(slug) {
  currentPublicSlug = slug || null;
}

export function getPublicTiendaSlug() {
  return currentPublicSlug;
}

export function isValidTiendaSlug(slug) {
  if (!slug || typeof slug !== 'string') return false;
  const s = slug.trim().toLowerCase();
  if (s.length < 2 || s.length > 80) return false;
  if (RESERVED_TIENDA_SLUGS.has(s)) return false;
  return SLUG_RE.test(s);
}

/** Construye ruta pública de una tienda: /t/{slug}/productos */
export function tiendaPath(slug, path = '/') {
  const base = `/t/${String(slug).toLowerCase()}`;
  if (!path || path === '/') return base;
  const clean = path.startsWith('/') ? path : `/${path}`;
  return `${base}${clean}`;
}

export function publicTiendaUrl(slug, origin = window.location.origin) {
  return `${origin.replace(/\/$/, '')}${tiendaPath(slug)}`;
}
