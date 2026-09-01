/**
 * Tipos compartidos del flujo de restablecimiento de contraseña.
 * Ver specs/005-password-reset-flow/data-model.md
 */

/**
 * Registro del enlace vigente tal como se guarda en el almacenamiento temporal.
 * El correo se guarda ya normalizado para poder limpiar los contadores al
 * consumir el enlace sin volver a consultar la base de datos.
 */
export interface PasswordResetTokenRecord {
  userId: string;
  email: string;
  createdAt: string;
}

export interface ForgotPasswordInput {
  email: string;
}

export interface ResetPasswordInput {
  token: string;
  newPassword: string;
}
