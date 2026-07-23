import { z } from 'zod';

export const loginSchema = z.object({
  nombre_usuario: z
    .string()
    .min(1, 'El usuario es obligatorio')
    .max(80, 'Máximo 80 caracteres'),
  password: z.string().min(1, 'La contraseña es obligatoria')
});
