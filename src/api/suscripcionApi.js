import api from './axiosClient';

export async function getPlanes() {
  const { data } = await api.get('/suscripcion/planes');
  return data.data;
}

export async function solicitarSuscripcion(payload) {
  const { data } = await api.post('/suscripcion/solicitar', payload);
  return data.data;
}
