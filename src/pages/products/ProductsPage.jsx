import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { deleteProduct, listProducts, patchPublicacion } from '../../api/productsApi';
import { listCategories } from '../../api/categoriesApi';
import PageHeader from '../../components/common/PageHeader';
import Breadcrumb from '../../components/common/Breadcrumb';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import ProductImage from '../../components/common/ProductImage';
import FormField, { inputClass } from '../../components/forms/FormField';
import Spinner from '../../components/feedback/Spinner';
import EmptyState from '../../components/feedback/EmptyState';
import ErrorState from '../../components/feedback/ErrorState';
import {
  confirmAction,
  toastError,
  toastSuccess
} from '../../components/feedback/alerts';
import { useDebounce } from '../../hooks/useDebounce';
import { formatCRC } from '../../utils/currency';
import { getApiErrorMessage } from '../../utils/formatters';
import {
  DISPONIBILIDADES,
  ORDEN_PRODUCTOS,
  PUBLICACIONES
} from '../../utils/constants';

export default function ProductsPage() {
  const queryClient = useQueryClient();
  const [filters, setFilters] = useState({
    busqueda: '',
    categoria: '',
    publicacion: '',
    disponibilidad: '',
    stock_bajo: '',
    orden: 'recientes',
    pagina: 1,
    limite: 10
  });
  const debouncedSearch = useDebounce(filters.busqueda);

  const categoriasQuery = useQuery({
    queryKey: ['categorias', 'select'],
    queryFn: () => listCategories({ limite: 100, pagina: 1 })
  });

  const query = useQuery({
    queryKey: ['productos', { ...filters, busqueda: debouncedSearch }],
    queryFn: () =>
      listProducts({
        busqueda: debouncedSearch || undefined,
        categoria: filters.categoria || undefined,
        publicacion: filters.publicacion || undefined,
        disponibilidad: filters.disponibilidad || undefined,
        stock_bajo: filters.stock_bajo || undefined,
        orden: filters.orden,
        pagina: filters.pagina,
        limite: filters.limite
      }),
    placeholderData: (prev) => prev
  });

  const deleteMutation = useMutation({
    mutationFn: deleteProduct,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['productos'] });
      toastSuccess('Producto desactivado');
    },
    onError: (error) => toastError(getApiErrorMessage(error))
  });

  const pubMutation = useMutation({
    mutationFn: ({ id, estado_publicacion }) =>
      patchPublicacion(id, estado_publicacion),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['productos'] });
      toastSuccess('Publicación actualizada');
    },
    onError: (error) => toastError(getApiErrorMessage(error))
  });

  const rows = useMemo(() => query.data?.data || [], [query.data]);
  const meta = query.data?.meta || { pagina: 1, totalPaginas: 1, total: 0 };
  const categorias = categoriasQuery.data?.data || [];

  const updateFilter = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value, pagina: key === 'pagina' ? value : 1 }));
  };

  return (
    <div>
      <Breadcrumb items={[{ label: 'Admin', to: '/admin' }, { label: 'Productos' }]} />
      <PageHeader
        title="Productos"
        description="Gestión del catálogo e inventario comercial"
        actions={
          <Link to="/admin/productos/nuevo">
            <Button>Nuevo producto</Button>
          </Link>
        }
      />

      <div className="mb-4 grid gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm md:grid-cols-3 xl:grid-cols-6">
        <FormField label="Buscar" name="busqueda">
          <input
            id="busqueda"
            className={inputClass}
            value={filters.busqueda}
            onChange={(e) => updateFilter('busqueda', e.target.value)}
            placeholder="Nombre, código o marca"
          />
        </FormField>
        <FormField label="Categoría" name="categoria">
          <select
            id="categoria"
            className={inputClass}
            value={filters.categoria}
            onChange={(e) => updateFilter('categoria', e.target.value)}
          >
            <option value="">Todas</option>
            {categorias.map((c) => (
              <option key={c.id_categoria} value={c.id_categoria}>
                {c.nombre}
              </option>
            ))}
          </select>
        </FormField>
        <FormField label="Publicación" name="publicacion">
          <select
            id="publicacion"
            className={inputClass}
            value={filters.publicacion}
            onChange={(e) => updateFilter('publicacion', e.target.value)}
          >
            <option value="">Todas</option>
            {PUBLICACIONES.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </FormField>
        <FormField label="Disponibilidad" name="disponibilidad">
          <select
            id="disponibilidad"
            className={inputClass}
            value={filters.disponibilidad}
            onChange={(e) => updateFilter('disponibilidad', e.target.value)}
          >
            <option value="">Todas</option>
            {DISPONIBILIDADES.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </FormField>
        <FormField label="Stock bajo" name="stock_bajo">
          <select
            id="stock_bajo"
            className={inputClass}
            value={filters.stock_bajo}
            onChange={(e) => updateFilter('stock_bajo', e.target.value)}
          >
            <option value="">Todos</option>
            <option value="true">Solo stock bajo</option>
          </select>
        </FormField>
        <FormField label="Orden" name="orden">
          <select
            id="orden"
            className={inputClass}
            value={filters.orden}
            onChange={(e) => updateFilter('orden', e.target.value)}
          >
            {ORDEN_PRODUCTOS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </FormField>
      </div>

      {query.isLoading ? (
        <Spinner />
      ) : query.isError ? (
        <ErrorState
          message={getApiErrorMessage(query.error)}
          onRetry={() => query.refetch()}
        />
      ) : rows.length === 0 ? (
        <EmptyState
          title="Sin productos"
          description="Crea el primer producto para el catálogo."
          action={
            <Link to="/admin/productos/nuevo">
              <Button>Nuevo producto</Button>
            </Link>
          }
        />
      ) : (
        <>
          <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
            <table className="min-w-[720px] w-full text-left text-sm sm:min-w-full">
              <thead className="bg-slate-50 text-slate-500">
                <tr>
                  <th className="px-3 py-3 font-medium sm:px-4">Producto</th>
                  <th className="hidden px-3 py-3 font-medium sm:table-cell sm:px-4">
                    Categoría
                  </th>
                  <th className="px-3 py-3 font-medium sm:px-4">Precio</th>
                  <th className="px-3 py-3 font-medium sm:px-4">Stock</th>
                  <th className="px-3 py-3 font-medium sm:px-4">Estado</th>
                  <th className="px-3 py-3 font-medium sm:px-4">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((item) => (
                  <tr key={item.id_producto} className="border-t border-slate-100">
                    <td className="px-3 py-3 sm:px-4">
                      <div className="flex max-w-[14rem] items-center gap-3 sm:max-w-none">
                        <ProductImage src={item.imagen_principal} alt={item.nombre} />
                        <div className="min-w-0">
                          <p className="truncate font-medium text-slate-800">{item.nombre}</p>
                          <p className="truncate text-xs text-slate-500">{item.codigo}</p>
                          <p className="mt-0.5 text-xs text-slate-500 sm:hidden">
                            {item.categoria}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="hidden px-3 py-3 sm:table-cell sm:px-4">
                      {item.categoria}
                    </td>
                    <td className="whitespace-nowrap px-3 py-3 sm:px-4">
                      {formatCRC(item.precio_venta)}
                    </td>
                    <td className="px-3 py-3 sm:px-4">
                      <span
                        className={
                          item.stock_actual <= item.stock_minimo
                            ? 'font-medium text-amber-700'
                            : ''
                        }
                      >
                        {item.stock_actual}
                      </span>
                    </td>
                    <td className="px-3 py-3 sm:px-4">
                      <div className="flex flex-col gap-1">
                        <Badge
                          tone={item.estado_publicacion === 'Publicado' ? 'green' : 'slate'}
                        >
                          {item.estado_publicacion}
                        </Badge>
                        <Badge
                          tone={
                            item.estado_disponibilidad === 'Agotado' ? 'red' : 'blue'
                          }
                        >
                          {item.estado_disponibilidad}
                        </Badge>
                      </div>
                    </td>
                    <td className="px-3 py-3 sm:px-4">
                      <div className="flex max-w-[16rem] flex-wrap gap-2 sm:max-w-none">
                        <Link to={`/admin/productos/${item.id_producto}`}>
                          <Button variant="secondary">Ver</Button>
                        </Link>
                        <Link to={`/admin/productos/${item.id_producto}/editar`}>
                          <Button variant="secondary">Editar</Button>
                        </Link>
                        <Button
                          variant="secondary"
                          onClick={() =>
                            pubMutation.mutate({
                              id: item.id_producto,
                              estado_publicacion:
                                item.estado_publicacion === 'Publicado'
                                  ? 'Oculto'
                                  : 'Publicado'
                            })
                          }
                        >
                          {item.estado_publicacion === 'Publicado' ? 'Ocultar' : 'Publicar'}
                        </Button>
                        <Button
                          variant="danger"
                          onClick={async () => {
                            const ok = await confirmAction({
                              title: '¿Desactivar producto?',
                              confirmText: 'Desactivar'
                            });
                            if (ok) deleteMutation.mutate(item.id_producto);
                          }}
                        >
                          Eliminar
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4 flex items-center justify-between gap-3">
            <p className="text-sm text-slate-500">
              {meta.total} resultado(s) · Página {meta.pagina} de {meta.totalPaginas}
            </p>
            <div className="flex gap-2">
              <Button
                variant="secondary"
                disabled={filters.pagina <= 1}
                onClick={() => updateFilter('pagina', filters.pagina - 1)}
              >
                Anterior
              </Button>
              <Button
                variant="secondary"
                disabled={filters.pagina >= meta.totalPaginas}
                onClick={() => updateFilter('pagina', filters.pagina + 1)}
              >
                Siguiente
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
