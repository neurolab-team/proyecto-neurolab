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
  /**
   * El usuario arrastra una contraseña temporal y debe reemplazarla antes de
   * poder usar el resto de la API. Se resuelve en cada autenticación, no se
   * guarda en la sesión, para que el bloqueo se levante en cuanto la cambie.
   */
  mustChangePassword: boolean;
};
