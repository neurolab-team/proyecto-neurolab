import { inject, injectable } from "tsyringe";
import { IMailService } from "../../contracts/mail/ImailService";
import { IPasswordResetEmailService } from "../../contracts/mail/IpasswordResetEmailService";

@injectable()
export class PasswordResetEmailService implements IPasswordResetEmailService {
  constructor(
    @inject("MailService")
    private readonly mailService: IMailService,
  ) {}

  async sendPasswordResetEmail(
    email: string,
    name: string,
    resetUrl: string,
    expiresInMinutes: number,
  ): Promise<void> {
    await this.mailService.sendTemplate(
      email,
      "Restablecer tu contraseña",
      "reset-password",
      { name, resetUrl, expiresInMinutes },
    );
  }
}
