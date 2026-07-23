import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import { useQuery } from '@tanstack/react-query';
import 'swiper/css';
import 'swiper/css/pagination';
import Seo from '../../components/public/Seo';
import ProductCard from '../../components/public/ProductCard';
import ProductCardSkeleton from '../../components/public/ProductCardSkeleton';
import { useCatalog } from '../../context/CatalogContext';
import {
  getFeaturedProducts,
  getPublicCategories,
  getRecentProducts
} from '../../services/publicApi';
import { cloudinaryUrl } from '../../utils/publicHelpers';

export default function HomePage() {
  const { config } = useCatalog();

  const categoriesQuery = useQuery({
    queryKey: ['public', 'categorias'],
    queryFn: getPublicCategories,
    staleTime: 5 * 60 * 1000
  });

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
      title: config?.nombre_negocio || 'Accesorios Anny',
      text:
        config?.mensaje_bienvenida ||
        'Bisutería artesanal para destacar tu estilo cada día.',
      image: config?.portada_url
    },
    {
      title: 'Piezas con intención',
      text: 'Consulta disponibilidad y diseños por WhatsApp.',
      image: config?.portada_url
    }
  ];

  const categories = categoriesQuery.data?.data || [];
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
        image={config?.portada_url || config?.logo_url}
      />

      <section className="relative overflow-hidden">
        <Swiper
          modules={[Autoplay, Pagination]}
          autoplay={{ delay: 4500, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          loop
          className="h-[70vh] min-h-[420px] w-full"
        >
          {slides.map((slide, index) => (
            <SwiperSlide key={index}>
              <div className="relative flex h-full items-end bg-[#3d2c29]">
                {slide.image ? (
                  <img
                    src={cloudinaryUrl(slide.image, { width: 1600 })}
                    alt=""
                    className="absolute inset-0 h-full w-full object-cover opacity-55"
                  />
                ) : (
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,#8b6b5c,transparent_50%),linear-gradient(135deg,#3d2c29,#1f1614)]" />
                )}
                <div className="relative z-10 mx-auto w-full max-w-6xl px-4 pb-16 pt-24 text-[#faf7f2]">
                  <motion.p
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-xs uppercase tracking-[0.25em] text-[#e8d5c4]"
                  >
                    Catálogo público
                  </motion.p>
                  <motion.h1
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.08 }}
                    className="mt-3 max-w-2xl font-[family-name:Georgia,serif] text-4xl leading-tight sm:text-5xl md:text-6xl"
                  >
                    {slide.title}
                  </motion.h1>
                  <motion.p
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                    className="mt-4 max-w-xl text-base text-[#f3e6d8]/90 sm:text-lg"
                  >
                    {slide.text}
                  </motion.p>
                  <motion.div
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.22 }}
                    className="mt-8"
                  >
                    <Link
                      to="/productos"
                      className="inline-flex rounded-full bg-[#f3e6d8] px-6 py-3 text-sm font-semibold text-[#3d2c29] transition hover:bg-white"
                    >
                      Ver catálogo
                    </Link>
                  </motion.div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </section>

      <section id="categorias" className="mx-auto max-w-6xl px-4 py-14">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-stone-500">Explorar</p>
            <h2 className="mt-2 font-[family-name:Georgia,serif] text-3xl">Categorías</h2>
          </div>
          <Link to="/productos" className="text-sm text-[#3d2c29] underline-offset-4 hover:underline">
            Ver todo
          </Link>
        </div>
        {categoriesQuery.isLoading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-40 animate-pulse rounded-2xl bg-stone-200" />
            ))}
          </div>
        ) : categories.length === 0 ? (
          <p className="text-stone-500">No hay categorías publicadas.</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((cat) => (
              <Link
                key={cat.id_categoria}
                to={`/categoria/${cat.slug}`}
                className="group relative overflow-hidden rounded-2xl bg-[#3d2c29] text-[#f3e6d8]"
              >
                {cat.imagen_url ? (
                  <img
                    src={cloudinaryUrl(cat.imagen_url, { width: 800 })}
                    alt={cat.nombre}
                    loading="lazy"
                    className="absolute inset-0 h-full w-full object-cover opacity-45 transition duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="absolute inset-0 bg-[linear-gradient(135deg,#5c433a,#2a1e1c)]" />
                )}
                <div className="relative flex min-h-40 flex-col justify-end p-5">
                  <h3 className="font-[family-name:Georgia,serif] text-2xl">{cat.nombre}</h3>
                  <p className="mt-1 line-clamp-2 text-sm text-[#f3e6d8]/80">
                    {cat.descripcion || 'Ver piezas de esta categoría'}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-14">
        <h2 className="mb-6 font-[family-name:Georgia,serif] text-3xl">Destacados</h2>
        {featuredQuery.isLoading ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        ) : featured.length === 0 ? (
          <p className="text-stone-500">Pronto habrá piezas destacadas.</p>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {featured.map((p) => (
              <ProductCard key={p.id_producto} product={p} />
            ))}
          </div>
        )}
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16">
        <h2 className="mb-6 font-[family-name:Georgia,serif] text-3xl">Recientes</h2>
        {recentQuery.isLoading ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {recent.map((p) => (
              <ProductCard key={p.id_producto} product={p} />
            ))}
          </div>
        )}
      </section>
    </>
  );
}
