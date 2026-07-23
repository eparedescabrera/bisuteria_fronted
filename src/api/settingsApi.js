import api from './axiosClient';

export async function getSettings() {
  const { data } = await api.get('/admin/configuracion');
  return data;
}

export async function updateSettings(payload) {
  const { data } = await api.put('/admin/configuracion', payload);
  return data;
}

export async function uploadLogo(file) {
  const form = new FormData();
  form.append('logo', file);
  const { data } = await api.post('/admin/configuracion/logo', form);
  return data;
}

export async function uploadPortada(file) {
  const form = new FormData();
  form.append('portada', file);
  const { data } = await api.post('/admin/configuracion/portada', form);
  return data;
}
