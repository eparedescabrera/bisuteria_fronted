import api from './axiosClient';

/** Doc 3: GET/POST /admin/movimientos (no /admin/inventario/movimientos) */
export async function listMovements(params = {}) {
  const { data } = await api.get('/admin/movimientos', { params });
  return data;
}

export async function createMovement(payload) {
  const { data } = await api.post('/admin/movimientos', payload);
  return data;
}

export async function listLowStock() {
  const { data } = await api.get('/admin/inventario/stock-bajo');
  return data;
}
