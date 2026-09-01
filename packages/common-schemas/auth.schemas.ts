import { z } from "zod";

export const LoginDto = z.object({
  email: z
    .string()
    .min(3)
    .trim()
    .transform((s) => s.toLowerCase()),
  password: z.string().min(6),
});

export const ChangePasswordDto = z.object({
  currentPassword: z.string().min(1, "Contraseña actual requerida"),
  newPassword: z
    .string()
    .min(6, "La nueva contraseña debe tener al menos 6 caracteres"),
});

export const ForgotPasswordDto = z.object({
  email: z
    .string()
    .min(3)
    .trim()
    .transform((s) => s.toLowerCase()),
});

// El token es la representación hexadecimal de 32 bytes aleatorios, así que su
// forma es conocida y verificable. Validarla aquí evita consultar el
// almacenamiento temporal con valores que no pueden existir.
const RESET_TOKEN_PATTERN = /^[a-f0-9]{64}$/;

export const ResetPasswordDto = z.object({
  token: z
    .string()
    .trim()
    .regex(RESET_TOKEN_PATTERN, "Enlace de restablecimiento inválido"),
  newPassword: z
    .string()
    .min(6, "La nueva contraseña debe tener al menos 6 caracteres"),
});

