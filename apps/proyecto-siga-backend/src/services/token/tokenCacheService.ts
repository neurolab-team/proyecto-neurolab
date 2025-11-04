import { inject, injectable } from "tsyringe";
import { ITokenCacheService } from "../../contracts/token/ItokenCacheService";
import { ITokenCacheRepo } from "../../contracts/token/ItokenCacheRepo";

@injectable()
export class TokenCacheService implements ITokenCacheService {
  constructor(
    @inject("TokenCacheRepo") private readonly tokenCacheRepo: ITokenCacheRepo
  ) {}
  async storeAccessToken(userId: string, token: string): Promise<void> {
    const expiresIn = 15 * 60; // 15 minutos
    await this.tokenCacheRepo.setAccessToken(userId, token, expiresIn);
  }

  async storeRefreshToken(userId: string, token: string): Promise<void> {
    const expiresIn = 7 * 24 * 60 * 60; // 7 días
    await this.tokenCacheRepo.setRefreshToken(userId, token, expiresIn);
  }

  async storeVerificationToken(email: string, token: string): Promise<void> {
    const expiresIn = 24 * 60 * 60; // 24 horas
    await this.tokenCacheRepo.setVerificationToken(email, token, expiresIn);
  }

  async validateAccessToken(userId: string, token: string): Promise<boolean> {
    const storedToken = await this.tokenCacheRepo.getAccessToken(userId);
    return storedToken === token && storedToken !== null;
  }

  async validateRefreshToken(userId: string, token: string): Promise<boolean> {
    const storedToken = await this.tokenCacheRepo.getRefreshToken(userId);
    return storedToken === token && storedToken !== null;
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

  async getAccessToken(userId: string): Promise<string | null> {
    return await this.tokenCacheRepo.getAccessToken(userId);
  }

  async getRefreshToken(userId: string): Promise<string | null> {
    return await this.tokenCacheRepo.getRefreshToken(userId);
  }
  async revokeAccessToken(userId: string): Promise<void> {
    await this.tokenCacheRepo.deleteAccessToken(userId);
  }

  async revokeRefreshToken(userId: string): Promise<void> {
    await this.tokenCacheRepo.deleteRefreshToken(userId);
  }

  async isUserSessionActive(userId: string): Promise<boolean> {
    const [accessToken, refreshToken] = await Promise.all([
      this.tokenCacheRepo.getAccessToken(userId),
      this.tokenCacheRepo.getRefreshToken(userId),
    ]);
    return accessToken !== null || refreshToken !== null;
  }
}
