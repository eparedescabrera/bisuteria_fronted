/**
 * Catálogo público — endpoints Documento 3 (no inventar rutas).
 * Doc 5 menciona /producto/:slug y /relacionados/:id;
 * backend real: /public/productos/:slug y /public/productos/:slug/relacionados
 */
import api from '../api/axiosClient';

export async function getPublicConfig() {
  const { data } = await api.get('/public/configuracion');
  return data;
}

export async function getPublicCategories() {
  const { data } = await api.get('/public/categorias');
  return data;
}

export async function getPublicProducts(params = {}) {
  const { data } = await api.get('/public/productos', { params });
  return data;
}

export async function getPublicProductBySlug(slug) {
  const { data } = await api.get(`/public/productos/${slug}`);
  return data;
}

export async function getRelatedProducts(slug, limite = 4) {
  const { data } = await api.get(`/public/productos/${slug}/relacionados`, {
    params: { limite }
  });
  return data;
}

export async function getFeaturedProducts(limite = 8) {
  const { data } = await api.get('/public/productos/destacados', {
    params: { limite }
  });
  return data;
}

export async function getRecentProducts(limite = 8) {
  const { data } = await api.get('/public/productos/recientes', {
    params: { limite }
  });
  return data;
}
