import { z } from "zod";

export const LoginDto = z.object({
  email: z
    .string()
    .min(3)
    .trim()
    .transform((s) => s.toLowerCase()),
  password: z.string().min(6),
});

export const RefreshDto = z.object({
  refreshToken: z.string().min(10),
});

export const LogoutDto = z.object({
  refreshToken: z.string().min(10),
});

export const ChangePasswordDto = z.object({
  currentPassword: z.string().min(1, "Contraseña actual requerida"),
  newPassword: z
    .string()
    .min(6, "La nueva contraseña debe tener al menos 6 caracteres"),
});