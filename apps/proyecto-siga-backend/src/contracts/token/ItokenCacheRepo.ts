import { SessionData } from "@packages/common-types/session.types";

export interface ITokenCacheRepo {
  setVerificationToken(
    email: string,
    token: string,
    expiresIn: number,
  ): Promise<void>;
  getVerificationToken(token: string): Promise<string | null>;
  deleteVerificationToken(token: string): Promise<void>;

  setSession(
    sessionId: string,
    session: SessionData,
    expiresIn: number,
  ): Promise<void>;
  getSession(sessionId: string): Promise<SessionData | null>;
  getUserSessionIds(userId: string): Promise<string[]>;
  deleteSession(sessionId: string): Promise<void>;
  deleteSessionsByUser(userId: string): Promise<void>;
}
