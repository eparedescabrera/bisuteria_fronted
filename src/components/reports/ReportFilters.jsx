import Button from '../common/Button';

const PERIODS = [
  { value: 'hoy', label: 'Hoy' },
  { value: '7dias', label: 'Últimos 7 días' },
  { value: 'mes', label: 'Este mes' },
  { value: 'mes_anterior', label: 'Mes anterior' },
  { value: 'anio', label: 'Este año' },
  { value: 'custom', label: 'Personalizado' }
];

const TIPOS = [
  { value: '', label: 'Todos los tipos' },
  { value: 'ENTRADA', label: 'Entradas' },
  { value: 'SALIDA', label: 'Salidas' },
  { value: 'AJUSTE', label: 'Ajustes' }
];

const STOCK = [
  { value: '', label: 'Todo el stock' },
  { value: 'agotado', label: 'Agotados' },
  { value: 'bajo', label: 'Stock bajo' },
  { value: 'normal', label: 'Normal' }
];

export default function ReportFilters({
  filters,
  setFilter,
  setMany,
  showTipo = false,
  showStock = false,
  showBusqueda = true,
  showDias = false,
  categories = []
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <label className="block text-sm">
          <span className="mb-1 block text-slate-600">Período</span>
          <select
            className="w-full rounded-lg border border-slate-300 px-3 py-2"
            value={filters.periodo}
            onChange={(e) => setFilter('periodo', e.target.value)}
          >
            {PERIODS.map((p) => (
              <option key={p.value} value={p.value}>
                {p.label}
              </option>
            ))}
          </select>
        </label>

        {filters.periodo === 'custom' && (
          <>
            <label className="block text-sm">
              <span className="mb-1 block text-slate-600">Desde</span>
              <input
                type="date"
                className="w-full rounded-lg border border-slate-300 px-3 py-2"
                value={filters.desde}
                onChange={(e) => setFilter('desde', e.target.value)}
              />
            </label>
            <label className="block text-sm">
              <span className="mb-1 block text-slate-600">Hasta</span>
              <input
                type="date"
                className="w-full rounded-lg border border-slate-300 px-3 py-2"
                value={filters.hasta}
                onChange={(e) => setFilter('hasta', e.target.value)}
              />
            </label>
          </>
        )}

        {categories.length > 0 && (
          <label className="block text-sm">
            <span className="mb-1 block text-slate-600">Categoría</span>
            <select
              className="w-full rounded-lg border border-slate-300 px-3 py-2"
              value={filters.id_categoria}
              onChange={(e) => setFilter('id_categoria', e.target.value)}
            >
              <option value="">Todas</option>
              {categories.map((c) => (
                <option key={c.id_categoria} value={c.id_categoria}>
                  {c.nombre}
                </option>
              ))}
            </select>
          </label>
        )}

        {showTipo && (
          <label className="block text-sm">
            <span className="mb-1 block text-slate-600">Tipo de movimiento</span>
            <select
              className="w-full rounded-lg border border-slate-300 px-3 py-2"
              value={filters.tipo}
              onChange={(e) => setFilter('tipo', e.target.value)}
            >
              {TIPOS.map((t) => (
                <option key={t.value || 'all'} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </label>
        )}

        {showStock && (
          <label className="block text-sm">
            <span className="mb-1 block text-slate-600">Estado de stock</span>
            <select
              className="w-full rounded-lg border border-slate-300 px-3 py-2"
              value={filters.stock}
              onChange={(e) => setFilter('stock', e.target.value)}
            >
              {STOCK.map((s) => (
                <option key={s.value || 'all'} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </label>
        )}

        {showBusqueda && (
          <label className="block text-sm sm:col-span-2">
            <span className="mb-1 block text-slate-600">Producto / código</span>
            <input
              type="search"
              className="w-full rounded-lg border border-slate-300 px-3 py-2"
              placeholder="Buscar…"
              value={filters.busqueda}
              onChange={(e) => setFilter('busqueda', e.target.value)}
            />
          </label>
        )}

        {showDias && (
          <label className="block text-sm">
            <span className="mb-1 block text-slate-600">Días sin movimiento</span>
            <input
              type="number"
              min={7}
              max={365}
              className="w-full rounded-lg border border-slate-300 px-3 py-2"
              value={filters.dias}
              onChange={(e) => setFilter('dias', e.target.value)}
            />
          </label>
        )}
      </div>

      <div className="mt-3 flex justify-end">
        <Button
          type="button"
          variant="ghost"
          onClick={() =>
            setMany({
              periodo: 'mes',
              desde: '',
              hasta: '',
              busqueda: '',
              tipo: '',
              stock: '',
              id_categoria: '',
              id_producto: '',
              dias: '30',
              pagina: '1'
            })
          }
        >
          Limpiar filtros
        </Button>
      </div>
    </div>
  );
}
