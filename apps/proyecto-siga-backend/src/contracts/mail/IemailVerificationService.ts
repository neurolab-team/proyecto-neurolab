export interface IEmailVerificationService {
  sendVerificationEmailUser(
    email: string,
    name: string,
    verificationUrl: string,
    

  ): Promise<void>;
  
  sendVerificationEmailStaff(
    email: string,
    name: string,
    temporaryPassword: string,
    loginUrl: string
  ): Promise<void>;
}
