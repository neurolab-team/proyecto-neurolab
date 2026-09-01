/**
 * Envío del correo con el enlace de restablecimiento.
 *
 * Se separa de `IEmailVerificationService` porque esa interfaz es la dueña de
 * la verificación de correo; el restablecimiento es otra responsabilidad.
 */
export interface IPasswordResetEmailService {
  sendPasswordResetEmail(
    email: string,
    name: string,
    resetUrl: string,
    expiresInMinutes: number,
  ): Promise<void>;
}
