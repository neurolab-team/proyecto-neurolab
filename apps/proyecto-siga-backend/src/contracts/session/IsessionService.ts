import { SessionAuthResult, SessionData } from "@packages/common-types/session.types";


export interface ISessionService {
    createSession(params: { userId: string }): Promise<SessionData>;
    getSession(sessionId: string): Promise<SessionData | null>;
    authenticate(sessionId: string): Promise<SessionAuthResult>;
    revokeSession(sessionId: string): Promise<void>;
    revokeAllUserSessions(userId: string): Promise<void>;
    getSessionIdFromRequest(req: {
        headers: Record<string, string | string[] | undefined>;
    }): string | null;
}