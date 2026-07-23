import axios from 'axios';
import { getCsrfToken } from '../utils/csrf';
import { getAccessToken, setAccessToken, clearAccessToken } from '../utils/authToken';

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

  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;
    const status = error.response?.status;
    const url = String(original?.url || '');

    if (
      status === 401 &&
      original &&
      !original._retry &&
      !url.includes('/auth/login') &&
      !url.includes('/auth/refresh')
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
        if (!window.location.pathname.startsWith('/login')) {
          window.location.href = '/login';
        }
      }
    }

    return Promise.reject(error);
  }
);

export default api;
