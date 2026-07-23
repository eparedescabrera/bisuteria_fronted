import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link, useSearchParams } from 'react-router-dom';
import {
  getReporteAjustes,
  getReporteInventario,
  getReporteKardex,
  getReportePorCategoria,
  getReporteRotacion,
  getReporteValoracion
} from '../../api/reportApi';
import { listCategories } from '../../api/categoriesApi';
import { useReportFilters } from '../../hooks/useReportFilters';
import PageHeader from '../../components/common/PageHeader';
import Breadcrumb from '../../components/common/Breadcrumb';
import Button from '../../components/common/Button';
import ProductImage from '../../components/common/ProductImage';
import Spinner from '../../components/feedback/Spinner';
import ErrorState from '../../components/feedback/ErrorState';
import ReportFilters from '../../components/reports/ReportFilters';
import ExportButtons from '../../components/reports/ExportButtons';
import { formatCRC } from '../../utils/currency';
import { formatDateTime, getApiErrorMessage } from '../../utils/formatters';

const TABS = [
  { id: 'inventario', label: 'Inventario actual' },
  { id: 'stock', label: 'Stock bajo y agotados' },
  { id: 'kardex', label: 'Kardex' },
  { id: 'entradas', label: 'Entradas' },
  { id: 'salidas', label: 'Salidas' },
  { id: 'rotacion', label: 'Rotación' },
  { id: 'categoria', label: 'Por categoría' },
  { id: 'valoracion', label: 'Valoración' },
  { id: 'ajustes', label: 'Ajustes' }
];

function Pagination({ meta, onPage }) {
  if (!meta) return null;
  return (
    <div className="mt-4 flex items-center justify-between text-sm text-slate-600">
      <span>
        Página {meta.pagina} de {meta.totalPaginas} · {meta.total} registros
      </span>
      <div className="flex gap-2">
        <Button
          type="button"
          variant="secondary"
          disabled={meta.pagina <= 1}
          onClick={() => onPage(meta.pagina - 1)}
        >
          Anterior
        </Button>
        <Button
          type="button"
          variant="secondary"
          disabled={meta.pagina >= meta.totalPaginas}
          onClick={() => onPage(meta.pagina + 1)}
        >
          Siguiente
        </Button>
      </div>
    </div>
  );
}

export default function ReportsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const tab = searchParams.get('tab') || 'inventario';
  const { filters, apiParams, setFilter, setMany } = useReportFilters();

  const categoriesQuery = useQuery({
    queryKey: ['categorias', 'all'],
    queryFn: () => listCategories({ limite: 100 })
  });
  const categories = categoriesQuery.data?.data || [];

  const exportReporte = useMemo(() => {
    if (tab === 'kardex' || tab === 'entradas' || tab === 'salidas') return 'kardex';
    if (tab === 'rotacion') return 'rotacion';
    if (tab === 'valoracion') return 'valoracion';
    if (tab === 'ajustes') return 'ajustes';
    return 'inventario';
  }, [tab]);

  const exportParams = useMemo(() => {
    const p = { ...apiParams };
    if (tab === 'entradas') p.tipo = 'ENTRADA';
    if (tab === 'salidas') p.tipo = 'SALIDA';
    if (tab === 'stock' && !p.stock) p.stock = 'bajo';
    if (searchParams.get('stock')) p.stock = searchParams.get('stock');
    return p;
  }, [apiParams, tab, searchParams]);

  const inventarioQuery = useQuery({
    queryKey: ['reportes', 'inventario', exportParams],
    queryFn: () => getReporteInventario(exportParams),
    enabled: tab === 'inventario' || tab === 'stock'
  });

  const kardexQuery = useQuery({
    queryKey: ['reportes', 'kardex', exportParams],
    queryFn: () => getReporteKardex(exportParams),
    enabled: tab === 'kardex' || tab === 'entradas' || tab === 'salidas'
  });

  const rotacionQuery = useQuery({
    queryKey: ['reportes', 'rotacion', apiParams],
    queryFn: () => getReporteRotacion(apiParams),
    enabled: tab === 'rotacion'
  });

  const valoracionQuery = useQuery({
    queryKey: ['reportes', 'valoracion'],
    queryFn: getReporteValoracion,
    enabled: tab === 'valoracion'
  });

  const ajustesQuery = useQuery({
    queryKey: ['reportes', 'ajustes', apiParams],
    queryFn: () => getReporteAjustes(apiParams),
    enabled: tab === 'ajustes'
  });

  const categoriaQuery = useQuery({
    queryKey: ['reportes', 'categoria'],
    queryFn: getReportePorCategoria,
    enabled: tab === 'categoria'
  });

  function setTab(id) {
    const next = new URLSearchParams(searchParams);
    next.set('tab', id);
    next.set('pagina', '1');
    if (id === 'stock' && !next.get('stock')) next.set('stock', 'bajo');
    if (id !== 'stock') next.delete('stock');
    setSearchParams(next, { replace: true });
  }

  function renderTable() {
    if (tab === 'inventario' || tab === 'stock') {
      if (inventarioQuery.isLoading) return <Spinner label="Cargando inventario" />;
      if (inventarioQuery.isError) {
        return (
          <ErrorState
            message={getApiErrorMessage(
              inventarioQuery.error,
              'No fue posible cargar el reporte. Intente nuevamente.'
            )}
            onRetry={() => inventarioQuery.refetch()}
          />
        );
      }
      const rows = inventarioQuery.data?.data || [];
      if (!rows.length) {
        return (
          <p className="py-8 text-center text-sm text-slate-500">
            {tab === 'stock'
              ? 'No hay productos con stock bajo.'
              : 'No hay productos para los filtros seleccionados.'}
          </p>
        );
      }
      return (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="text-slate-500">
                <tr>
                  <th className="pb-2 pr-2">Img</th>
                  <th className="pb-2 pr-2">Código</th>
                  <th className="pb-2 pr-2">Producto</th>
                  <th className="pb-2 pr-2">Categoría</th>
                  <th className="pb-2 pr-2">Stock</th>
                  <th className="pb-2 pr-2">Mín.</th>
                  <th className="pb-2 pr-2">Valor venta</th>
                  <th className="pb-2">Valor costo</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.id_producto} className="border-t border-slate-100">
                    <td className="py-2 pr-2">
                      <ProductImage
                        src={r.imagen_url}
                        alt={r.nombre}
                        className="h-10 w-10 rounded object-cover"
                      />
                    </td>
                    <td className="py-2 pr-2">{r.codigo}</td>
                    <td className="py-2 pr-2">
                      <Link
                        to={`/admin/productos/${r.id_producto}`}
                        className="text-navy-700 hover:underline"
                      >
                        {r.nombre}
                      </Link>
                    </td>
                    <td className="py-2 pr-2">{r.categoria}</td>
                    <td className="py-2 pr-2">{r.stock_actual}</td>
                    <td className="py-2 pr-2">{r.stock_minimo}</td>
                    <td className="py-2 pr-2">{formatCRC(r.valor_venta)}</td>
                    <td className="py-2 text-slate-500">No disponible</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pagination
            meta={inventarioQuery.data?.meta}
            onPage={(p) => setFilter('pagina', p)}
          />
        </>
      );
    }

    if (tab === 'kardex' || tab === 'entradas' || tab === 'salidas') {
      if (kardexQuery.isLoading) return <Spinner label="Cargando kardex" />;
      if (kardexQuery.isError) {
        return (
          <ErrorState
            message={getApiErrorMessage(kardexQuery.error)}
            onRetry={() => kardexQuery.refetch()}
          />
        );
      }
      const rows = kardexQuery.data?.data || [];
      if (!rows.length) {
        return (
          <p className="py-8 text-center text-sm text-slate-500">
            No hay movimientos para el período seleccionado.
          </p>
        );
      }
      return (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="text-slate-500">
                <tr>
                  <th className="pb-2 pr-2">Fecha</th>
                  <th className="pb-2 pr-2">Código</th>
                  <th className="pb-2 pr-2">Producto</th>
                  <th className="pb-2 pr-2">Tipo</th>
                  <th className="pb-2 pr-2">Cant.</th>
                  <th className="pb-2 pr-2">Stock</th>
                  <th className="pb-2 pr-2">Motivo</th>
                  <th className="pb-2">Usuario</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((m) => (
                  <tr key={m.id_movimiento} className="border-t border-slate-100">
                    <td className="py-2 pr-2 whitespace-nowrap">
                      {formatDateTime(m.fecha_movimiento)}
                    </td>
                    <td className="py-2 pr-2">{m.codigo}</td>
                    <td className="py-2 pr-2">{m.producto}</td>
                    <td className="py-2 pr-2">{m.tipo_movimiento}</td>
                    <td className="py-2 pr-2">{m.cantidad}</td>
                    <td className="py-2 pr-2">
                      {m.stock_anterior} → {m.stock_nuevo}
                    </td>
                    <td className="py-2 pr-2">{m.motivo}</td>
                    <td className="py-2">{m.nombre_usuario}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pagination
            meta={kardexQuery.data?.meta}
            onPage={(p) => setFilter('pagina', p)}
          />
        </>
      );
    }

    if (tab === 'rotacion') {
      if (rotacionQuery.isLoading) return <Spinner />;
      if (rotacionQuery.isError) {
        return <ErrorState message={getApiErrorMessage(rotacionQuery.error)} />;
      }
      const alta = rotacionQuery.data?.data?.alta_rotacion || [];
      const baja = rotacionQuery.data?.data?.baja_rotacion || [];
      return (
        <div className="grid gap-6 lg:grid-cols-2">
          <div>
            <h4 className="mb-2 text-sm font-semibold">Mayor rotación (salidas)</h4>
            {!alta.length ? (
              <p className="text-sm text-slate-500">Sin datos.</p>
            ) : (
              <ul className="space-y-2 text-sm">
                {alta.map((p) => (
                  <li
                    key={p.id_producto}
                    className="flex justify-between border-b border-slate-100 py-2"
                  >
                    <span>
                      {p.codigo} · {p.nombre}
                    </span>
                    <span className="font-medium">{p.unidades_salida}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div>
            <h4 className="mb-2 text-sm font-semibold">Baja rotación</h4>
            {!baja.length ? (
              <p className="text-sm text-slate-500">Sin datos.</p>
            ) : (
              <ul className="space-y-2 text-sm">
                {baja.map((p) => (
                  <li
                    key={p.id_producto}
                    className="flex justify-between border-b border-slate-100 py-2"
                  >
                    <span>
                      {p.codigo} · {p.nombre}
                    </span>
                    <span className="font-medium">{p.dias_sin_salida} días</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      );
    }

    if (tab === 'valoracion') {
      if (valoracionQuery.isLoading) return <Spinner />;
      const v = valoracionQuery.data?.data || {};
      return (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-lg border border-slate-200 p-4">
            <p className="text-xs uppercase text-slate-500">Valor a venta</p>
            <p className="mt-2 text-2xl font-semibold">{formatCRC(v.valor_venta)}</p>
          </div>
          <div className="rounded-lg border border-slate-200 p-4">
            <p className="text-xs uppercase text-slate-500">Valor a costo</p>
            <p className="mt-2 text-lg font-medium text-slate-600">
              {v.valor_costo_mensaje || 'No disponible'}
            </p>
            <p className="mt-1 text-xs text-slate-500">
              La valoración a costo no está disponible.
            </p>
          </div>
          <div className="rounded-lg border border-slate-200 p-4">
            <p className="text-xs uppercase text-slate-500">Utilidad potencial</p>
            <p className="mt-2 text-lg font-medium text-slate-600">No disponible</p>
            <p className="mt-1 text-xs text-slate-500">
              Requiere costo_unitario (no definido en Documento 2).
            </p>
          </div>
          <div className="rounded-lg border border-slate-200 p-4">
            <p className="text-xs uppercase text-slate-500">Productos activos</p>
            <p className="mt-2 text-2xl font-semibold">{v.productos_activos ?? 0}</p>
          </div>
          <div className="rounded-lg border border-slate-200 p-4">
            <p className="text-xs uppercase text-slate-500">Unidades</p>
            <p className="mt-2 text-2xl font-semibold">{v.unidades ?? 0}</p>
          </div>
        </div>
      );
    }

    if (tab === 'ajustes') {
      if (ajustesQuery.isLoading) return <Spinner />;
      const rows = ajustesQuery.data?.data || [];
      if (!rows.length) {
        return (
          <p className="py-8 text-center text-sm text-slate-500">
            No hay movimientos para el período seleccionado.
          </p>
        );
      }
      return (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="text-slate-500">
                <tr>
                  <th className="pb-2 pr-2">Fecha</th>
                  <th className="pb-2 pr-2">Producto</th>
                  <th className="pb-2 pr-2">Tipo</th>
                  <th className="pb-2 pr-2">Cant.</th>
                  <th className="pb-2 pr-2">Diferencia stock</th>
                  <th className="pb-2 pr-2">Motivo</th>
                  <th className="pb-2">Usuario</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((m) => (
                  <tr key={m.id_movimiento} className="border-t border-slate-100">
                    <td className="py-2 pr-2">{formatDateTime(m.fecha_movimiento)}</td>
                    <td className="py-2 pr-2">{m.producto}</td>
                    <td className="py-2 pr-2">{m.tipo_movimiento}</td>
                    <td className="py-2 pr-2">{m.cantidad}</td>
                    <td className="py-2 pr-2">
                      {m.stock_anterior} → {m.stock_nuevo}
                    </td>
                    <td className="py-2 pr-2">{m.motivo}</td>
                    <td className="py-2">{m.nombre_usuario}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pagination
            meta={ajustesQuery.data?.meta}
            onPage={(p) => setFilter('pagina', p)}
          />
        </>
      );
    }

    if (tab === 'categoria') {
      if (categoriaQuery.isLoading) return <Spinner />;
      const rows = categoriaQuery.data?.data || [];
      return (
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="text-slate-500">
              <tr>
                <th className="pb-2 pr-2">Categoría</th>
                <th className="pb-2 pr-2">Productos</th>
                <th className="pb-2 pr-2">Unidades</th>
                <th className="pb-2 pr-2">Valor venta</th>
                <th className="pb-2">Valor costo</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id_categoria} className="border-t border-slate-100">
                  <td className="py-2 pr-2">{r.categoria}</td>
                  <td className="py-2 pr-2">{r.productos}</td>
                  <td className="py-2 pr-2">{r.unidades}</td>
                  <td className="py-2 pr-2">{formatCRC(r.valor_venta)}</td>
                  <td className="py-2 text-slate-500">No disponible</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }

    return null;
  }

  return (
    <div>
      <Breadcrumb
        items={[
          { label: 'Admin', to: '/admin' },
          { label: 'Reportes' }
        ]}
      />
      <PageHeader
        title="Reportes"
        description="Inventario, kardex, rotación y valoración desde MySQL"
        actions={<ExportButtons reporte={exportReporte} params={exportParams} />}
      />

      <div className="mb-4 flex gap-2 overflow-x-auto pb-1">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium transition ${
              tab === t.id
                ? 'bg-navy-600 text-white'
                : 'bg-white text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab !== 'valoracion' && tab !== 'categoria' && (
        <div className="mb-4">
          <ReportFilters
            filters={filters}
            setFilter={setFilter}
            setMany={setMany}
            categories={categories}
            showTipo={tab === 'kardex'}
            showStock={tab === 'inventario' || tab === 'stock'}
            showDias={tab === 'rotacion'}
            showBusqueda={tab !== 'rotacion'}
          />
        </div>
      )}

      <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        {renderTable()}
      </section>
    </div>
  );
}
