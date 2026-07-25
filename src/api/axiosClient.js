import axios from 'axios';
import { getCsrfToken } from '../utils/csrf';
import { getAccessToken, setAccessToken, clearAccessToken } from '../utils/authToken';
import { getPublicTiendaSlug } from '../utils/tienda';

const baseURL = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true
});

const refreshClient = axios.create({
  baseURL,
  timeout: 15000,
  withCredentials: true
});

let refreshPromise = null;

api.interceptors.request.use((config) => {
  const method = (config.method || 'get').toLowerCase();
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  if (['post', 'put', 'patch', 'delete'].includes(method)) {
    const csrf = getCsrfToken();
    if (csrf) {
      config.headers['X-CSRF-Token'] = csrf;
    }
  }

  if (config.data instanceof FormData) {
    delete config.headers['Content-Type'];
    // Subidas a Cloudinary pueden tardar más
    config.timeout = 120000;
  }

  // Catálogo multi-tienda: empresa siempre desde el slug activo (nunca id del cliente)
  const url = String(config.url || '');
  if (url.includes('/public/')) {
    const slug = getPublicTiendaSlug();
    if (slug) {
      config.params = { ...(config.params || {}), empresa: slug };
      config.headers['X-Empresa-Slug'] = slug;
    }
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;
    const status = error.response?.status;
    const url = String(original?.url || '');

    const isAuthBootstrap =
      url.includes('/auth/me') ||
      url.includes('/auth/login') ||
      url.includes('/auth/refresh');
    const isPublicApi = url.includes('/public/');

    if (
      status === 401 &&
      original &&
      !original._retry &&
      !isAuthBootstrap &&
      !isPublicApi
    ) {
      original._retry = true;
      try {
        if (!refreshPromise) {
          refreshPromise = refreshClient
            .post('/auth/refresh')
            .then((res) => {
              const next = res.data?.data?.accessToken || res.data?.data?.token;
              if (next) setAccessToken(next);
              return res;
            })
            .finally(() => {
              refreshPromise = null;
            });
        }
        await refreshPromise;
        return api(original);
      } catch {
        clearAccessToken();
        const path = window.location.pathname || '';
        // Expulsar al login si estaba en paneles autenticados
        if (path.startsWith('/admin') || path.startsWith('/super-admin')) {
          window.location.href = '/login';
        }
      }
    }

    // /auth/me en el arranque: intentar refresh sin botar al visitante del catálogo
    if (
      status === 401 &&
      original &&
      !original._retry &&
      url.includes('/auth/me')
    ) {
      original._retry = true;
      try {
        if (!refreshPromise) {
          refreshPromise = refreshClient
            .post('/auth/refresh')
            .then((res) => {
              const next = res.data?.data?.accessToken || res.data?.data?.token;
              if (next) setAccessToken(next);
              return res;
            })
            .finally(() => {
              refreshPromise = null;
            });
        }
        await refreshPromise;
        return api(original);
      } catch {
        clearAccessToken();
      }
    }

    return Promise.reject(error);
  }
);

export default api;
