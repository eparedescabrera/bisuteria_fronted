import api from './axiosClient';
import { compressImageFiles } from '../utils/compressImage';

export async function listProducts(params = {}) {
  const { data } = await api.get('/admin/productos', { params });
  return data;
}

export async function getProduct(id) {
  const { data } = await api.get(`/admin/productos/${id}`);
  return data;
}

function fileToBase64Payload(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      resolve({
        nombre: file.name,
        mime: file.type || 'image/jpeg',
        data: String(reader.result || '')
      });
    };
    reader.onerror = () => reject(new Error('No se pudo leer la imagen'));
    reader.readAsDataURL(file);
  });
}

/**
 * Crea producto (JSON) y sube imágenes por JSON base64 (sin multipart).
 */
export async function createProduct(payload, files = []) {
  const { data } = await api.post('/admin/productos', payload);
  const id = data?.data?.id_producto;

  if (id && files.length) {
    await addProductImages(id, files.slice(0, 6));
  }

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
  const compressed = await compressImageFiles(files);
  // Una por una para no saturar el body JSON
  let last = null;
  for (const file of compressed) {
    const image = await fileToBase64Payload(file);
    const { data } = await api.post(
      `/admin/productos/${id}/imagenes/json`,
      { imagenes: [image] },
      { timeout: 120000 }
    );
    last = data;
  }
  return last;
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
