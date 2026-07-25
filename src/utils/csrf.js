/**
 * CSRF token del login (body). La cookie csrf_token de Railway no es legible
 * desde Vercel (otro dominio); se guarda en sessionStorage.
 */
const KEY = 'inventory_pro_csrf';

function readCookie(name) {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(
    new RegExp(`(?:^|; )${name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}=([^;]*)`)
  );
  return match ? decodeURIComponent(match[1]) : null;
}

export function setCsrfToken(token) {
  if (!token) {
    clearCsrfToken();
    return;
  }
  try {
    sessionStorage.setItem(KEY, token);
  } catch {
    // ignore
  }
}

export function clearCsrfToken() {
  try {
    sessionStorage.removeItem(KEY);
  } catch {
    // ignore
  }
}

export function getCsrfToken() {
  try {
    const stored = sessionStorage.getItem(KEY);
    if (stored) return stored;
  } catch {
    // ignore
  }
  return readCookie('csrf_token');
}

export { readCookie };
