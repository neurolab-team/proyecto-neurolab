import { inject, injectable } from "tsyringe";
import { IEmailProvider } from "../../contracts/mail/IemailProvider";
import { IMailService } from "../../contracts/mail/ImailService";
import { Conflict } from "../../utils/httpError";
import { logger } from "../../utils/logger";
import { renderEmailTemplate } from "./emailTemplateRenderer";

/**
 * Orquesta el envío de un correo: renderiza la plantilla y delega la entrega
 * en el `IEmailProvider` activo. Es el reemplazo del antiguo
 * `utils/sendEmail.ts`, pero inyectable y sin conocer el proveedor concreto.
 */
@injectable()
export class MailService implements IMailService {
  constructor(
    @inject("EmailProvider")
    private readonly provider: IEmailProvider
  ) {}

  async sendTemplate(
    to: string,
    subject: string,
    templateName: string,
    data: Record<string, unknown>
  ): Promise<void> {
    try {
      const html = await renderEmailTemplate(templateName, data);
      await this.provider.send({ to, subject, html });
    } catch (error) {
      logger.error(
        `[mailService] fallo enviando a ${to} con proveedor ${this.provider.name}`,
        error
      );
      throw Conflict("Error enviando email", { details: error });
    }
  }
}
