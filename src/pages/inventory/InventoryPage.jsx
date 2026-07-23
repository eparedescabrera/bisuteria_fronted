import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AlertTriangle } from 'lucide-react';
import {
  createMovement,
  listLowStock,
  listMovements
} from '../../api/inventoryApi';
import { listProducts } from '../../api/productsApi';
import {
  inventorySchema,
  MOTIVOS_INVENTARIO
} from '../../schemas/inventorySchema';
import PageHeader from '../../components/common/PageHeader';
import Breadcrumb from '../../components/common/Breadcrumb';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import FormField, { inputClass } from '../../components/forms/FormField';
import Spinner from '../../components/feedback/Spinner';
import EmptyState from '../../components/feedback/EmptyState';
import ErrorState from '../../components/feedback/ErrorState';
import { toastError, toastSuccess } from '../../components/feedback/alerts';
import { formatDateTime, getApiErrorMessage } from '../../utils/formatters';
import { TIPOS_MOVIMIENTO } from '../../utils/constants';

const TIPOS_FORM = TIPOS_MOVIMIENTO.filter((t) => t !== 'Stock inicial');

function exportKardexCsv(rows) {
  const header = [
    'Fecha',
    'Producto',
    'Codigo',
    'Tipo',
    'Cantidad',
    'StockAnterior',
    'StockNuevo',
    'Motivo',
    'Observacion',
    'Usuario'
  ];
  const lines = rows.map((m) =>
    [
      m.fecha_movimiento,
      `"${(m.producto || '').replace(/"/g, '""')}"`,
      m.codigo,
      m.tipo_movimiento,
      m.cantidad,
      m.stock_anterior,
      m.stock_nuevo,
      `"${(m.motivo || '').replace(/"/g, '""')}"`,
      `"${(m.referencia || '').replace(/"/g, '""')}"`,
      m.nombre_usuario
    ].join(',')
  );
  const blob = new Blob([[header.join(','), ...lines].join('\n')], {
    type: 'text/csv;charset=utf-8;'
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `kardex-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export default function InventoryPage() {
  const [searchParams] = useSearchParams();
  const queryClient = useQueryClient();
  const [filters, setFilters] = useState({
    id_producto: searchParams.get('producto') || '',
    tipo_movimiento: '',
    periodo: '',
    fecha_desde: '',
    fecha_hasta: '',
    busqueda: '',
    pagina: 1,
    limite: 15
  });
  const [showForm, setShowForm] = useState(
    Boolean(searchParams.get('producto') || searchParams.get('tipo'))
  );

  const productsQuery = useQuery({
    queryKey: ['productos', 'select-inventario'],
    queryFn: () => listProducts({ pagina: 1, limite: 100, orden: 'nombre_asc' })
  });

  const stockBajoQuery = useQuery({
    queryKey: ['inventario', 'stock-bajo'],
    queryFn: listLowStock
  });

  const movementsQuery = useQuery({
    queryKey: ['inventario', 'kardex', filters],
    queryFn: () =>
      listMovements({
        id_producto: filters.id_producto || undefined,
        tipo_movimiento: filters.tipo_movimiento || undefined,
        periodo: filters.periodo || undefined,
        fecha_desde: !filters.periodo && filters.fecha_desde
          ? filters.fecha_desde
          : undefined,
        fecha_hasta: !filters.periodo && filters.fecha_hasta
          ? filters.fecha_hasta
          : undefined,
        busqueda: filters.busqueda || undefined,
        pagina: filters.pagina,
        limite: filters.limite
      }),
    placeholderData: (prev) => prev
  });

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: zodResolver(inventorySchema),
    defaultValues: {
      id_producto: searchParams.get('producto') || '',
      tipo_movimiento: searchParams.get('tipo') || 'Entrada',
      cantidad: 1,
      motivo: 'Compra',
      referencia: ''
    }
  });

  useEffect(() => {
    if (searchParams.get('producto')) {
      setValue('id_producto', searchParams.get('producto'));
    }
    if (searchParams.get('tipo')) {
      setValue('tipo_movimiento', searchParams.get('tipo'));
    }
  }, [searchParams, setValue]);

  const selectedId = watch('id_producto');
  const tipoActual = watch('tipo_movimiento');
  const selectedProduct = useMemo(
    () =>
      (productsQuery.data?.data || []).find(
        (p) => String(p.id_producto) === String(selectedId)
      ),
    [productsQuery.data, selectedId]
  );

  const mutation = useMutation({
    mutationFn: (values) =>
      createMovement({
        id_producto: Number(values.id_producto),
        tipo_movimiento: values.tipo_movimiento,
        cantidad: Number(values.cantidad),
        motivo: values.motivo,
        referencia: values.referencia || null
      }),
    onSuccess: async (response) => {
      await queryClient.invalidateQueries({ queryKey: ['inventario'] });
      await queryClient.invalidateQueries({ queryKey: ['productos'] });
      await queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      const data = response.data;
      toastSuccess(
        `Movimiento registrado. Stock: ${data.stock_anterior} → ${data.stock_nuevo}`
      );
      if (data.alerta_stock_bajo) {
        toastError('Alerta: el producto quedó en stock bajo');
      }
      reset({
        id_producto: selectedId || '',
        tipo_movimiento: 'Entrada',
        cantidad: 1,
        motivo: 'Compra',
        referencia: ''
      });
      setShowForm(false);
    },
    onError: (error) => toastError(getApiErrorMessage(error))
  });

  const rows = movementsQuery.data?.data || [];
  const meta = movementsQuery.data?.meta || { pagina: 1, totalPaginas: 1 };
  const stockBajo = stockBajoQuery.data?.data || [];

  const openForm = (tipo) => {
    setValue('tipo_movimiento', tipo);
    if (tipo === 'Entrada') setValue('motivo', 'Compra');
    if (tipo === 'Salida') setValue('motivo', 'Venta');
    if (tipo === 'Ajuste positivo' || tipo === 'Ajuste negativo') {
      setValue('motivo', 'Corrección');
    }
    setShowForm(true);
  };

  return (
    <div>
      <Breadcrumb items={[{ label: 'Admin', to: '/admin' }, { label: 'Inventario' }]} />
      <PageHeader
        title="Inventario / Kardex"
        description="Todo cambio de stock se registra como movimiento. No se edita ni elimina el historial."
        actions={
          <div className="flex flex-wrap gap-2">
            <Button onClick={() => openForm('Entrada')}>Entrada</Button>
            <Button variant="danger" onClick={() => openForm('Salida')}>
              Salida
            </Button>
            <Button variant="secondary" onClick={() => openForm('Ajuste positivo')}>
              Ajuste +
            </Button>
            <Button variant="secondary" onClick={() => openForm('Ajuste negativo')}>
              Ajuste −
            </Button>
            <Button
              variant="secondary"
              onClick={() => exportKardexCsv(rows)}
              disabled={!rows.length}
            >
              Exportar CSV
            </Button>
          </div>
        }
      />

      {stockBajo.length > 0 ? (
        <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-4 text-red-800">
          <div className="flex items-start gap-2">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" />
            <div>
              <p className="font-semibold">
                Productos con stock bajo ({stockBajo.length})
              </p>
              <ul className="mt-2 space-y-1 text-sm">
                {stockBajo.slice(0, 5).map((p) => (
                  <li key={p.id_producto}>
                    <Link
                      to={`/admin/productos/${p.id_producto}`}
                      className="underline"
                    >
                      {p.nombre}
                    </Link>
                    : {p.stock_actual} / mín. {p.stock_minimo}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      ) : null}

      {showForm ? (
        <form
          onSubmit={handleSubmit((values) => {
            if (
              (values.tipo_movimiento === 'Salida' ||
                values.tipo_movimiento === 'Ajuste negativo') &&
              selectedProduct &&
              Number(values.cantidad) > selectedProduct.stock_actual
            ) {
              toastError('Stock insuficiente');
              return;
            }
            mutation.mutate(values);
          })}
          className="mb-6 grid gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm md:grid-cols-2"
        >
          <FormField label="Producto" name="id_producto" error={errors.id_producto?.message}>
            <select id="id_producto" className={inputClass} {...register('id_producto')}>
              <option value="">Seleccione</option>
              {(productsQuery.data?.data || []).map((p) => (
                <option key={p.id_producto} value={p.id_producto}>
                  {p.codigo} — {p.nombre} (stock {p.stock_actual})
                </option>
              ))}
            </select>
          </FormField>
          <FormField label="Tipo" name="tipo_movimiento" error={errors.tipo_movimiento?.message}>
            <select id="tipo_movimiento" className={inputClass} {...register('tipo_movimiento')}>
              {TIPOS_FORM.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </FormField>
          <FormField label="Cantidad" name="cantidad" error={errors.cantidad?.message}>
            <input id="cantidad" type="number" className={inputClass} {...register('cantidad')} />
          </FormField>
          <FormField label="Motivo" name="motivo" error={errors.motivo?.message}>
            <select id="motivo" className={inputClass} {...register('motivo')}>
              {MOTIVOS_INVENTARIO.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </FormField>
          <div className="md:col-span-2">
            <FormField
              label="Observación / referencia"
              name="referencia"
              hint="Opcional. Doc 2 usa el campo referencia."
            >
              <input id="referencia" className={inputClass} {...register('referencia')} />
            </FormField>
          </div>
          {selectedProduct ? (
            <p className="text-sm text-slate-600 md:col-span-2">
              Stock actual: <strong>{selectedProduct.stock_actual}</strong>
              {tipoActual === 'Correccion'
                ? ' · En Corrección, la cantidad es el stock objetivo final.'
                : null}
            </p>
          ) : null}
          <div className="flex justify-end gap-2 md:col-span-2">
            <Button type="button" variant="secondary" onClick={() => setShowForm(false)}>
              Cancelar
            </Button>
            <Button type="submit" loading={isSubmitting || mutation.isPending}>
              Guardar movimiento
            </Button>
          </div>
        </form>
      ) : null}

      <div className="mb-4 grid gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm md:grid-cols-3 xl:grid-cols-6">
        <FormField label="Producto" name="filtro_producto">
          <select
            id="filtro_producto"
            className={inputClass}
            value={filters.id_producto}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, id_producto: e.target.value, pagina: 1 }))
            }
          >
            <option value="">Todos</option>
            {(productsQuery.data?.data || []).map((p) => (
              <option key={p.id_producto} value={p.id_producto}>
                {p.nombre}
              </option>
            ))}
          </select>
        </FormField>
        <FormField label="Tipo" name="filtro_tipo">
          <select
            id="filtro_tipo"
            className={inputClass}
            value={filters.tipo_movimiento}
            onChange={(e) =>
              setFilters((prev) => ({
                ...prev,
                tipo_movimiento: e.target.value,
                pagina: 1
              }))
            }
          >
            <option value="">Todos</option>
            {TIPOS_MOVIMIENTO.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </FormField>
        <FormField label="Periodo" name="periodo">
          <select
            id="periodo"
            className={inputClass}
            value={filters.periodo}
            onChange={(e) =>
              setFilters((prev) => ({
                ...prev,
                periodo: e.target.value,
                fecha_desde: '',
                fecha_hasta: '',
                pagina: 1
              }))
            }
          >
            <option value="">Personalizado</option>
            <option value="hoy">Hoy</option>
            <option value="semana">Semana</option>
            <option value="mes">Mes</option>
          </select>
        </FormField>
        <FormField label="Desde" name="fecha_desde">
          <input
            id="fecha_desde"
            type="date"
            className={inputClass}
            disabled={Boolean(filters.periodo)}
            value={filters.fecha_desde}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, fecha_desde: e.target.value, pagina: 1 }))
            }
          />
        </FormField>
        <FormField label="Hasta" name="fecha_hasta">
          <input
            id="fecha_hasta"
            type="date"
            className={inputClass}
            disabled={Boolean(filters.periodo)}
            value={filters.fecha_hasta}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, fecha_hasta: e.target.value, pagina: 1 }))
            }
          />
        </FormField>
        <FormField label="Buscar" name="busqueda">
          <input
            id="busqueda"
            className={inputClass}
            placeholder="Producto, código, motivo"
            value={filters.busqueda}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, busqueda: e.target.value, pagina: 1 }))
            }
          />
        </FormField>
      </div>

      {movementsQuery.isLoading ? (
        <Spinner label="Cargando Kardex" />
      ) : movementsQuery.isError ? (
        <ErrorState
          message={getApiErrorMessage(movementsQuery.error)}
          onRetry={() => movementsQuery.refetch()}
        />
      ) : rows.length === 0 ? (
        <EmptyState
          title="Sin movimientos"
          description="Registra una entrada o salida para iniciar el Kardex."
          action={<Button onClick={() => openForm('Entrada')}>Registrar entrada</Button>}
        />
      ) : (
        <>
          <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-500">
                <tr>
                  <th className="px-4 py-3 font-medium">Fecha</th>
                  <th className="px-4 py-3 font-medium">Producto</th>
                  <th className="px-4 py-3 font-medium">Tipo</th>
                  <th className="px-4 py-3 font-medium">Cant.</th>
                  <th className="px-4 py-3 font-medium">Stock</th>
                  <th className="px-4 py-3 font-medium">Motivo</th>
                  <th className="px-4 py-3 font-medium">Observación</th>
                  <th className="px-4 py-3 font-medium">Usuario</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((m) => (
                  <tr key={m.id_movimiento} className="border-t border-slate-100">
                    <td className="px-4 py-3 whitespace-nowrap">
                      {formatDateTime(m.fecha_movimiento)}
                    </td>
                    <td className="px-4 py-3">
                      <Link
                        to={`/admin/productos/${m.id_producto}`}
                        className="font-medium text-navy-700 hover:underline"
                      >
                        {m.producto}
                      </Link>
                      <p className="text-xs text-slate-500">{m.codigo}</p>
                    </td>
                    <td className="px-4 py-3">
                      <Badge
                        tone={
                          m.tipo_movimiento.includes('Salida') ||
                          m.tipo_movimiento.includes('negativo')
                            ? 'red'
                            : 'green'
                        }
                      >
                        {m.tipo_movimiento}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">{m.cantidad}</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {m.stock_anterior} → {m.stock_nuevo}
                    </td>
                    <td className="px-4 py-3">{m.motivo}</td>
                    <td className="px-4 py-3">{m.referencia || '—'}</td>
                    <td className="px-4 py-3">{m.nombre_usuario}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4 flex items-center justify-between gap-3">
            <p className="text-sm text-slate-500">
              Página {meta.pagina} de {meta.totalPaginas}
            </p>
            <div className="flex gap-2">
              <Button
                variant="secondary"
                disabled={filters.pagina <= 1}
                onClick={() =>
                  setFilters((prev) => ({ ...prev, pagina: prev.pagina - 1 }))
                }
              >
                Anterior
              </Button>
              <Button
                variant="secondary"
                disabled={filters.pagina >= meta.totalPaginas}
                onClick={() =>
                  setFilters((prev) => ({ ...prev, pagina: prev.pagina + 1 }))
                }
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
