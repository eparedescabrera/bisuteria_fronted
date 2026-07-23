import { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import Seo from '../../components/public/Seo';
import ProductCard from '../../components/public/ProductCard';
import ProductCardSkeleton from '../../components/public/ProductCardSkeleton';
import {
  getPublicCategories,
  getPublicProducts
} from '../../services/publicApi';
import { useDebounce } from '../../hooks/useDebounce';

/**
 * Orden Doc 3: recientes, precio_asc, precio_desc, nombre_asc...
 * "Más vendidos" no existe en backend → se mapea a destacados (filtro) + recientes.
 */
const ORDENES = [
  { value: 'recientes', label: 'Más recientes' },
  { value: 'precio_asc', label: 'Menor precio' },
  { value: 'precio_desc', label: 'Mayor precio' },
  { value: 'destacados', label: 'Destacados' }
];

export default function PublicProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [busqueda, setBusqueda] = useState(searchParams.get('busqueda') || '');
  const debounced = useDebounce(busqueda);

  const filters = useMemo(
    () => ({
      busqueda: debounced || undefined,
      categoria: searchParams.get('categoria') || undefined,
      disponible: searchParams.get('disponible') || undefined,
      orden:
        searchParams.get('orden') === 'destacados'
          ? 'recientes'
          : searchParams.get('orden') || 'recientes',
      destacado:
        searchParams.get('orden') === 'destacados' ? true : undefined,
      pagina: Number(searchParams.get('pagina') || 1),
      limite: 12
    }),
    [debounced, searchParams]
  );

  const categoriesQuery = useQuery({
    queryKey: ['public', 'categorias'],
    queryFn: getPublicCategories
  });

  const productsQuery = useQuery({
    queryKey: ['public', 'productos', filters],
    queryFn: () => getPublicProducts(filters),
    placeholderData: (prev) => prev
  });

  const updateParam = (key, value) => {
    const next = new URLSearchParams(searchParams);
    if (!value) next.delete(key);
    else next.set(key, value);
    if (key !== 'pagina') next.delete('pagina');
    setSearchParams(next);
  };

  const products = productsQuery.data?.data || [];
  const meta = productsQuery.data?.meta || { pagina: 1, totalPaginas: 1, total: 0 };
  const categories = categoriesQuery.data?.data || [];

  return (
    <>
      <Seo
        title="Productos"
        description="Explora el catálogo de Accesorios Anny. Filtra por categoría, precio y disponibilidad."
        path="/productos"
        keywords="catálogo, bisutería, productos, accesorios"
      />

      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="mb-6">
          <p className="text-xs uppercase tracking-[0.2em] text-stone-500">Catálogo</p>
          <h1 className="mt-2 font-[family-name:Georgia,serif] text-3xl sm:text-4xl">
            Productos
          </h1>
        </div>

        {categories.length > 0 ? (
          <div className="-mx-4 mb-5 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0">
            <button
              type="button"
              onClick={() => updateParam('categoria', '')}
              className={`shrink-0 rounded-full px-4 py-1.5 text-sm transition ${
                !searchParams.get('categoria')
                  ? 'bg-[#3d2c29] text-[#f3e6d8]'
                  : 'bg-white text-[#3d2c29] ring-1 ring-stone-200 hover:bg-stone-50'
              }`}
            >
              Todas
            </button>
            {categories.map((c) => {
              const active = searchParams.get('categoria') === c.slug;
              return (
                <button
                  key={c.id_categoria}
                  type="button"
                  onClick={() => updateParam('categoria', c.slug)}
                  className={`shrink-0 rounded-full px-4 py-1.5 text-sm transition ${
                    active
                      ? 'bg-[#3d2c29] text-[#f3e6d8]'
                      : 'bg-white text-[#3d2c29] ring-1 ring-stone-200 hover:bg-stone-50'
                  }`}
                >
                  {c.nombre}
                </button>
              );
            })}
          </div>
        ) : null}

        <div className="mb-6 grid gap-3 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-stone-200 md:grid-cols-2 lg:grid-cols-5">
          <label className="block text-sm">
            <span className="mb-1 block text-stone-500">Buscar</span>
            <input
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Nombre, código…"
              className="w-full rounded-xl border border-stone-300 px-3 py-2"
            />
          </label>
          <label className="block text-sm">
            <span className="mb-1 block text-stone-500">Categoría</span>
            <select
              value={searchParams.get('categoria') || ''}
              onChange={(e) => updateParam('categoria', e.target.value)}
              className="w-full rounded-xl border border-stone-300 px-3 py-2"
            >
              <option value="">Todas</option>
              {categories.map((c) => (
                <option key={c.id_categoria} value={c.slug}>
                  {c.nombre}
                </option>
              ))}
            </select>
          </label>
          <label className="block text-sm">
            <span className="mb-1 block text-stone-500">Disponibilidad</span>
            <select
              value={searchParams.get('disponible') || ''}
              onChange={(e) => updateParam('disponible', e.target.value)}
              className="w-full rounded-xl border border-stone-300 px-3 py-2"
            >
              <option value="">Todas</option>
              <option value="true">Disponible</option>
            </select>
          </label>
          <label className="block text-sm">
            <span className="mb-1 block text-stone-500">Orden</span>
            <select
              value={searchParams.get('orden') || 'recientes'}
              onChange={(e) => updateParam('orden', e.target.value)}
              className="w-full rounded-xl border border-stone-300 px-3 py-2"
            >
              {ORDENES.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </label>
          <div className="flex items-end">
            <Link
              to="/productos"
              className="w-full rounded-xl border border-stone-300 px-3 py-2 text-center text-sm hover:bg-stone-50"
            >
              Limpiar
            </Link>
          </div>
        </div>

        {productsQuery.isLoading ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        ) : productsQuery.isError ? (
          <div className="rounded-2xl bg-red-50 p-8 text-center text-red-700">
            No se pudo cargar el catálogo.
            <button
              type="button"
              className="mt-3 block w-full underline"
              onClick={() => productsQuery.refetch()}
            >
              Reintentar
            </button>
          </div>
        ) : products.length === 0 ? (
          <div className="rounded-2xl bg-white p-10 text-center ring-1 ring-stone-200">
            <p className="font-[family-name:Georgia,serif] text-2xl">Sin resultados</p>
            <p className="mt-2 text-stone-500">Prueba otra búsqueda o categoría.</p>
          </div>
        ) : (
          <>
            <p className="mb-4 text-sm text-stone-500">{meta.total} producto(s)</p>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {products.map((p) => (
                <ProductCard key={p.id_producto} product={p} />
              ))}
            </div>
            <div className="mt-8 flex justify-center gap-3">
              <button
                type="button"
                disabled={meta.pagina <= 1}
                onClick={() => updateParam('pagina', String(meta.pagina - 1))}
                className="rounded-full border border-stone-300 px-4 py-2 text-sm disabled:opacity-40"
              >
                Anterior
              </button>
              <span className="px-2 py-2 text-sm text-stone-500">
                {meta.pagina} / {meta.totalPaginas}
              </span>
              <button
                type="button"
                disabled={meta.pagina >= meta.totalPaginas}
                onClick={() => updateParam('pagina', String(meta.pagina + 1))}
                className="rounded-full border border-stone-300 px-4 py-2 text-sm disabled:opacity-40"
              >
                Siguiente
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
}
