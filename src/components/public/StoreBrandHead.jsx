import { Helmet } from 'react-helmet-async';
import { useCatalog } from '../../context/CatalogContext';
import { cloudinaryUrl } from '../../utils/publicHelpers';
import { tiendaPath } from '../../utils/tienda';

/**
 * Marca por tienda: favicon + preview del enlace (og) con el logo de esa empresa.
 */
export default function StoreBrandHead() {
  const { config, tiendaSlug } = useCatalog();
  if (!config) return null;

  const site = config.nombre_negocio || 'Tienda';
  const base = import.meta.env.VITE_PUBLIC_SITE_URL || window.location.origin;
  const pageUrl = `${base.replace(/\/$/, '')}${tiendaPath(tiendaSlug)}`;

  const logo =
    config.logo_url &&
    cloudinaryUrl(config.logo_url, { width: 512, quality: 'auto' });
  const portada =
    config.portada_url &&
    cloudinaryUrl(config.portada_url, { width: 1200, quality: 'auto' });
  const shareImage = logo || portada || undefined;
  const favicon = logo || '/icons/icon-192.png';

  return (
    <Helmet>
      <title>{site}</title>
      <meta name="application-name" content={site} />
      <meta name="apple-mobile-web-app-title" content={site} />
      <link rel="icon" type="image/png" href={favicon} />
      <link rel="shortcut icon" href={favicon} />
      <link rel="apple-touch-icon" href={favicon} />
      <meta property="og:site_name" content={site} />
      <meta property="og:title" content={site} />
      <meta
        property="og:description"
        content={
          config.descripcion ||
          `${site}. Consulta disponibilidad por WhatsApp.`
        }
      />
      <meta property="og:url" content={pageUrl} />
      <meta property="og:type" content="website" />
      {shareImage ? <meta property="og:image" content={shareImage} /> : null}
      {shareImage ? (
        <meta property="og:image:alt" content={`Logo de ${site}`} />
      ) : null}
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:title" content={site} />
      {shareImage ? <meta name="twitter:image" content={shareImage} /> : null}
    </Helmet>
  );
}
