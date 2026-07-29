import { inject, injectable } from "tsyringe";
import { IEmailVerificationService } from "../../contracts/mail/IemailVerificationService";
import { IMailService } from "../../contracts/mail/ImailService";

@injectable()
export class EmailVerificationService implements IEmailVerificationService {
  constructor(
    @inject("MailService")
    private readonly mailService: IMailService
  ) {}

  async sendVerificationEmailStaff(
    email: string,
    name: string,
    temporaryPassword: string,
    loginUrl: string
  ): Promise<void> {
    await this.mailService.sendTemplate(
      email,
      "Verificación de correo electrónico",
      "verify-staff-user",
      { name, temporaryPassword, loginUrl }
    );
  }

  async sendVerificationEmailUser(
    email: string,
    name: string,
    verificationUrl: string
  ): Promise<void> {
    await this.mailService.sendTemplate(
      email,
      "Verificación de correo electrónico",
      "verify-email-user",
      { name, verificationUrl }
    );
  }
}
