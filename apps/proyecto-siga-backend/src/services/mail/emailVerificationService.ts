import { sendEmail } from "../../utils/sendEmail";
import { IEmailVerificationService } from "../../contracts/mail/IemailVerificationService";
export class EmailVerificationService implements IEmailVerificationService {
  async sendVerificationEmailUser(
    email: string,
    name: string,
    verificationUrl: string,
  ): Promise<void> {
    const subject = "Verificación de correo electrónico";
    const templateName = "verify-email";
    const data = {
      name,
      verificationUrl
    };

    await sendEmail(email, subject, templateName, data);
  }
}
