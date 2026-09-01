import { PasswordResetTokenRecord } from "@packages/common-types/passwordReset.types";

/**
 * Acceso al almacenamiento temporal del flujo de restablecimiento.
 *
 * Se mantiene separado de `ITokenCacheRepo` a propósito: esa interfaz ya carga
 * dos responsabilidades (tokens de verificación y sesiones) y sumarle una
 * tercera empeoraría la segregación de interfaces.
 *
 * Los métodos `get*TtlSeconds` devuelven 0 cuando la clave no existe, de modo
 * que el servicio comprueba existencia y tiempo restante en una sola llamada.
 */
export interface IPasswordResetRepo {
  // --- Enlace de restablecimiento ---

  /** Convierte el token en la clave con la que se almacena. */
  hashToken(token: string): string;

  /** Guarda el enlace y su índice inverso por usuario. */
  saveToken(
    tokenHash: string,
    record: PasswordResetTokenRecord,
    ttlSeconds: number,
  ): Promise<void>;

  findTokenRecord(tokenHash: string): Promise<PasswordResetTokenRecord | null>;

  /** Hash del enlace vigente de un usuario, o null si no tiene ninguno. */
  findActiveTokenHashByUser(userId: string): Promise<string | null>;

  /** Borra el enlace y su índice inverso. */
  deleteToken(tokenHash: string, userId: string): Promise<void>;

  // --- Contador 1: solicitudes por correo ---

  getFreezeTtlSeconds(email: string): Promise<number>;
  startFreeze(email: string, ttlSeconds: number): Promise<void>;
  getEmailBlockTtlSeconds(email: string): Promise<number>;
  blockEmail(email: string, ttlSeconds: number): Promise<void>;

  /** Incrementa y devuelve el total. Fija el TTL en el primer incremento. */
  incrementRequestAttempts(email: string, windowSeconds: number): Promise<number>;

  /** Borra espera, intentos y bloqueo del correo. */
  clearEmailCounters(email: string): Promise<void>;

  // --- Contador 2: usos de enlace inválido por origen ---

  getIpBlockTtlSeconds(ip: string): Promise<number>;
  blockIp(ip: string, ttlSeconds: number): Promise<void>;

  /** Incrementa y devuelve el total. Fija el TTL en el primer incremento. */
  incrementInvalidAttempts(ip: string, windowSeconds: number): Promise<number>;

  /** Borra el contador de usos inválidos del origen. */
  clearInvalidAttempts(ip: string): Promise<void>;
}
