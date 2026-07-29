import {
  IEmailProvider,
  OutgoingEmail,
} from "../../../contracts/mail/IemailProvider";
import { logger } from "../../../utils/logger";

/**
 * Proveedor de correo para desarrollo: no envía nada, solo registra el correo
 * en el log. Se activa con `EMAIL_PROVIDER=console` y permite trabajar en
 * local sin credenciales SMTP reales.
 */
export class ConsoleEmailProvider implements IEmailProvider {
  readonly name = "console";

  async send({ to, subject, html }: OutgoingEmail): Promise<void> {
    logger.info("[email:console] correo no enviado (proveedor de desarrollo)", {
      to,
      subject,
      htmlLength: html.length,
    });
  }
}
