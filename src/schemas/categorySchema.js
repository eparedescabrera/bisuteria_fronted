import { z } from 'zod';

export const categorySchema = z.object({
  nombre: z
    .string()
    .min(2, 'Mínimo 2 caracteres')
    .max(100, 'Máximo 100 caracteres'),
  descripcion: z
    .string()
    .max(300, 'Máximo 300 caracteres')
    .optional()
    .or(z.literal('')),
  estado: z.boolean().default(true),
  orden_visual: z.coerce.number().int().optional()
});
