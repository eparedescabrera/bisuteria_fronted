import { Link, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import Seo from '../../components/public/Seo';
import ProductCard from '../../components/public/ProductCard';
import ProductCardSkeleton from '../../components/public/ProductCardSkeleton';
import {
  getPublicCategories,
  getPublicProducts
} from '../../services/publicApi';
import { cloudinaryUrl } from '../../utils/publicHelpers';

export default function CategoryPage() {
  const { slug } = useParams();

  const categoriesQuery = useQuery({
    queryKey: ['public', 'categorias'],
    queryFn: getPublicCategories
  });

  const productsQuery = useQuery({
    queryKey: ['public', 'productos', { categoria: slug }],
    queryFn: () =>
      getPublicProducts({ categoria: slug, pagina: 1, limite: 24, orden: 'recientes' }),
    enabled: Boolean(slug)
  });

  const category = (categoriesQuery.data?.data || []).find((c) => c.slug === slug);
  const products = productsQuery.data?.data || [];

  if (categoriesQuery.isSuccess && !category) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <Seo title="Categoría no encontrada" path={`/categoria/${slug}`} />
        <h1 className="font-[family-name:Georgia,serif] text-3xl">Categoría no encontrada</h1>
        <Link to="/productos" className="mt-6 inline-block underline">
          Ver catálogo
        </Link>
      </div>
    );
  }

  return (
    <>
      <Seo
        title={category?.nombre || 'Categoría'}
        description={category?.descripcion || `Productos de ${slug}`}
        path={`/categoria/${slug}`}
        image={category?.imagen_url}
      />

      <section className="relative overflow-hidden bg-[#3d2c29] text-[#f3e6d8]">
        {category?.imagen_url ? (
          <img
            src={cloudinaryUrl(category.imagen_url, { width: 1400 })}
            alt=""
            className="absolute inset-0 h-full w-full object-cover opacity-35"
          />
        ) : null}
        <div className="relative mx-auto max-w-6xl px-4 py-16">
          <p className="text-xs uppercase tracking-[0.2em] text-[#e8d5c4]">Categoría</p>
          <h1 className="mt-2 font-[family-name:Georgia,serif] text-4xl sm:text-5xl">
            {category?.nombre || '…'}
          </h1>
          {category?.descripcion ? (
            <p className="mt-3 max-w-2xl text-[#f3e6d8]/85">{category.descripcion}</p>
          ) : null}
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 py-10">
        {productsQuery.isLoading ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        ) : products.length === 0 ? (
          <p className="text-center text-stone-500">No hay productos en esta categoría.</p>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {products.map((p) => (
              <ProductCard key={p.id_producto} product={p} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
