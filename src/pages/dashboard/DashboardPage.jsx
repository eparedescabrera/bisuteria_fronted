import { RefreshCw, Download } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { useDashboard } from '../../hooks/useDashboard';
import { exportarReporte } from '../../api/reportApi';
import PageHeader from '../../components/common/PageHeader';
import Breadcrumb from '../../components/common/Breadcrumb';
import Button from '../../components/common/Button';
import ProductImage from '../../components/common/ProductImage';
import ErrorState from '../../components/feedback/ErrorState';
import KpiCard from '../../components/dashboard/KpiCard';
import InventoryMovementChart from '../../components/dashboard/InventoryMovementChart';
import {
  StockByCategoryChart,
  InventoryDistributionChart,
  MovementsByTypeChart
} from '../../components/dashboard/StockByCategoryChart';
import TopProductsChart from '../../components/dashboard/TopProductsChart';
import { formatCRC } from '../../utils/currency';
import { formatDateTime, getApiErrorMessage } from '../../utils/formatters';
import { toastError, toastSuccess } from '../../components/feedback/alerts';

function ChartCard({ title, children }) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <h3 className="mb-3 text-sm font-semibold text-slate-800">{title}</h3>
      {children}
    </section>
  );
}

export default function DashboardPage() {
  const queryClient = useQueryClient();
  const {
    periodo,
    desde,
    hasta,
    setPeriodo,
    setRango,
    PERIODS,
    query,
    resumen,
    diarios,
    stockCat,
    top,
    tipos,
    alertas,
    movimientos,
    sinMov
  } = useDashboard();

  if (resumen.isError) {
    return (
      <ErrorState
        message={getApiErrorMessage(
          resumen.error,
          'No fue posible cargar el reporte. Intente nuevamente.'
        )}
        onRetry={() => resumen.refetch()}
      />
    );
  }

  const data = resumen.data?.data || {};
  const kpis = data.kpis || {};
  const comp = data.comparacion || {};
  const periodoLabel = data.periodo?.label || 'Este mes';
  const alertasData = alertas.data?.data || { stock_bajo: [], agotados: [] };

  async function handleExport() {
    try {
      const result = await exportarReporte({
        ...query,
        reporte: 'inventario',
        formato: 'xlsx'
      });
      toastSuccess(`Archivo generado: ${result.filename}`);
    } catch (error) {
      toastError(
        getApiErrorMessage(error, 'No se pudo generar el archivo solicitado.')
      );
    }
  }

  function refresh() {
    queryClient.invalidateQueries({ queryKey: ['dashboard'] });
  }

  return (
    <div>
      <Breadcrumb items={[{ label: 'Admin', to: '/admin' }, { label: 'Dashboard' }]} />
      <PageHeader
        title="Dashboard"
        description={`Período: ${periodoLabel}${
          data.periodo?.desde ? ` (${data.periodo.desde} → ${data.periodo.hasta})` : ''
        }`}
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <select
              className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
              value={periodo}
              onChange={(e) => setPeriodo(e.target.value)}
              aria-label="Selector de período"
            >
              {PERIODS.map((p) => (
                <option key={p.value} value={p.value}>
                  {p.label}
                </option>
              ))}
            </select>
            {periodo === 'custom' && (
              <>
                <input
                  type="date"
                  className="rounded-lg border border-slate-300 px-2 py-2 text-sm"
                  value={desde}
                  onChange={(e) => setRango(e.target.value, hasta || e.target.value)}
                />
                <input
                  type="date"
                  className="rounded-lg border border-slate-300 px-2 py-2 text-sm"
                  value={hasta}
                  onChange={(e) => setRango(desde || e.target.value, e.target.value)}
                />
              </>
            )}
            <Button type="button" variant="secondary" onClick={refresh}>
              <RefreshCw className="h-4 w-4" aria-hidden />
              Actualizar
            </Button>
            <Button type="button" onClick={handleExport}>
              <Download className="h-4 w-4" aria-hidden />
              Exportar resumen
            </Button>
          </div>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          label="Productos activos"
          value={kpis.productosActivos ?? data.total_productos ?? 0}
          to="/admin/productos"
          tone="blue"
          loading={resumen.isLoading}
        />
        <KpiCard
          label="Unidades en inventario"
          value={kpis.unidadesInventario ?? 0}
          to="/admin/inventario"
          tone="slate"
          loading={resumen.isLoading}
        />
        <KpiCard
          label="Stock bajo"
          value={kpis.stockBajo ?? 0}
          to="/admin/reportes?tab=stock"
          tone="amber"
          loading={resumen.isLoading}
        />
        <KpiCard
          label="Agotados"
          value={kpis.agotados ?? 0}
          to="/admin/reportes?tab=stock&stock=agotado"
          tone="red"
          loading={resumen.isLoading}
        />
        <KpiCard
          label="Entradas"
          value={kpis.entradas ?? 0}
          comparison={comp.entradasPorcentaje}
          to="/admin/inventario"
          tone="green"
          loading={resumen.isLoading}
        />
        <KpiCard
          label="Salidas"
          value={kpis.salidas ?? 0}
          comparison={comp.salidasPorcentaje}
          to="/admin/inventario"
          tone="amber"
          loading={resumen.isLoading}
        />
        <KpiCard
          label="Valor a venta"
          value={formatCRC(kpis.valorVenta ?? data.valor_inventario)}
          comparisonLabel="costo: No disponible"
          to="/admin/reportes?tab=valoracion"
          tone="slate"
          loading={resumen.isLoading}
        />
        <KpiCard
          label="Movimientos"
          value={kpis.movimientos ?? 0}
          comparison={comp.movimientosPorcentaje}
          to="/admin/inventario"
          tone="blue"
          loading={resumen.isLoading}
        />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <ChartCard title="Entradas y salidas por día">
          <InventoryMovementChart
            data={diarios.data?.data || []}
            loading={diarios.isLoading}
          />
        </ChartCard>
        <ChartCard title="Stock por categoría">
          <StockByCategoryChart
            data={stockCat.data?.data || []}
            loading={stockCat.isLoading}
          />
        </ChartCard>
        <ChartCard title="Top 10 productos con más salidas">
          <TopProductsChart data={top.data?.data || []} loading={top.isLoading} />
        </ChartCard>
        <ChartCard title="Distribución del inventario">
          <InventoryDistributionChart
            data={stockCat.data?.data || []}
            loading={stockCat.isLoading}
          />
        </ChartCard>
        <ChartCard title="Movimientos por tipo">
          <MovementsByTypeChart
            data={tipos.data?.data || []}
            loading={tipos.isLoading}
          />
        </ChartCard>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-800">
              Productos con stock bajo
            </h3>
            <Link to="/admin/reportes?tab=stock" className="text-sm text-navy-600 hover:underline">
              Ver reporte
            </Link>
          </div>
          {(alertasData.stock_bajo || []).length === 0 ? (
            <p className="text-sm text-slate-500">No hay productos con stock bajo.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead className="text-slate-500">
                  <tr>
                    <th className="pb-2 pr-2">Img</th>
                    <th className="pb-2 pr-2">Código</th>
                    <th className="pb-2 pr-2">Nombre</th>
                    <th className="pb-2 pr-2">Categoría</th>
                    <th className="pb-2 pr-2">Stock</th>
                    <th className="pb-2 pr-2">Mín.</th>
                    <th className="pb-2">Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {alertasData.stock_bajo.slice(0, 8).map((p) => (
                    <tr key={p.id_producto} className="border-t border-slate-100">
                      <td className="py-2 pr-2">
                        <ProductImage src={p.imagen_url} alt={p.nombre} className="h-10 w-10 rounded object-cover" />
                      </td>
                      <td className="py-2 pr-2">{p.codigo}</td>
                      <td className="py-2 pr-2">{p.nombre}</td>
                      <td className="py-2 pr-2">{p.categoria}</td>
                      <td className="py-2 pr-2 text-amber-700">{p.stock_actual}</td>
                      <td className="py-2 pr-2">{p.stock_minimo}</td>
                      <td className="py-2">
                        <Link
                          to={`/admin/productos/${p.id_producto}`}
                          className="text-navy-600 hover:underline"
                        >
                          Ver
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <h3 className="mb-3 text-sm font-semibold text-slate-800">Productos agotados</h3>
          {(alertasData.agotados || []).length === 0 ? (
            <p className="text-sm text-slate-500">No hay productos agotados.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead className="text-slate-500">
                  <tr>
                    <th className="pb-2 pr-2">Img</th>
                    <th className="pb-2 pr-2">Código</th>
                    <th className="pb-2 pr-2">Nombre</th>
                    <th className="pb-2 pr-2">Categoría</th>
                    <th className="pb-2 pr-2">Última salida</th>
                    <th className="pb-2">Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {alertasData.agotados.slice(0, 8).map((p) => (
                    <tr key={p.id_producto} className="border-t border-slate-100">
                      <td className="py-2 pr-2">
                        <ProductImage src={p.imagen_url} alt={p.nombre} className="h-10 w-10 rounded object-cover" />
                      </td>
                      <td className="py-2 pr-2">{p.codigo}</td>
                      <td className="py-2 pr-2">{p.nombre}</td>
                      <td className="py-2 pr-2">{p.categoria}</td>
                      <td className="py-2 pr-2">{formatDateTime(p.ultima_salida)}</td>
                      <td className="py-2">
                        <Link
                          to={`/admin/productos/${p.id_producto}`}
                          className="text-navy-600 hover:underline"
                        >
                          Ver
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <h3 className="mb-3 text-sm font-semibold text-slate-800">Últimos movimientos</h3>
          {(movimientos.data?.data || []).length === 0 ? (
            <p className="text-sm text-slate-500">
              No hay movimientos para el período seleccionado.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead className="text-slate-500">
                  <tr>
                    <th className="pb-2 pr-2">Fecha</th>
                    <th className="pb-2 pr-2">Producto</th>
                    <th className="pb-2 pr-2">Tipo</th>
                    <th className="pb-2 pr-2">Cant.</th>
                    <th className="pb-2 pr-2">Ant.→Nuevo</th>
                    <th className="pb-2">Usuario</th>
                  </tr>
                </thead>
                <tbody>
                  {(movimientos.data?.data || []).map((m) => (
                    <tr key={m.id_movimiento} className="border-t border-slate-100">
                      <td className="py-2 pr-2 whitespace-nowrap">
                        {formatDateTime(m.fecha_movimiento)}
                      </td>
                      <td className="py-2 pr-2">{m.producto}</td>
                      <td className="py-2 pr-2">{m.tipo_movimiento}</td>
                      <td className="py-2 pr-2">{m.cantidad}</td>
                      <td className="py-2 pr-2">
                        {m.stock_anterior} → {m.stock_nuevo}
                      </td>
                      <td className="py-2">{m.nombre_usuario}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <h3 className="mb-3 text-sm font-semibold text-slate-800">Sin movimiento (30 días)</h3>
          {(sinMov.data?.data || []).length === 0 ? (
            <p className="text-sm text-slate-500">No hay productos sin movimiento.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead className="text-slate-500">
                  <tr>
                    <th className="pb-2 pr-2">Producto</th>
                    <th className="pb-2 pr-2">Categoría</th>
                    <th className="pb-2 pr-2">Stock</th>
                    <th className="pb-2">Días</th>
                  </tr>
                </thead>
                <tbody>
                  {(sinMov.data?.data || []).slice(0, 10).map((p) => (
                    <tr key={p.id_producto} className="border-t border-slate-100">
                      <td className="py-2 pr-2">{p.nombre}</td>
                      <td className="py-2 pr-2">{p.categoria}</td>
                      <td className="py-2 pr-2">{p.stock_actual}</td>
                      <td className="py-2">{p.dias_sin_movimiento}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
