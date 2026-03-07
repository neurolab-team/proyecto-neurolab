export type SessionStatus = "active" | "revoked";
export type AppRole = "admin" | "psychologist" | "user";

export type SessionData = {
  sessionId: string;
  userId: string;
  createdAt: string;
  lastActivityAt: string;
  idleExpiresAt: string;
  absoluteExpiresAt: string;
  status: SessionStatus;
};

export type SessionAuthResult = {
  userId: string;
  role: AppRole;
  email: string;
  sessionId: string;
};
