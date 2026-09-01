/**
 * Política de restablecimiento de contraseña.
 *
 * Los cinco valores son configurables por entorno (suposición A14 de la spec)
 * con los predeterminados que pidió el usuario. Se leen en cada llamada, igual
 * que hace `passwordPolicy.ts`, para que un cambio de configuración no exija
 * reiniciar el proceso en desarrollo.
 */

const DEFAULT_TOKEN_TTL_SECONDS = 30 * 60;
const DEFAULT_FREEZE_SECONDS = 5 * 60;
const DEFAULT_MAX_REQUESTS = 3;
const DEFAULT_MAX_INVALID_ATTEMPTS = 3;
const DEFAULT_BLOCK_SECONDS = 30 * 60;

export interface PasswordResetPolicy {
  /** Vigencia del enlace de restablecimiento (FR-011). */
  tokenTtlSeconds: number;
  /** Espera obligatoria entre solicitudes aceptadas del mismo correo (FR-016). */
  freezeSeconds: number;
  /** Solicitudes aceptadas permitidas antes de bloquear el correo (FR-017). */
  maxRequests: number;
  /** Usos de enlace inválido permitidos antes de bloquear el origen (FR-022). */
  maxInvalidAttempts: number;
  /**
   * Duración de ambos bloqueos y, además, ventana en la que se acumulan los
   * contadores. Se reutiliza el mismo valor para no introducir un cuarto
   * temporizador en el flujo (decisión D4 de research.md).
   */
  blockSeconds: number;
}

function positiveIntFromEnv(rawValue: string | undefined, fallback: number): number {
  const parsed = Number(rawValue);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
}

export function getPasswordResetPolicy(): PasswordResetPolicy {
  return {
    tokenTtlSeconds: positiveIntFromEnv(
      process.env.PASSWORD_RESET_TOKEN_TTL_SECONDS,
      DEFAULT_TOKEN_TTL_SECONDS,
    ),
    freezeSeconds: positiveIntFromEnv(
      process.env.PASSWORD_RESET_FREEZE_SECONDS,
      DEFAULT_FREEZE_SECONDS,
    ),
    maxRequests: positiveIntFromEnv(
      process.env.PASSWORD_RESET_MAX_REQUESTS,
      DEFAULT_MAX_REQUESTS,
    ),
    maxInvalidAttempts: positiveIntFromEnv(
      process.env.PASSWORD_RESET_MAX_INVALID_ATTEMPTS,
      DEFAULT_MAX_INVALID_ATTEMPTS,
    ),
    blockSeconds: positiveIntFromEnv(
      process.env.PASSWORD_RESET_BLOCK_SECONDS,
      DEFAULT_BLOCK_SECONDS,
    ),
  };
}

/**
 * Convierte segundos restantes a minutos para mostrarlos al usuario (FR-009).
 * Se redondea hacia arriba: quedan "1 minuto" hasta el último segundo, nunca
 * "0 minutos" cuando la restricción sigue activa.
 */
export function toRemainingMinutes(remainingSeconds: number): number {
  return Math.max(1, Math.ceil(remainingSeconds / 60));
}
