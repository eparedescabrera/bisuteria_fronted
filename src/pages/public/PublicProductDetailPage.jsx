import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { FaWhatsapp } from 'react-icons/fa';
import { motion } from 'framer-motion';
import Seo from '../../components/public/Seo';
import ProductCard from '../../components/public/ProductCard';
import ProductCardSkeleton from '../../components/public/ProductCardSkeleton';
import { useCatalog } from '../../context/CatalogContext';
import {
  getPublicProductBySlug,
  getRelatedProducts
} from '../../services/publicApi';
import {
  buildWhatsAppUrl,
  cloudinaryUrl,
  formatPublicPrice,
  isOffer,
  productWhatsAppMessage
} from '../../utils/publicHelpers';

export default function PublicProductDetailPage() {
  const { slug } = useParams();
  const { config } = useCatalog();
  const [active, setActive] = useState(0);
  const [zoomed, setZoomed] = useState(false);

  const productQuery = useQuery({
    queryKey: ['public', 'producto', slug],
    queryFn: () => getPublicProductBySlug(slug),
    enabled: Boolean(slug)
  });

  const relatedQuery = useQuery({
    queryKey: ['public', 'relacionados', slug],
    queryFn: () => getRelatedProducts(slug, 4),
    enabled: Boolean(slug) && productQuery.isSuccess
  });

  if (productQuery.isLoading) {
    return (
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 lg:grid-cols-2">
        <div className="aspect-square animate-pulse rounded-3xl bg-stone-200" />
        <div className="space-y-4">
          <div className="h-8 w-2/3 animate-pulse rounded bg-stone-200" />
          <div className="h-4 w-1/3 animate-pulse rounded bg-stone-200" />
          <div className="h-24 animate-pulse rounded bg-stone-200" />
        </div>
      </div>
    );
  }

  if (productQuery.isError) {
    const status = productQuery.error?.response?.status;
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <Seo title={status === 404 ? 'Producto no encontrado' : 'Error'} path={`/producto/${slug}`} />
        <h1 className="font-[family-name:Georgia,serif] text-3xl">
          {status === 404 ? 'Producto no encontrado' : 'No se pudo cargar'}
        </h1>
        <Link to="/productos" className="mt-6 inline-block underline">
          Volver al catálogo
        </Link>
      </div>
    );
  }

  const p = productQuery.data.data;
  const images = p.imagenes?.length
    ? p.imagenes
    : [{ imagen_url: null, es_principal: true }];
  const current = images[active] || images[0];
  const offer = isOffer(p);
  const wa = buildWhatsAppUrl(config?.whatsapp, productWhatsAppMessage(p));
  const related = relatedQuery.data?.data || [];
  const showStock = Boolean(config?.mostrar_stock_publico);

  return (
    <>
      <Seo
        title={p.nombre}
        description={p.descripcion_corta || p.descripcion_completa || p.nombre}
        path={`/producto/${p.slug}`}
        image={current?.imagen_url}
        type="product"
        keywords={`${p.nombre}, ${p.categoria?.nombre || ''}, bisutería`}
      />

      <div className="mx-auto max-w-6xl px-4 py-10">
        <nav className="mb-6 text-sm text-stone-500" aria-label="Breadcrumb">
          <Link to="/">Inicio</Link>
          <span className="mx-2">/</span>
          <Link to="/productos">Productos</Link>
          {p.categoria?.slug ? (
            <>
              <span className="mx-2">/</span>
              <Link to={`/categoria/${p.categoria.slug}`}>{p.categoria.nombre}</Link>
            </>
          ) : null}
        </nav>

        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            <button
              type="button"
              className="relative aspect-square w-full overflow-hidden rounded-3xl bg-stone-100"
              onClick={() => setZoomed((z) => !z)}
              aria-label={zoomed ? 'Quitar zoom' : 'Ampliar imagen'}
            >
              {current?.imagen_url ? (
                <img
                  src={cloudinaryUrl(current.imagen_url, { width: zoomed ? 1400 : 900 })}
                  alt={p.nombre}
                  className={`h-full w-full object-cover transition duration-300 ${
                    zoomed ? 'scale-125 cursor-zoom-out' : 'cursor-zoom-in'
                  }`}
                />
              ) : (
                <div className="flex h-full items-center justify-center text-stone-400">
                  Sin imagen
                </div>
              )}
            </button>
            <div className="mt-3 flex gap-2 overflow-x-auto">
              {images.map((img, index) => (
                <button
                  key={img.imagen_url || index}
                  type="button"
                  onClick={() => {
                    setActive(index);
                    setZoomed(false);
                  }}
                  className={`h-20 w-20 shrink-0 overflow-hidden rounded-xl ring-2 ${
                    index === active ? 'ring-[#3d2c29]' : 'ring-transparent'
                  }`}
                  aria-label={`Imagen ${index + 1}`}
                >
                  {img.imagen_url ? (
                    <img
                      src={cloudinaryUrl(img.imagen_url, { width: 160 })}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  ) : null}
                </button>
              ))}
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <p className="text-xs uppercase tracking-[0.2em] text-stone-500">
              {p.categoria?.nombre}
            </p>
            <h1 className="font-[family-name:Georgia,serif] text-4xl leading-tight">
              {p.nombre}
            </h1>
            <p className="text-sm text-stone-500">Código: {p.codigo}</p>
            <div className="flex items-end gap-3">
              <p className="text-3xl font-semibold">
                {formatPublicPrice(p.precio_venta, config?.moneda)}
              </p>
              {offer ? (
                <p className="text-lg text-stone-400 line-through">
                  {formatPublicPrice(p.precio_anterior, config?.moneda)}
                </p>
              ) : null}
            </div>
            <p className="text-sm">
              Disponibilidad:{' '}
              <strong>{p.estado_disponibilidad}</strong>
              {showStock && p.stock_visible != null
                ? ` · Stock: ${p.stock_visible}`
                : ''}
            </p>
            {p.material ? <p className="text-sm">Material: {p.material}</p> : null}
            {p.color_estilo ? (
              <p className="text-sm">Color / estilo: {p.color_estilo}</p>
            ) : null}
            {p.descripcion_corta ? (
              <p className="text-base text-stone-600">{p.descripcion_corta}</p>
            ) : null}
            {p.descripcion_completa ? (
              <p className="whitespace-pre-line text-sm leading-relaxed text-stone-600">
                {p.descripcion_completa}
              </p>
            ) : null}

            {wa ? (
              <a
                href={wa}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#25D366] px-6 py-4 text-base font-semibold text-white shadow-lg shadow-emerald-900/10 transition hover:brightness-105 sm:w-auto"
              >
                <FaWhatsapp className="h-5 w-5" />
                Consultar por WhatsApp
              </a>
            ) : null}
          </motion.div>
        </div>

        <section className="mt-16">
          <h2 className="mb-6 font-[family-name:Georgia,serif] text-3xl">
            Productos relacionados
          </h2>
          {relatedQuery.isLoading ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          ) : related.length === 0 ? (
            <p className="text-stone-500">No hay relacionados por ahora.</p>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {related.map((item) => (
                <ProductCard key={item.id_producto} product={item} />
              ))}
            </div>
          )}
        </section>
      </div>
    </>
  );
}
