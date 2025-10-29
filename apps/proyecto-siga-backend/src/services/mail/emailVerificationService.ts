import { sendEmail } from "../../utils/sendEmail";
import { IEmailVerificationService } from "../../contracts/mail/IemailVerificationService";
export class EmailVerificationService implements IEmailVerificationService {
  
  async sendVerificationEmailStaff(
    email: string,
    name: string,
    temporaryPassword: string,
    loginUrl: string
  ): Promise<void> {
    const subject = "Verificación de correo electrónico";
    const templateName = "verify-staff-user";
    const data = {
      name,
      temporaryPassword,
      loginUrl
    };

    await sendEmail(email, subject, templateName, data);
  }
  async sendVerificationEmailUser(
    email: string,
    name: string,
    verificationUrl: string
  ): Promise<void> {
    const subject = "Verificación de correo electrónico";
    const templateName = "verify-email-user";
    const data = {
      name,
      verificationUrl,
    };

    await sendEmail(email, subject, templateName, data);
  }
}
