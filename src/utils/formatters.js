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
  return (
    error?.response?.data?.message ||
    error?.message ||
    fallback
  );
}
