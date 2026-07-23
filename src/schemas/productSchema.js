import { z } from 'zod';
import { DISPONIBILIDADES, PUBLICACIONES, UNIDADES } from '../utils/constants';

export const productCreateSchema = z.object({
  codigo: z.string().min(1, 'Obligatorio').max(50, 'Máximo 50'),
  nombre: z.string().min(3, 'Mínimo 3 caracteres').max(150, 'Máximo 150'),
  id_categoria: z.coerce.number().int().positive('Seleccione una categoría'),
  descripcion_corta: z.string().max(350).optional().or(z.literal('')),
  descripcion_completa: z.string().max(2000).optional().or(z.literal('')),
  precio_venta: z.coerce.number().min(0, 'Debe ser >= 0'),
  precio_anterior: z.coerce.number().min(0).nullable().optional().or(z.literal('')),
  stock_inicial: z.coerce.number().int().min(0),
  stock_minimo: z.coerce.number().int().min(0),
  unidad_medida: z.enum(UNIDADES),
  marca: z.string().max(100).optional().or(z.literal('')),
  color_estilo: z.string().max(120).optional().or(z.literal('')),
  material: z.string().max(120).optional().or(z.literal('')),
  estado_publicacion: z.enum(PUBLICACIONES),
  destacado: z.boolean().default(false)
});

export const productUpdateSchema = productCreateSchema
  .omit({ stock_inicial: true })
  .extend({
    estado_disponibilidad: z.enum(DISPONIBILIDADES).optional()
  });
