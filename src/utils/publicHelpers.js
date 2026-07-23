/**
 * Optimiza URLs Cloudinary a WebP / responsive cuando aplica.
 */
export function cloudinaryUrl(url, { width = 600, quality = 'auto' } = {}) {
  if (!url || typeof url !== 'string') return url;
  if (!url.includes('res.cloudinary.com')) return url;
  return url.replace(
    '/upload/',
    `/upload/f_auto,q_${quality},w_${width},c_fill/`
  );
}

export function buildWhatsAppUrl(phone, message) {
  const digits = String(phone || '').replace(/\D/g, '');
  if (!digits) return null;
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}

export function productWhatsAppMessage(product) {
  return [
    'Hola.',
    'Estoy interesado en este accesorio.',
    '',
    `Nombre: ${product?.nombre || ''}`,
    `Código: ${product?.codigo || ''}`,
    '',
    '¿Está disponible?',
    '¿Tiene otros colores?',
    '¿Tiene otros diseños?',
    '',
    'Gracias.'
  ].join('\n');
}

export function formatPublicPrice(value, currency = 'CRC') {
  return new Intl.NumberFormat('es-CR', {
    style: 'currency',
    currency: currency || 'CRC',
    maximumFractionDigits: 0
  }).format(Number(value || 0));
}

export function isOffer(product) {
  return (
    product?.precio_anterior != null &&
    Number(product.precio_anterior) > Number(product.precio_venta)
  );
}

export function isNewProduct(product, days = 21) {
  if (!product?.fecha_creacion) return Boolean(product?.destacado);
  const created = new Date(product.fecha_creacion);
  if (Number.isNaN(created.getTime())) return false;
  const diff = Date.now() - created.getTime();
  return diff <= days * 24 * 60 * 60 * 1000;
}
