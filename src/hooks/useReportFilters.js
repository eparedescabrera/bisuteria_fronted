import { useMemo, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';

const DEFAULTS = {
  periodo: 'mes',
  pagina: '1',
  limite: '25'
};

const EMPTY_KEYS = [];

export function useReportFilters(extraKeys = EMPTY_KEYS) {
  const [params, setParams] = useSearchParams();

  const filters = useMemo(() => {
    const base = {
      periodo: params.get('periodo') || DEFAULTS.periodo,
      desde: params.get('desde') || '',
      hasta: params.get('hasta') || '',
      pagina: params.get('pagina') || DEFAULTS.pagina,
      limite: params.get('limite') || DEFAULTS.limite,
      busqueda: params.get('busqueda') || '',
      tipo: params.get('tipo') || '',
      stock: params.get('stock') || '',
      id_categoria: params.get('id_categoria') || '',
      id_producto: params.get('id_producto') || '',
      dias: params.get('dias') || '30'
    };
    for (const key of extraKeys) {
      base[key] = params.get(key) || '';
    }
    return base;
  }, [params, extraKeys]);

  const apiParams = useMemo(() => {
    const q = {};
    if (filters.periodo === 'custom' && filters.desde && filters.hasta) {
      q.desde = filters.desde;
      q.hasta = filters.hasta;
    } else if (filters.periodo && filters.periodo !== 'custom') {
      q.periodo = filters.periodo;
    }
    if (filters.pagina) q.pagina = filters.pagina;
    if (filters.limite) q.limite = filters.limite;
    if (filters.busqueda) q.busqueda = filters.busqueda;
    if (filters.tipo) q.tipo = filters.tipo;
    if (filters.stock) q.stock = filters.stock;
    if (filters.id_categoria) q.id_categoria = filters.id_categoria;
    if (filters.id_producto) q.id_producto = filters.id_producto;
    if (filters.dias) q.dias = filters.dias;
    return q;
  }, [filters]);

  const setFilter = useCallback(
    (key, value) => {
      const next = new URLSearchParams(params);
      if (value === '' || value == null) next.delete(key);
      else next.set(key, String(value));
      if (key !== 'pagina') next.set('pagina', '1');
      setParams(next, { replace: true });
    },
    [params, setParams]
  );

  const setMany = useCallback(
    (obj) => {
      const next = new URLSearchParams(params);
      Object.entries(obj).forEach(([k, v]) => {
        if (v === '' || v == null) next.delete(k);
        else next.set(k, String(v));
      });
      setParams(next, { replace: true });
    },
    [params, setParams]
  );

  return { filters, apiParams, setFilter, setMany, params };
}
