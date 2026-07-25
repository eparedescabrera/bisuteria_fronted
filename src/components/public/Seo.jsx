import { Helmet } from 'react-helmet-async';

export default function Seo({
  title,
  description,
  keywords,
  path = '/',
  image,
  type = 'website',
  /** Nombre de la tienda actual (cada empresa es independiente) */
  siteName
}) {
  const site = siteName || 'Tienda';
  const base = import.meta.env.VITE_PUBLIC_SITE_URL || window.location.origin;
  const fullTitle = title ? `${title} | ${site}` : site;
  const desc =
    description ||
    `${site}. Consulta disponibilidad por WhatsApp.`;
  const canonical = `${base.replace(/\/$/, '')}${path.startsWith('/') ? path : `/${path}`}`;
  const ogImage = image || undefined;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={desc} />
      {keywords ? <meta name="keywords" content={keywords} /> : null}
      <link rel="canonical" href={canonical} />
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={desc} />
      <meta property="og:url" content={canonical} />
      {ogImage ? <meta property="og:image" content={ogImage} /> : null}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={desc} />
      {ogImage ? <meta name="twitter:image" content={ogImage} /> : null}
    </Helmet>
  );
}
