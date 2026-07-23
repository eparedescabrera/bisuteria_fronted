/**
 * Activa PWA solo en el panel administrativo (login + /admin).
 * El catálogo público no muestra "Instalar app".
 */
export function enableAdminPwa() {
  if (typeof document === 'undefined') return () => {};

  const head = document.head;
  const created = [];

  function upsert(rel, attrs) {
    let el = head.querySelector(`link[data-admin-pwa="${rel}"]`);
    if (!el) {
      el = document.createElement('link');
      el.setAttribute('data-admin-pwa', rel);
      head.appendChild(el);
      created.push(el);
    }
    Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, v));
  }

  function upsertMeta(name, content) {
    let el = head.querySelector(`meta[data-admin-pwa="${name}"]`);
    if (!el) {
      el = document.createElement('meta');
      el.setAttribute('data-admin-pwa', name);
      head.appendChild(el);
      created.push(el);
    }
    el.setAttribute('name', name);
    el.setAttribute('content', content);
  }

  upsert('manifest', { rel: 'manifest', href: '/manifest.webmanifest' });
  upsert('apple-touch-icon', {
    rel: 'apple-touch-icon',
    href: '/apple-touch-icon.png'
  });
  upsertMeta('theme-color', '#0f234c');
  upsertMeta('apple-mobile-web-app-capable', 'yes');
  upsertMeta('apple-mobile-web-app-title', 'Anny Admin');
  upsertMeta('mobile-web-app-capable', 'yes');
  upsertMeta('application-name', 'Accesorios Anny Admin');

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js').catch(() => {});
  }

  return () => {
    created.forEach((el) => el.remove());
  };
}
