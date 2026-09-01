/**
 * Lógica del flujo de restablecimiento de contraseña.
 *
 * Ambos métodos devuelven void y comunican los fallos lanzando `HttpError`,
 * igual que el resto de servicios del proyecto. El controlador solo traduce el
 * éxito a una respuesta HTTP.
 */
export interface IPasswordResetService {
  /**
   * Emite un enlace de restablecimiento y lo envía por correo.
   * Revoca el enlace anterior de la cuenta si existía.
   *
   * No recibe el origen de la petición: el contador por origen solo cuenta usos
   * de enlace inválido, que ocurren en `resetPassword`. La protección por IP de
   * este endpoint la aportan los limitadores HTTP.
   */
  requestPasswordReset(email: string): Promise<void>;

  /**
   * Aplica la contraseña nueva usando el enlace, lo consume y revoca todas las
   * sesiones activas de la cuenta.
   */
  resetPassword(
    token: string,
    newPassword: string,
    clientIp: string,
  ): Promise<void>;
}
