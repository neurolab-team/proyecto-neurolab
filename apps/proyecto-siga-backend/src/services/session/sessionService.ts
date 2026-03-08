import { inject, injectable } from "tsyringe";
import { randomUUID } from "crypto";
import {
  SessionAuthResult,
  SessionData,
} from "@packages/common-types/session.types";
import { Unauthorized } from "../../utils/httpError";
import { TokenCacheService } from "../token/tokenCacheService";
import { IAuthService } from "../../contracts/auth/IauthService";
import { ISessionService } from "../../contracts/session/IsessionService";

const IDLE_TIMEOUT_MS = 30 * 60 * 1000;
const ABSOLUTE_TIMEOUT_MS = 7 * 24 * 60 * 60 * 1000;

@injectable()
export class SessionService implements ISessionService {
  constructor(
    @inject("TokenCacheService")
    private readonly tokenCacheService: TokenCacheService,
    @inject("AuthService")
    private readonly authService: IAuthService,
  ) {}

  async createSession(params: { userId: string }): Promise<SessionData> {
    const nowMs = Date.now();

    const session: SessionData = {
      sessionId: randomUUID(),
      userId: params.userId,
      createdAt: new Date(nowMs).toISOString(),
      lastActivityAt: new Date(nowMs).toISOString(),
      idleExpiresAt: new Date(nowMs + IDLE_TIMEOUT_MS).toISOString(),
      absoluteExpiresAt: new Date(nowMs + ABSOLUTE_TIMEOUT_MS).toISOString(),
      status: "active",
    };

    await this.persistSession(session);
    return session;
  }

  async getSession(sessionId: string): Promise<SessionData | null> {
    return this.tokenCacheService.getSession(sessionId);
  }

  async authenticate(sessionId: string): Promise<SessionAuthResult> {
    let session = await this.requireSession(sessionId);
    this.assertSessionIsActive(session);

    const user = await this.authService.getUserProfile(session.userId);

    if (!user.isActive) {
      await this.revokeAllUserSessions(session.userId);
      throw Unauthorized("La sesión ya no es válida");
    }

    session = await this.touchSession(session);

    return {
      userId: user.userId,
      role: user.role as SessionAuthResult["role"],
      email: user.email,
      sessionId: session.sessionId,
    };
  }

  async revokeSession(sessionId: string): Promise<void> {
    await this.tokenCacheService.revokeSession(sessionId);
  }

  async revokeAllUserSessions(userId: string): Promise<void> {
    await this.tokenCacheService.revokeAllUserSessions(userId);
  }

  getSessionIdFromRequest(req: {
    headers: Record<string, string | string[] | undefined>;
  }): string | null {
    const headerSid = req.headers["x-session-id"];

    if (typeof headerSid === "string" && headerSid.trim().length > 0) {
      return headerSid;
    }

    if (Array.isArray(headerSid) && headerSid.length > 0) {
      const first = headerSid[0];
      if (typeof first === "string" && first.trim().length > 0) {
        return first;
      }
    }

    return null;
  }

  private async requireSession(sessionId: string): Promise<SessionData> {
    const session = await this.tokenCacheService.getSession(sessionId);

    if (!session) {
      throw Unauthorized("Sesión inválida");
    }

    return session;
  }

  private assertSessionIsActive(session: SessionData): void {
    const nowMs = Date.now();

    if (session.status !== "active") {
      throw Unauthorized("Sesión revocada");
    }

    if (this.isExpired(nowMs, session.absoluteExpiresAt)) {
      void this.revokeSession(session.sessionId);
      throw Unauthorized("Sesión expirada");
    }

    if (this.isExpired(nowMs, session.idleExpiresAt)) {
      void this.revokeSession(session.sessionId);
      throw Unauthorized("Sesión expirada por inactividad");
    }
  }

  private async touchSession(session: SessionData): Promise<SessionData> {
    const nowMs = Date.now();
    const updated: SessionData = {
      ...session,
      lastActivityAt: new Date(nowMs).toISOString(),
      idleExpiresAt: new Date(nowMs + IDLE_TIMEOUT_MS).toISOString(),
    };

    await this.persistSession(updated);
    return updated;
  }

  private async persistSession(session: SessionData): Promise<void> {
    const ttlSeconds = this.getSessionTtlSeconds(session);

    if (ttlSeconds <= 0) {
      await this.revokeSession(session.sessionId);
      throw Unauthorized("Sesión expirada");
    }

    await this.tokenCacheService.storeSession(session, ttlSeconds);
  }

  private getSessionTtlSeconds(session: SessionData): number {
    const nowMs = Date.now();
    const idleRemainingMs = new Date(session.idleExpiresAt).getTime() - nowMs;
    const absoluteRemainingMs =
      new Date(session.absoluteExpiresAt).getTime() - nowMs;

    return Math.max(
      0,
      Math.floor(Math.min(idleRemainingMs, absoluteRemainingMs) / 1000),
    );
  }

  private isExpired(nowMs: number, isoDate: string): boolean {
    return nowMs >= new Date(isoDate).getTime();
  }
}
