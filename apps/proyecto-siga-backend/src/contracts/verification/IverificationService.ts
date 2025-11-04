// type VerificationScope = "invite" | "verifyEmail" | "setPassword";
export interface IVerificationService{
    createVerificationToken(
        email: string,
        // scope: VerificationScope // de algo servira pero toda nose
    ): Promise<string>;
    consumeVerificationToken(
        token: string
    ): Promise<void | string>;
}