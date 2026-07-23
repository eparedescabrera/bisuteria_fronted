import api from './axiosClient';

export async function listProducts(params = {}) {
  const { data } = await api.get('/admin/productos', { params });
  return data;
}

export async function getProduct(id) {
  const { data } = await api.get(`/admin/productos/${id}`);
  return data;
}

export async function createProduct(payload, files = []) {
  const form = new FormData();
  form.append('datos', JSON.stringify(payload));
  files.forEach((file) => form.append('imagenes', file));
  const { data } = await api.post('/admin/productos', form);
  return data;
}

export async function updateProduct(id, payload) {
  const { data } = await api.put(`/admin/productos/${id}`, payload);
  return data;
}

export async function deleteProduct(id) {
  const { data } = await api.delete(`/admin/productos/${id}`);
  return data;
}

export async function patchPublicacion(id, estado_publicacion) {
  const { data } = await api.patch(`/admin/productos/${id}/publicacion`, {
    estado_publicacion
  });
  return data;
}

export async function patchDestacado(id, destacado) {
  const { data } = await api.patch(`/admin/productos/${id}/destacado`, {
    destacado
  });
  return data;
}

export async function patchDisponibilidad(id, estado_disponibilidad) {
  const { data } = await api.patch(`/admin/productos/${id}/disponibilidad`, {
    estado_disponibilidad
  });
  return data;
}

export async function addProductImages(id, files) {
  const form = new FormData();
  files.forEach((file) => form.append('imagenes', file));
  const { data } = await api.post(`/admin/productos/${id}/imagenes`, form);
  return data;
}

export async function deleteProductImage(id, idImagen) {
  const { data } = await api.delete(`/admin/productos/${id}/imagenes/${idImagen}`);
  return data;
}

export async function setPrincipalImage(id, idImagen) {
  const { data } = await api.patch(
    `/admin/productos/${id}/imagenes/${idImagen}/principal`
  );
  return data;
}
