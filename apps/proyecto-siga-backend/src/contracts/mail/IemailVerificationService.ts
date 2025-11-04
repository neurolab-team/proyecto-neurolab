export interface IEmailVerificationService {
  sendVerificationEmailUser(
    email: string,
    name: string,
    verificationUrl: string,

  ): Promise<void>;
}
