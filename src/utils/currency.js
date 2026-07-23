export function formatCRC(value) {
  const amount = Number(value || 0);
  return new Intl.NumberFormat('es-CR', {
    style: 'currency',
    currency: 'CRC',
    maximumFractionDigits: 0
  }).format(amount);
}
