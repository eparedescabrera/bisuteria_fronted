import { Link, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getProduct } from '../../api/productsApi';
import { listMovements } from '../../api/inventoryApi';
import PageHeader from '../../components/common/PageHeader';
import Breadcrumb from '../../components/common/Breadcrumb';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import ProductImage from '../../components/common/ProductImage';
import Spinner from '../../components/feedback/Spinner';
import ErrorState from '../../components/feedback/ErrorState';
import { formatCRC } from '../../utils/currency';
import { formatDateTime, getApiErrorMessage } from '../../utils/formatters';

export default function ProductDetailPage() {
  const { id } = useParams();

  const productQuery = useQuery({
    queryKey: ['producto', id],
    queryFn: () => getProduct(id)
  });

  const movementsQuery = useQuery({
    queryKey: ['inventario', { id_producto: id }],
    queryFn: () => listMovements({ id_producto: id, pagina: 1, limite: 10 })
  });

  if (productQuery.isLoading) return <Spinner />;
  if (productQuery.isError) {
    return (
      <ErrorState
        message={getApiErrorMessage(productQuery.error)}
        onRetry={() => productQuery.refetch()}
      />
    );
  }

  const p = productQuery.data.data;
  const principal =
    p.imagenes?.find((i) => i.es_principal)?.imagen_url ||
    p.imagenes?.[0]?.imagen_url;
  const lowStock = p.stock_actual <= p.stock_minimo;
  const movements = movementsQuery.data?.data || [];

  return (
    <div>
      <Breadcrumb
        items={[
          { label: 'Admin', to: '/admin' },
          { label: 'Productos', to: '/admin/productos' },
          { label: p.nombre }
        ]}
      />
      <PageHeader
        title={p.nombre}
        description={`Código ${p.codigo}`}
        actions={
          <div className="flex flex-wrap gap-2">
            <Link to={`/admin/productos/${id}/editar`}>
              <Button>Editar producto</Button>
            </Link>
            <Link to={`/admin/inventario?producto=${id}&tipo=Entrada`}>
              <Button variant="success">Registrar entrada</Button>
            </Link>
            <Link to={`/admin/inventario?producto=${id}&tipo=Salida`}>
              <Button variant="danger">Registrar salida</Button>
            </Link>
          </div>
        }
      />

      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <ProductImage
            src={principal}
            alt={p.nombre}
            className="h-64 w-full rounded-xl object-cover"
          />
          <div className="mt-3 flex flex-wrap gap-2">
            {(p.imagenes || []).map((img) => (
              <img
                key={img.id_imagen}
                src={img.imagen_url}
                alt=""
                className="h-14 w-14 rounded-lg object-cover ring-1 ring-slate-200"
              />
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex flex-wrap gap-2">
              <Badge tone={p.estado_publicacion === 'Publicado' ? 'green' : 'slate'}>
                {p.estado_publicacion}
              </Badge>
              <Badge tone={p.estado_disponibilidad === 'Agotado' ? 'red' : 'blue'}>
                {p.estado_disponibilidad}
              </Badge>
              {p.destacado ? <Badge tone="amber">Destacado</Badge> : null}
              {lowStock ? <Badge tone="amber">Stock bajo</Badge> : null}
              {!p.activo ? <Badge tone="red">Inactivo</Badge> : null}
            </div>

            <dl className="mt-4 grid gap-3 sm:grid-cols-2">
              <div>
                <dt className="text-xs text-slate-500">Categoría</dt>
                <dd className="font-medium">{p.categoria?.nombre}</dd>
              </div>
              <div>
                <dt className="text-xs text-slate-500">Precio</dt>
                <dd className="font-medium">{formatCRC(p.precio_venta)}</dd>
              </div>
              <div>
                <dt className="text-xs text-slate-500">Stock</dt>
                <dd className={`font-medium ${lowStock ? 'text-amber-700' : ''}`}>
                  {p.stock_actual} / mín. {p.stock_minimo}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-slate-500">Unidad</dt>
                <dd className="font-medium">{p.unidad_medida}</dd>
              </div>
              <div>
                <dt className="text-xs text-slate-500">Creado</dt>
                <dd className="font-medium">{formatDateTime(p.fecha_creacion)}</dd>
              </div>
              <div>
                <dt className="text-xs text-slate-500">Actualizado</dt>
                <dd className="font-medium">{formatDateTime(p.fecha_actualizacion)}</dd>
              </div>
            </dl>

            {p.descripcion_corta ? (
              <p className="mt-4 text-sm text-slate-600">{p.descripcion_corta}</p>
            ) : null}
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <h3 className="mb-3 text-sm font-semibold text-slate-800">
              Movimientos recientes
            </h3>
            {movementsQuery.isLoading ? (
              <Spinner />
            ) : movements.length === 0 ? (
              <p className="text-sm text-slate-500">Sin movimientos</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full text-left text-sm">
                  <thead className="text-slate-500">
                    <tr>
                      <th className="pb-2 pr-3 font-medium">Fecha</th>
                      <th className="pb-2 pr-3 font-medium">Tipo</th>
                      <th className="pb-2 pr-3 font-medium">Cant.</th>
                      <th className="pb-2 pr-3 font-medium">Stock</th>
                      <th className="pb-2 font-medium">Motivo</th>
                    </tr>
                  </thead>
                  <tbody>
                    {movements.map((m) => (
                      <tr key={m.id_movimiento} className="border-t border-slate-100">
                        <td className="py-2 pr-3">{formatDateTime(m.fecha_movimiento)}</td>
                        <td className="py-2 pr-3">{m.tipo_movimiento}</td>
                        <td className="py-2 pr-3">{m.cantidad}</td>
                        <td className="py-2 pr-3">
                          {m.stock_anterior} → {m.stock_nuevo}
                        </td>
                        <td className="py-2">{m.motivo}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
