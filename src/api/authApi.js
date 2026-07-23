import api from './axiosClient';

/**
 * Doc 3: nombre_usuario (no email).
 * Doc 8: sesión en cookies HttpOnly; el body puede incluir token solo para herramientas API.
 */
export async function loginRequest({ nombre_usuario, password }) {
  const { data } = await api.post('/auth/login', { nombre_usuario, password });
  return data;
}

export async function refreshRequest() {
  const { data } = await api.post('/auth/refresh');
  return data;
}

export async function logoutRequest() {
  const { data } = await api.post('/auth/logout');
  return data;
}

export async function getPerfilRequest() {
  const { data } = await api.get('/auth/me');
  return data;
}

export async function changePasswordRequest(payload) {
  const { data } = await api.patch('/auth/change-password', payload);
  return data;
}
