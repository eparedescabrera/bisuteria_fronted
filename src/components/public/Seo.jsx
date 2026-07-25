import { Helmet } from 'react-helmet-async';
import { cloudinaryUrl } from '../../utils/publicHelpers';

export default function Seo({
  title,
  description,
  keywords,
  path = '/',
  image,
  logoUrl,
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

  const logo = logoUrl
    ? cloudinaryUrl(logoUrl, { width: 512, quality: 'auto' })
    : undefined;
  const ogImage = image
    ? cloudinaryUrl(image, { width: 1200, quality: 'auto' })
    : logo;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={desc} />
      {keywords ? <meta name="keywords" content={keywords} /> : null}
      <link rel="canonical" href={canonical} />
      {logo ? <link rel="icon" type="image/png" href={logo} /> : null}
      {logo ? <link rel="apple-touch-icon" href={logo} /> : null}
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={site} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={desc} />
      <meta property="og:url" content={canonical} />
      {ogImage ? <meta property="og:image" content={ogImage} /> : null}
      <meta name="twitter:card" content={ogImage ? 'summary_large_image' : 'summary'} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={desc} />
      {ogImage ? <meta name="twitter:image" content={ogImage} /> : null}
    </Helmet>
  );
}
