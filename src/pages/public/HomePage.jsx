import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, EffectFade } from 'swiper/modules';
import { useQuery } from '@tanstack/react-query';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';
import Seo from '../../components/public/Seo';
import ProductCard from '../../components/public/ProductCard';
import ProductCardSkeleton from '../../components/public/ProductCardSkeleton';
import { useCatalog } from '../../context/CatalogContext';
import { useTiendaPath } from '../../hooks/useTiendaPath';
import { getFeaturedProducts, getRecentProducts } from '../../services/publicApi';
import { cloudinaryUrl, formatPublicPrice } from '../../utils/publicHelpers';

const MAX_PRODUCT_SLIDES = 4;

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.45 }
};

function productSlidesFrom(list, tp) {
  return (list || [])
    .filter((p) => p?.imagen_principal && p?.slug)
    .slice(0, MAX_PRODUCT_SLIDES)
    .map((p) => ({
      key: `producto-${p.id_producto}`,
      title: p.nombre,
      text:
        p.descripcion_corta ||
        (p.precio_venta != null
          ? formatPublicPrice(p.precio_venta)
          : 'Consulta disponibilidad por WhatsApp.'),
      image: p.imagen_principal,
      href: tp(`/producto/${p.slug}`),
      cta: 'Ver pieza'
    }));
}

export default function HomePage() {
  const { config, tiendaSlug } = useCatalog();
  const tp = useTiendaPath();
  const brand = config?.nombre_negocio || 'Tienda';

  const featuredQuery = useQuery({
    queryKey: ['public', tiendaSlug, 'destacados'],
    queryFn: () => getFeaturedProducts(8)
  });

  const recentQuery = useQuery({
    queryKey: ['public', tiendaSlug, 'recientes'],
    queryFn: () => getRecentProducts(8)
  });

  const featured = featuredQuery.data?.data || [];
  const recent = recentQuery.data?.data || [];

  const slides = useMemo(() => {
    const next = [];

    if (config?.portada_url) {
      next.push({
        key: 'portada',
        title: brand,
        text:
          config?.mensaje_bienvenida ||
          'Explora el catálogo y consulta por WhatsApp.',
        image: config.portada_url,
        href: tp('/productos'),
        cta: 'Ver catálogo'
      });
    }

    const fromFeatured = productSlidesFrom(featured, tp);
    const fromRecent = productSlidesFrom(recent, tp);

    // Evitar duplicar la misma imagen si un destacado también es reciente
    const seen = new Set(fromFeatured.map((s) => s.image));
    const extras = fromRecent.filter((s) => !seen.has(s.image));

    next.push(...fromFeatured);
    if (next.length < 2) {
      next.push(...extras.slice(0, MAX_PRODUCT_SLIDES - fromFeatured.length));
    }

    // Tienda sin portada ni fotos: hero de marca (sin imágenes globales del sistema)
    if (!next.length) {
      next.push({
        key: 'marca',
        title: brand,
        text:
          config?.mensaje_bienvenida ||
          'Pronto verás las piezas de esta tienda aquí.',
        image: null,
        href: tp('/productos'),
        cta: 'Ver catálogo'
      });
    }

    return next;
  }, [brand, config, featured, recent, tp]);

  const seoImage =
    config?.portada_url ||
    featured.find((p) => p.imagen_principal)?.imagen_principal ||
    recent.find((p) => p.imagen_principal)?.imagen_principal ||
    undefined;

  const canLoop = slides.length > 1;

  return (
    <>
      <Seo
        title="Inicio"
        description={
          config?.descripcion ||
          `${brand}. Catálogo público y consulta por WhatsApp.`
        }
        keywords="bisutería, accesorios, pulseras, collares, aretes, Costa Rica"
        path="/"
        image={seoImage}
      />

      <section className="relative overflow-hidden">
        <Swiper
          key={`${tiendaSlug}-${slides.length}`}
          modules={[Autoplay, Pagination, EffectFade]}
          effect="fade"
          fadeEffect={{ crossFade: true }}
          autoplay={
            canLoop
              ? { delay: 4800, disableOnInteraction: false }
              : false
          }
          pagination={canLoop ? { clickable: true } : false}
          loop={canLoop}
          className="public-hero-swiper h-[min(78svh,680px)] min-h-[360px] w-full sm:min-h-[420px] md:h-[min(72vh,760px)]"
        >
          {slides.map((slide, index) => {
            const src = slide.image
              ? cloudinaryUrl(slide.image, { width: 1800 })
              : null;
            return (
              <SwiperSlide key={slide.key}>
                <div className="relative flex h-full items-end bg-[#3d2c29]">
                  {src ? (
                    <img
                      src={src}
                      alt=""
                      decoding="async"
                      fetchPriority={index === 0 ? 'high' : 'auto'}
                      sizes="100vw"
                      className="absolute inset-0 h-full w-full scale-105 object-cover object-center sm:scale-100"
                    />
                  ) : (
                    <div
                      className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_#6b4f4a_0%,_#3d2c29_55%,_#1f1614_100%)]"
                      aria-hidden
                    />
                  )}
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(61,44,41,0.15)_0%,rgba(61,44,41,0.2)_40%,rgba(61,44,41,0.72)_78%,rgba(31,22,20,0.92)_100%)] sm:bg-[linear-gradient(180deg,rgba(61,44,41,0.2)_0%,rgba(61,44,41,0.25)_45%,rgba(61,44,41,0.78)_80%,rgba(31,22,20,0.94)_100%)]" />

                  <div className="relative z-10 mx-auto w-full max-w-6xl px-3 pb-14 pt-20 text-[#faf7f2] sm:px-4 sm:pb-16 sm:pt-24">
                    <motion.p
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-[11px] uppercase tracking-[0.22em] text-[#e8d5c4] sm:text-xs sm:tracking-[0.25em]"
                    >
                      {brand}
                    </motion.p>
                    <motion.h1
                      initial={{ opacity: 0, y: 18 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.08 }}
                      className="mt-2 max-w-2xl break-words font-[family-name:Georgia,serif] text-[1.75rem] leading-tight sm:mt-3 sm:text-5xl md:text-6xl"
                    >
                      {slide.title}
                    </motion.h1>
                    <motion.p
                      initial={{ opacity: 0, y: 18 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.15 }}
                      className="mt-3 max-w-xl text-sm text-[#f3e6d8]/95 sm:mt-4 sm:text-base md:text-lg"
                    >
                      {slide.text}
                    </motion.p>
                    <motion.div
                      initial={{ opacity: 0, y: 18 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.22 }}
                      className="mt-6 sm:mt-8"
                    >
                      <Link
                        to={slide.href}
                        className="inline-flex rounded-full bg-[#f3e6d8] px-5 py-2.5 text-sm font-semibold text-[#3d2c29] transition hover:bg-white sm:px-6 sm:py-3"
                      >
                        {slide.cta}
                      </Link>
                    </motion.div>
                  </div>
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12 sm:py-14">
        <motion.div {...fadeUp} className="mb-6 flex items-end justify-between gap-4">
          <h2 className="font-[family-name:Georgia,serif] text-3xl sm:text-4xl">
            Destacados
          </h2>
          <Link
            to={tp('/productos')}
            className="text-sm text-[#3d2c29] underline-offset-4 hover:underline"
          >
            Ver todo
          </Link>
        </motion.div>
        {featuredQuery.isLoading ? (
          <div className="grid gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        ) : featured.length === 0 ? (
          <p className="text-stone-500">Pronto habrá piezas destacadas.</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4">
            {featured.map((p) => (
              <ProductCard key={p.id_producto} product={p} />
            ))}
          </div>
        )}
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16">
        <motion.h2
          {...fadeUp}
          className="mb-6 font-[family-name:Georgia,serif] text-3xl sm:text-4xl"
        >
          Recientes
        </motion.h2>
        {recentQuery.isLoading ? (
          <div className="grid gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4">
            {recent.map((p) => (
              <ProductCard key={p.id_producto} product={p} />
            ))}
          </div>
        )}
      </section>
    </>
  );
}
