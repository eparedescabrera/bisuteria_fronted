import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaWhatsapp } from 'react-icons/fa';
import { useCatalog } from '../../context/CatalogContext';
import {
  buildWhatsAppUrl,
  cloudinaryUrl,
  formatPublicPrice,
  isNewProduct,
  isOffer,
  productWhatsAppMessage
} from '../../utils/publicHelpers';

export default function ProductCard({ product }) {
  const { config } = useCatalog();
  const offer = isOffer(product);
  const isNew = isNewProduct(product);
  const wa = buildWhatsAppUrl(config?.whatsapp, productWhatsAppMessage(product));
  const showStock = Boolean(config?.mostrar_stock_publico);

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.35 }}
      className="group overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-stone-200 transition duration-300 hover:-translate-y-1.5 hover:shadow-lg hover:ring-[#3d2c29]/15"
    >
      <Link to={`/producto/${product.slug}`} className="block">
        <div className="relative aspect-[4/5] overflow-hidden bg-stone-100">
          {product.imagen_principal ? (
            <img
              src={cloudinaryUrl(product.imagen_principal, { width: 640 })}
              alt={product.nombre}
              loading="lazy"
              className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-stone-400">
              Sin imagen
            </div>
          )}
          <div className="absolute left-3 top-3 flex flex-col gap-1">
            {isNew ? (
              <span className="rounded-full bg-[#3d2c29] px-2.5 py-0.5 text-[11px] font-semibold text-[#f3e6d8]">
                Nuevo
              </span>
            ) : null}
            {offer ? (
              <span className="rounded-full bg-amber-500 px-2.5 py-0.5 text-[11px] font-semibold text-white">
                Oferta
              </span>
            ) : null}
          </div>
        </div>
      </Link>

      <div className="space-y-2 p-4">
        <p className="text-xs uppercase tracking-wide text-stone-500">
          {product.categoria || product.categoria_slug}
        </p>
        <Link to={`/producto/${product.slug}`}>
          <h3 className="font-[family-name:Georgia,serif] text-lg leading-snug text-[#3d2c29]">
            {product.nombre}
          </h3>
        </Link>
        <div className="flex items-end gap-2">
          <p className="text-base font-semibold">
            {formatPublicPrice(product.precio_venta, config?.moneda)}
          </p>
          {offer ? (
            <p className="text-sm text-stone-400 line-through">
              {formatPublicPrice(product.precio_anterior, config?.moneda)}
            </p>
          ) : null}
        </div>
        <p className="text-xs text-stone-500">
          {product.estado_disponibilidad}
          {showStock && product.stock_visible != null
            ? ` · Stock: ${product.stock_visible}`
            : ''}
        </p>
        <div className="flex gap-2 pt-1">
          <Link
            to={`/producto/${product.slug}`}
            className="flex-1 rounded-full bg-[#3d2c29] px-3 py-2 text-center text-sm text-[#f3e6d8] transition hover:bg-[#2a1e1c]"
          >
            Ver detalle
          </Link>
          {wa ? (
            <a
              href={wa}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Consultar ${product.nombre} por WhatsApp`}
              className="inline-flex items-center justify-center rounded-full bg-[#25D366] px-3 py-2 text-white"
            >
              <FaWhatsapp />
            </a>
          ) : null}
        </div>
      </div>
    </motion.article>
  );
}
