import { format, parseISO, isValid } from 'date-fns';
import { es } from 'date-fns/locale';

export function formatDateTime(value) {
  if (!value) return '—';
  const date = typeof value === 'string' ? parseISO(value) : new Date(value);
  if (!isValid(date)) return '—';
  return format(date, "dd MMM yyyy, HH:mm", { locale: es });
}

export function formatDate(value) {
  if (!value) return '—';
  const date = typeof value === 'string' ? parseISO(value) : new Date(value);
  if (!isValid(date)) return '—';
  return format(date, 'dd MMM yyyy', { locale: es });
}

export function getApiErrorMessage(error, fallback = 'Ocurrió un error') {
  if (!error?.response) {
    const msg = String(error?.message || '');
    if (error?.code === 'ECONNABORTED' || msg.includes('timeout')) {
      return 'La solicitud tardó demasiado. Intente con menos imágenes o archivos más livianos.';
    }
    if (msg.includes('ERR_HTTP2') || msg.includes('Network Error')) {
      return 'Falló la subida (conexión con el servidor). Intente con imágenes más pequeñas o sin imagen y agréguela después.';
    }
    return 'No hay conexión con el servidor. Verifique su red o vuelva a iniciar sesión.';
  }
  return error.response.data?.message || error.message || fallback;
}
