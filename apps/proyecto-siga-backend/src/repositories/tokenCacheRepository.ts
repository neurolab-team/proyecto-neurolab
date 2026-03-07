import { injectable } from "tsyringe";
import { ITokenCacheRepo } from "../contracts/token/ItokenCacheRepo";
import redis from "@packages/libs/redis/redis";
import { ServerError } from "../utils/httpError";
import { SessionData } from "@packages/common-types/session.types";

@injectable()
export class TokenCacheRepository implements ITokenCacheRepo {
  private readonly VERIFICATION_TOKEN_PREFIX = "verification_token:";
  private readonly SESSION_PREFIX = "session:";
  private readonly USER_SESSIONS_PREFIX = "user_sessions:";

  private getSessionKey(sessionId: string): string {
    return `${this.SESSION_PREFIX}${sessionId}`;
  }

  private getUserSessionsKey(userId: string): string {
    return `${this.USER_SESSIONS_PREFIX}${userId}`;
  }

  async setVerificationToken(
    email: string,
    token: string,
    expiresIn: number,
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

  async setSession(
    sessionId: string,
    session: SessionData,
    expiresIn: number,
  ): Promise<void> {
    await Promise.all([
      redis.set(this.getSessionKey(sessionId), JSON.stringify(session), {
        EX: expiresIn,
      }),
      redis.sAdd(this.getUserSessionsKey(session.userId), sessionId),
    ]);
  }

  async getSession(sessionId: string): Promise<SessionData | null> {
    const raw = await redis.get(this.getSessionKey(sessionId));

    if (!raw) return null;
    try {
      return JSON.parse(raw) as SessionData;
    } catch {
      throw ServerError("La sesión almacenada en Redis está corrupta");
    }
  }

  async getUserSessionIds(userId: string): Promise<string[]> {
    return redis.sMembers(this.getUserSessionsKey(userId));
  }

  async deleteSession(sessionId: string): Promise<void> {
    const session = await this.getSession(sessionId);

    if (!session) {
      await redis.del(this.getSessionKey(sessionId));
      return;
    }

    await Promise.all([
      redis.del(this.getSessionKey(sessionId)),
      redis.sRem(this.getUserSessionsKey(session.userId), sessionId),
    ]);
  }

  async deleteSessionsByUser(userId: string): Promise<void> {
    const sessionIds = await this.getUserSessionIds(userId);

    if (sessionIds.length === 0) {
      await redis.del(this.getUserSessionsKey(userId));
      return;
    }

    const multi = redis.multi();

    for (const sessionId of sessionIds) {
      multi.del(this.getSessionKey(sessionId));
    }

    multi.del(this.getUserSessionsKey(userId));

    await multi.exec();
  }
}
