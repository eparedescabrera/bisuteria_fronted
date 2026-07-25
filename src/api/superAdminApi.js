import api from './axiosClient';

export async function getDashboard() {
  const { data } = await api.get('/super-admin/dashboard');
  return data.data;
}

export async function listEmpresas(params = {}) {
  const { data } = await api.get('/super-admin/empresas', { params });
  return data.data;
}

export async function getEmpresa(id) {
  const { data } = await api.get(`/super-admin/empresas/${id}`);
  return data.data;
}

export async function updateEmpresa(id, payload) {
  const { data } = await api.put(`/super-admin/empresas/${id}`, payload);
  return data.data;
}

export async function activarEmpresa(id) {
  const { data } = await api.patch(`/super-admin/empresas/${id}/activar`);
  return data.data;
}

export async function suspenderEmpresa(id) {
  const { data } = await api.patch(`/super-admin/empresas/${id}/suspender`);
  return data.data;
}

export async function renovarEmpresa(id, payload = {}) {
  const { data } = await api.post(`/super-admin/empresas/${id}/renovar`, payload);
  return data.data;
}

export async function eliminarEmpresa(id) {
  const { data } = await api.delete(`/super-admin/empresas/${id}`);
  return data.data;
}
