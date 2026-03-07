import { SessionData } from "@packages/common-types/session.types";

export interface ITokenCacheService {
  storeVerificationToken(email: string, token: string): Promise<void>;
  validateVerificationToken(token: string): Promise<{valid: boolean, email: string}>;

  storeSession(session: SessionData, expiresIn: number): Promise<void>;
  getSession(sessionId: string): Promise<SessionData | null>;
  revokeSession(sessionId: string): Promise<void>;
  revokeAllUserSessions(userId: string): Promise<void>;
}
