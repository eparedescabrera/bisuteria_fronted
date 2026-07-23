export const APP_NAME = import.meta.env.VITE_APP_NAME || 'Inventory Pro';
export const WHATSAPP_COUNTRY_CODE =
  import.meta.env.VITE_WHATSAPP_COUNTRY_CODE || '506';

export const UNIDADES = ['Unidad', 'Paquete', 'Caja', 'Par', 'Docena'];

export const PUBLICACIONES = ['Publicado', 'Oculto'];

export const DISPONIBILIDADES = [
  'Disponible',
  'Agotado',
  'Proximamente',
  'Descontinuado'
];

export const TIPOS_MOVIMIENTO = [
  'Entrada',
  'Salida',
  'Ajuste positivo',
  'Ajuste negativo',
  'Devolucion',
  'Correccion',
  'Stock inicial'
];

export const MOTIVOS_INVENTARIO = [
  'Compra',
  'Venta',
  'Devolución',
  'Producto dañado',
  'Obsequio',
  'Producción',
  'Corrección',
  'Inventario inicial',
  'Otro'
];

export const ORDEN_PRODUCTOS = [
  { value: 'recientes', label: 'Más recientes' },
  { value: 'nombre_asc', label: 'Nombre A-Z' },
  { value: 'nombre_desc', label: 'Nombre Z-A' },
  { value: 'precio_asc', label: 'Precio menor' },
  { value: 'precio_desc', label: 'Precio mayor' },
  { value: 'stock_asc', label: 'Stock menor' },
  { value: 'stock_desc', label: 'Stock mayor' }
];
