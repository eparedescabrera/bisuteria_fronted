/**
 * Preview del enlace /t/{slug} para bots (WhatsApp, Facebook, etc.).
 * Usa el logo de cada empresa en og:image.
 * Los visitantes normales siguen a la SPA.
 */
import { next } from '@vercel/edge';

export const config = {
  matcher: '/t/:slug*'
};

function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function isSocialBot(ua) {
  return /whatsapp|facebookexternalhit|facebot|twitterbot|linkedinbot|slackbot|telegrambot|discordbot|pinterest|googlebot|bingbot|embedly|quora link preview|showyoubot|outbrain|vkshare|w3c_validator/i.test(
    ua || ''
  );
}

function absoluteImage(url) {
  if (!url) return '';
  if (url.includes('res.cloudinary.com') && url.includes('/upload/')) {
    return url.replace('/upload/', '/upload/f_auto,q_auto,w_512,c_fill/');
  }
  return url;
}

export default async function middleware(request) {
  const ua = request.headers.get('user-agent') || '';
  if (!isSocialBot(ua)) {
    return next();
  }

  const url = new URL(request.url);
  const parts = url.pathname.split('/').filter(Boolean);
  if (parts[0] !== 't' || !parts[1]) {
    return next();
  }

  const slug = parts[1].toLowerCase();
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
    return next();
  }

  const apiBase = (
    process.env.VITE_API_URL ||
    process.env.API_URL ||
    ''
  ).replace(/\/$/, '');
  if (!apiBase) {
    return next();
  }

  try {
    const res = await fetch(
      `${apiBase}/public/configuracion?empresa=${encodeURIComponent(slug)}`,
      { headers: { Accept: 'application/json' } }
    );
    if (!res.ok) return next();

    const json = await res.json();
    const cfg = json?.data || {};
    const name = escapeHtml(cfg.nombre_negocio || 'Tienda');
    const desc = escapeHtml(
      cfg.descripcion ||
        `${cfg.nombre_negocio || 'Tienda'}. Consulta disponibilidad por WhatsApp.`
    );
    const image = absoluteImage(cfg.logo_url || cfg.portada_url || '');
    const pageUrl = escapeHtml(`${url.origin}/t/${slug}`);
    const imageTag = image
      ? `<meta property="og:image" content="${escapeHtml(image)}" />
<meta name="twitter:image" content="${escapeHtml(image)}" />
<link rel="icon" href="${escapeHtml(image)}" />`
      : '';

    const html = `<!doctype html>
<html lang="es">
<head>
  <meta charset="utf-8" />
  <title>${name}</title>
  <meta name="description" content="${desc}" />
  <meta property="og:type" content="website" />
  <meta property="og:site_name" content="${name}" />
  <meta property="og:title" content="${name}" />
  <meta property="og:description" content="${desc}" />
  <meta property="og:url" content="${pageUrl}" />
  ${imageTag}
  <meta name="twitter:card" content="summary" />
  <meta name="twitter:title" content="${name}" />
  <meta name="twitter:description" content="${desc}" />
  <link rel="canonical" href="${pageUrl}" />
</head>
<body>
  <p>${name}</p>
  <p><a href="${pageUrl}">Abrir tienda</a></p>
</body>
</html>`;

    return new Response(html, {
      status: 200,
      headers: {
        'content-type': 'text/html; charset=utf-8',
        'cache-control': 'public, s-maxage=300, stale-while-revalidate=600'
      }
    });
  } catch {
    return next();
  }
}
