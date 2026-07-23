import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import {
  getAlertasStock,
  getDashboardResumen,
  getMovimientosDiarios,
  getMovimientosPorTipo,
  getSinMovimiento,
  getStockCategoria,
  getTopProductos,
  getUltimosMovimientos
} from '../api/dashboardApi';

const PERIODS = [
  { value: 'hoy', label: 'Hoy' },
  { value: '7dias', label: 'Últimos 7 días' },
  { value: 'mes', label: 'Este mes' },
  { value: 'mes_anterior', label: 'Mes anterior' },
  { value: 'anio', label: 'Este año' },
  { value: 'custom', label: 'Rango personalizado' }
];

export function useDashboardPeriod() {
  const [params, setParams] = useSearchParams();
  const periodo = params.get('periodo') || 'mes';
  const desde = params.get('desde') || '';
  const hasta = params.get('hasta') || '';

  const query = useMemo(() => {
    if (periodo === 'custom' && desde && hasta) {
      return { desde, hasta };
    }
    if (periodo === 'custom') {
      return { periodo: 'mes' };
    }
    return { periodo };
  }, [periodo, desde, hasta]);

  function setPeriodo(value) {
    const next = new URLSearchParams(params);
    next.set('periodo', value);
    if (value !== 'custom') {
      next.delete('desde');
      next.delete('hasta');
    }
    setParams(next, { replace: true });
  }

  function setRango(from, to) {
    const next = new URLSearchParams(params);
    next.set('periodo', 'custom');
    next.set('desde', from);
    next.set('hasta', to);
    setParams(next, { replace: true });
  }

  return { periodo, desde, hasta, query, setPeriodo, setRango, PERIODS };
}

export function useDashboard() {
  const { query, ...period } = useDashboardPeriod();

  const resumen = useQuery({
    queryKey: ['dashboard', 'resumen', query],
    queryFn: () => getDashboardResumen(query),
    staleTime: 30_000
  });

  const diarios = useQuery({
    queryKey: ['dashboard', 'diarios', query],
    queryFn: () => getMovimientosDiarios(query),
    staleTime: 30_000
  });

  const stockCat = useQuery({
    queryKey: ['dashboard', 'stock-categoria'],
    queryFn: getStockCategoria,
    staleTime: 30_000
  });

  const top = useQuery({
    queryKey: ['dashboard', 'top', query],
    queryFn: () => getTopProductos({ ...query, limite: 10 }),
    staleTime: 30_000
  });

  const tipos = useQuery({
    queryKey: ['dashboard', 'tipos', query],
    queryFn: () => getMovimientosPorTipo(query),
    staleTime: 30_000
  });

  const alertas = useQuery({
    queryKey: ['dashboard', 'alertas'],
    queryFn: getAlertasStock,
    staleTime: 30_000
  });

  const movimientos = useQuery({
    queryKey: ['dashboard', 'ultimos'],
    queryFn: () => getUltimosMovimientos(10),
    staleTime: 30_000
  });

  const sinMov = useQuery({
    queryKey: ['dashboard', 'sin-movimiento'],
    queryFn: () => getSinMovimiento({ dias: 30 }),
    staleTime: 30_000
  });

  return {
    ...period,
    query,
    resumen,
    diarios,
    stockCat,
    top,
    tipos,
    alertas,
    movimientos,
    sinMov
  };
}
