import { z } from 'zod';

export const settingsSchema = z.object({
  nombre_negocio: z.string().min(1, 'Obligatorio').max(160),
  descripcion: z.string().max(600).optional().or(z.literal('')),
  telefono: z.string().max(30).optional().or(z.literal('')),
  whatsapp: z
    .string()
    .regex(/^\d*$/, 'Solo dígitos con código de país')
    .max(30)
    .optional()
    .or(z.literal('')),
  correo: z.string().max(150).optional().or(z.literal('')),
  direccion: z.string().max(350).optional().or(z.literal('')),
  facebook: z.string().max(300).optional().or(z.literal('')),
  instagram: z.string().max(300).optional().or(z.literal('')),
  moneda: z.string().length(3).default('CRC'),
  mostrar_stock_publico: z.boolean().default(false),
  mensaje_bienvenida: z.string().max(600).optional().or(z.literal('')),
  mensaje_inferior: z.string().max(350).optional().or(z.literal(''))
});
