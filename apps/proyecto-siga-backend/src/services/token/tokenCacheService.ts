import { inject, injectable } from "tsyringe";
import { ITokenCacheService } from "../../contracts/token/ItokenCacheService";
import { ITokenCacheRepo } from "../../contracts/token/ItokenCacheRepo";
import { SessionData } from "@packages/common-types/session.types";

@injectable()
export class TokenCacheService implements ITokenCacheService {
  constructor(
    @inject("TokenCacheRepo") private readonly tokenCacheRepo: ITokenCacheRepo
  ) {}

  async storeVerificationToken(email: string, token: string): Promise<void> {
    const expiresIn = 24 * 60 * 60;
    await this.tokenCacheRepo.setVerificationToken(email, token, expiresIn);
  }

  async validateVerificationToken(
    token: string
  ): Promise<{ valid: boolean; email: string }> {
    const email = await this.tokenCacheRepo.getVerificationToken(token);
    if (!email) {
      return { valid: false, email: "" };
    }
    await this.tokenCacheRepo.deleteVerificationToken(token);
    return { valid: true, email };
  }

  async storeSession(session: SessionData, expiresIn: number): Promise<void> {
    await this.tokenCacheRepo.setSession(session.sessionId, session, expiresIn);
  }

  async getSession(sessionId: string): Promise<SessionData | null> {
    return await this.tokenCacheRepo.getSession(sessionId);
  }

  async revokeSession(sessionId: string): Promise<void> {
    await this.tokenCacheRepo.deleteSession(sessionId);
  }

  async revokeAllUserSessions(userId: string): Promise<void> {
    await this.tokenCacheRepo.deleteSessionsByUser(userId);
  }
}
