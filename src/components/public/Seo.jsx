import { Helmet } from 'react-helmet-async';

export default function Seo({
  title,
  description,
  keywords,
  path = '/',
  image,
  type = 'website'
}) {
  const site = import.meta.env.VITE_APP_NAME || 'Accesorios Anny';
  const base = import.meta.env.VITE_PUBLIC_SITE_URL || window.location.origin;
  const fullTitle = title ? `${title} | ${site}` : site;
  const desc =
    description ||
    'Bisutería y accesorios artesanales. Consulta disponibilidad por WhatsApp.';
  const canonical = `${base.replace(/\/$/, '')}${path}`;
  const ogImage = image || `${base}/og-default.jpg`;

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
      <meta property="og:image" content={ogImage} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={desc} />
      <meta name="twitter:image" content={ogImage} />
    </Helmet>
  );
}
