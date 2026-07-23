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
import { getFeaturedProducts, getRecentProducts } from '../../services/publicApi';
import { cloudinaryUrl } from '../../utils/publicHelpers';

const LOCAL_SLIDES = [
  {
    title: 'Hecho a mano',
    text: 'Tejidos y detalles artesanales para tu día a día.',
    image: '/images/slide-cactus.png',
    local: true,
    position: 'object-center'
  },
  {
    title: 'Personalízalo',
    text: 'Iniciales, colores y diseños pensados para ti.',
    image: '/images/slide-iniciales.png',
    local: true,
    position: 'object-[center_40%]'
  }
];

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.45 }
};

export default function HomePage() {
  const { config } = useCatalog();
  const brand = config?.nombre_negocio || 'Accesorios Anny';

  const featuredQuery = useQuery({
    queryKey: ['public', 'destacados'],
    queryFn: () => getFeaturedProducts(8)
  });

  const recentQuery = useQuery({
    queryKey: ['public', 'recientes'],
    queryFn: () => getRecentProducts(8)
  });

  const slides = [
    {
      title: brand,
      text:
        config?.mensaje_bienvenida ||
        'Bisutería artesanal para destacar tu estilo cada día.',
      image: config?.portada_url || LOCAL_SLIDES[0].image,
      local: !config?.portada_url,
      position: 'object-center'
    },
    ...LOCAL_SLIDES
  ];

  const featured = featuredQuery.data?.data || [];
  const recent = recentQuery.data?.data || [];

  return (
    <>
      <Seo
        title="Inicio"
        description={
          config?.descripcion ||
          'Catálogo de bisutería Accesorios Anny. Consulta por WhatsApp.'
        }
        keywords="bisutería, accesorios, pulseras, collares, aretes, Costa Rica"
        path="/"
        image={
          config?.portada_url ||
          `${typeof window !== 'undefined' ? window.location.origin : ''}/images/slide-cactus.png`
        }
      />

      <section className="relative overflow-hidden">
        <Swiper
          modules={[Autoplay, Pagination, EffectFade]}
          effect="fade"
          fadeEffect={{ crossFade: true }}
          autoplay={{ delay: 4800, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          loop
          className="public-hero-swiper h-[min(78svh,680px)] min-h-[360px] w-full sm:min-h-[420px] md:h-[min(72vh,760px)]"
        >
          {slides.map((slide, index) => {
            const src = slide.local
              ? slide.image
              : cloudinaryUrl(slide.image, { width: 1800 });
            return (
              <SwiperSlide key={`${slide.title}-${index}`}>
                <div className="relative flex h-full items-end bg-[#3d2c29]">
                  <img
                    src={src}
                    alt=""
                    decoding="async"
                    fetchPriority={index === 0 ? 'high' : 'auto'}
                    sizes="100vw"
                    className={`absolute inset-0 h-full w-full object-cover ${slide.position || 'object-center'} scale-105 sm:scale-100`}
                  />
                  {/* Overlay suave: más claro en móvil para ver la pieza */}
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(61,44,41,0.15)_0%,rgba(61,44,41,0.2)_40%,rgba(61,44,41,0.72)_78%,rgba(31,22,20,0.92)_100%)] sm:bg-[linear-gradient(180deg,rgba(61,44,41,0.2)_0%,rgba(61,44,41,0.25)_45%,rgba(61,44,41,0.78)_80%,rgba(31,22,20,0.94)_100%)]" />

                  <div className="relative z-10 mx-auto w-full max-w-6xl px-3 pb-14 pt-20 text-[#faf7f2] sm:px-4 sm:pb-16 sm:pt-24">
                    <motion.p
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-[11px] uppercase tracking-[0.22em] text-[#e8d5c4] sm:text-xs sm:tracking-[0.25em]"
                    >
                      Catálogo público
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
                        to="/productos"
                        className="inline-flex rounded-full bg-[#f3e6d8] px-5 py-2.5 text-sm font-semibold text-[#3d2c29] transition hover:bg-white sm:px-6 sm:py-3"
                      >
                        Ver catálogo
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
            to="/productos"
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
