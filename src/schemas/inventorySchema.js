import { z } from 'zod';
import { TIPOS_MOVIMIENTO } from '../utils/constants';

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

const tiposForm = TIPOS_MOVIMIENTO.filter((t) => t !== 'Stock inicial');

export const inventorySchema = z.object({
  id_producto: z.coerce.number().int().positive('Seleccione un producto'),
  tipo_movimiento: z.enum(tiposForm),
  cantidad: z.coerce.number().int().positive('Cantidad debe ser mayor que cero'),
  motivo: z.enum(MOTIVOS_INVENTARIO),
  referencia: z.string().max(120).optional().or(z.literal(''))
});
