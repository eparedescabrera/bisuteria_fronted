/**
 * Access token en sessionStorage (no localStorage permanente).
 * Vercel y Railway son dominios distintos: hace falta Bearer en cada request.
 */
const KEY = 'inventory_pro_access_mem';

export function setAccessToken(token) {
  if (!token) {
    clearAccessToken();
    return;
  }
  try {
    sessionStorage.setItem(KEY, token);
  } catch {
    // ignore quota / private mode
  }
}

export function getAccessToken() {
  try {
    return sessionStorage.getItem(KEY);
  } catch {
    return null;
  }
}

export function clearAccessToken() {
  try {
    sessionStorage.removeItem(KEY);
  } catch {
    // ignore
  }
}
