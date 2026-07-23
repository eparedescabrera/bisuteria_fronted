import api from './axiosClient';

function periodParams(params = {}) {
  return params;
}

export async function getDashboardResumen(params = {}) {
  const { data } = await api.get('/admin/dashboard/resumen', {
    params: periodParams(params)
  });
  return data;
}

export async function getMovimientosDiarios(params = {}) {
  const { data } = await api.get('/admin/dashboard/movimientos-diarios', {
    params
  });
  return data;
}

export async function getStockCategoria() {
  const { data } = await api.get('/admin/dashboard/stock-categoria');
  return data;
}

/** Alias Doc 3 */
export async function getProductosPorCategoria() {
  const { data } = await api.get('/admin/dashboard/productos-categoria');
  return data;
}

export async function getTopProductos(params = {}) {
  const { data } = await api.get('/admin/dashboard/top-productos', { params });
  return data;
}

export async function getAlertasStock() {
  const { data } = await api.get('/admin/dashboard/alertas-stock');
  return data;
}

export async function getUltimosMovimientos(limite = 10) {
  const { data } = await api.get('/admin/dashboard/ultimos-movimientos', {
    params: { limite }
  });
  return data;
}

export async function getSinMovimiento(params = {}) {
  const { data } = await api.get('/admin/dashboard/sin-movimiento', { params });
  return data;
}

export async function getMovimientosPorTipo(params = {}) {
  const { data } = await api.get('/admin/dashboard/movimientos-tipo', {
    params
  });
  return data;
}
