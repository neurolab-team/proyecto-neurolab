import nodeMailer, { type Transporter } from "nodemailer";
import {
  IEmailProvider,
  OutgoingEmail,
} from "../../../contracts/mail/IemailProvider";
import { SmtpConfig, SmtpPresetName } from "./smtpPresets";

/**
 * Proveedor de correo sobre SMTP (nodemailer).
 *
 * Es el único archivo del backend que conoce `nodemailer`. El transporter se
 * crea en el constructor, y el constructor solo se invoca desde
 * `emailProviderFactory`, que a su vez se registra en el contenedor como
 * factory cacheada: así hay una sola instancia, creada de forma perezosa y no
 * como efecto colateral de importar un módulo.
 */
export class SmtpEmailProvider implements IEmailProvider {
  readonly name: string;

  private readonly transporter: Transporter;
  private readonly from: string;

  constructor(preset: SmtpPresetName, config: SmtpConfig) {
    this.name = `smtp:${preset}`;
    this.from = config.from;
    this.transporter = nodeMailer.createTransport({
      host: config.host,
      port: config.port,
      secure: config.secure,
      auth: {
        user: config.auth.user,
        pass: config.auth.password,
      },
    });
  }

  async send({ to, subject, html }: OutgoingEmail): Promise<void> {
    await this.transporter.sendMail({
      from: this.from,
      to,
      subject,
      html,
    });
  }
}
