/**
 * Define el contrato mínimo para entregar un email ya renderizado. No sabe de
 * plantillas ni de reglas de negocio: solo recibe destinatario, asunto y HTML.
 *
 * Cada proveedor concreto (SMTP vía nodemailer, una API HTTP como Resend o
 * SES API, o el provider de consola para desarrollo) vive en
 * `services/mail/providers/` e implementa esta interfaz. Cambiar de proveedor
 * es agregar una implementación y un caso en `emailProviderFactory`, sin tocar
 * los servicios que envían correos.
 */
export interface OutgoingEmail {
  to: string;
  subject: string;
  html: string;
}

export interface IEmailProvider {
  /** Identificador del proveedor activo, útil para logs y diagnóstico. */
  readonly name: string;

  send(email: OutgoingEmail): Promise<void>;
}
