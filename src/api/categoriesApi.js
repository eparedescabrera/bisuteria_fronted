import api from './axiosClient';

export async function listCategories(params = {}) {
  const { data } = await api.get('/admin/categorias', { params });
  return data;
}

export async function getCategory(id) {
  const { data } = await api.get(`/admin/categorias/${id}`);
  return data;
}

export async function createCategory(payload) {
  const { data } = await api.post('/admin/categorias', payload);
  return data;
}

export async function updateCategory(id, payload) {
  const { data } = await api.put(`/admin/categorias/${id}`, payload);
  return data;
}

export async function deleteCategory(id) {
  const { data } = await api.delete(`/admin/categorias/${id}`);
  return data;
}
