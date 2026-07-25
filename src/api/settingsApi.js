import api from './axiosClient';
import { compressImageFile } from '../utils/compressImage';

export async function getSettings() {
  const { data } = await api.get('/admin/configuracion');
  return data;
}

export async function updateSettings(payload) {
  const { data } = await api.put('/admin/configuracion', payload);
  return data;
}

export async function uploadLogo(file) {
  const compressed = await compressImageFile(file, {
    maxWidth: 800,
    maxHeight: 800,
    quality: 0.85,
    maxBytes: 400 * 1024
  });
  const form = new FormData();
  form.append('logo', compressed);
  const { data } = await api.post('/admin/configuracion/logo', form);
  return data;
}

export async function uploadPortada(file) {
  const compressed = await compressImageFile(file, {
    maxWidth: 1600,
    maxHeight: 900,
    quality: 0.8,
    maxBytes: 700 * 1024
  });
  const form = new FormData();
  form.append('portada', compressed);
  const { data } = await api.post('/admin/configuracion/portada', form);
  return data;
}
