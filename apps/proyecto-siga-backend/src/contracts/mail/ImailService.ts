/**
 * Es la dependencia que inyectan los servicios de dominio (por ejemplo
 * `EmailVerificationService`). Combina el renderizado de la plantilla con el
 * `IEmailProvider` activo, de modo que quien envía un correo no conoce el
 * proveedor ni el motor de plantillas.
 */
export interface IMailService {
  sendTemplate(
    to: string,
    subject: string,
    templateName: string,
    data: Record<string, unknown>
  ): Promise<void>;
}
