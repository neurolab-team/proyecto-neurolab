import { injectable } from "tsyringe";
import { ITokenCacheRepo } from "../contracts/token/ItokenCacheRepo";
import redis from "@packages/libs/redis/redis";
import { ServerError } from "../utils/httpError";

@injectable()
export class TokenCacheRepository implements ITokenCacheRepo {
  private readonly ACCESS_TOKEN_PREFIX = "access_token:";
  private readonly REFRESH_TOKEN_PREFIX = "refresh_token:";
  private readonly VERIFICATION_TOKEN_PREFIX = "verification_token:";

  async setAccessToken(
    userId: string,
    token: string,
    expiresIn: number
  ): Promise<void> {
    const key = `${this.ACCESS_TOKEN_PREFIX}${userId}`;
    const res = await redis.setEx(key, expiresIn, token);
    if (res !== "OK") {
      throw ServerError("Error al guardar el access token en Redis");
    }
  }

  async getAccessToken(userId: string): Promise<string | null> {
    const key = `${this.ACCESS_TOKEN_PREFIX}${userId}`;
    return await redis.get(key);
  }

  async deleteAccessToken(userId: string): Promise<void> {
    const key = `${this.ACCESS_TOKEN_PREFIX}${userId}`;
    await redis.del(key);
  }

  async setRefreshToken(
    userId: string,
    token: string,
    expiresIn: number
  ): Promise<void> {
    const key = `${this.REFRESH_TOKEN_PREFIX}${userId}`;
    await redis.setEx(key, expiresIn, token);
  }

  async getRefreshToken(userId: string): Promise<string | null> {
    const key = `${this.REFRESH_TOKEN_PREFIX}${userId}`;
    return await redis.get(key);
  }

  async deleteRefreshToken(userId: string): Promise<void> {
    const key = `${this.REFRESH_TOKEN_PREFIX}${userId}`;
    await redis.del(key);
  }

  async setVerificationToken(
    email: string,
    token: string,
    expiresIn: number
  ): Promise<void> {
    const key = `${this.VERIFICATION_TOKEN_PREFIX}${token}`;
    await redis.setEx(key, expiresIn, email);
  }

  async getVerificationToken(token: string): Promise<string | null> {
    const key = `${this.VERIFICATION_TOKEN_PREFIX}${token}`;
    return await redis.get(key);
  }

  async deleteVerificationToken(token: string): Promise<void> {
    const key = `${this.VERIFICATION_TOKEN_PREFIX}${token}`;
    await redis.del(key);
  }

  async clearUserTokens(userId: string): Promise<void> {
    await Promise.all([
      this.deleteAccessToken(userId),
      this.deleteRefreshToken(userId),
    ]);
  }
}
