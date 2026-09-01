import { injectable } from "tsyringe";
import { createHash } from "crypto";
import redis from "@packages/libs/redis/redis";
import { PasswordResetTokenRecord } from "@packages/common-types/passwordReset.types";
import { IPasswordResetRepo } from "../contracts/passwordReset/IpasswordResetRepo";
import { ServerError } from "../utils/httpError";

/**
 * Almacenamiento temporal del flujo de restablecimiento de contraseña.
 *
 * Todas las claves llevan TTL nativo, así que la caducidad del enlace y el
 * vencimiento de los bloqueos ocurren sin ninguna tarea programada y sin
 * comparar fechas en el servicio.
 *
 * El enlace se guarda bajo el SHA-256 del token, no bajo el token en claro:
 * quien lea el almacenamiento (volcado, réplica, backup) obtiene hashes y no
 * enlaces utilizables. Basta un hash sin sal porque el valor de origen ya tiene
 * 256 bits de entropía y no es adivinable por diccionario.
 */
@injectable()
export class PasswordResetRepository implements IPasswordResetRepo {
  private readonly TOKEN_PREFIX = "password_reset_token:";
  private readonly USER_TOKEN_PREFIX = "password_reset_user:";
  private readonly FREEZE_PREFIX = "password_reset_freeze:";
  private readonly REQUEST_ATTEMPTS_PREFIX = "password_reset_attempts:";
  private readonly EMAIL_BLOCK_PREFIX = "password_reset_email_block:";
  private readonly INVALID_ATTEMPTS_PREFIX = "password_reset_invalid:";
  private readonly IP_BLOCK_PREFIX = "password_reset_ip_block:";

  private readonly PRESENT = "1";

  hashToken(token: string): string {
    return createHash("sha256").update(token).digest("hex");
  }

  private getTokenKey(tokenHash: string): string {
    return `${this.TOKEN_PREFIX}${tokenHash}`;
  }

  private getUserTokenKey(userId: string): string {
    return `${this.USER_TOKEN_PREFIX}${userId}`;
  }

  private getFreezeKey(email: string): string {
    return `${this.FREEZE_PREFIX}${email}`;
  }

  private getRequestAttemptsKey(email: string): string {
    return `${this.REQUEST_ATTEMPTS_PREFIX}${email}`;
  }

  private getEmailBlockKey(email: string): string {
    return `${this.EMAIL_BLOCK_PREFIX}${email}`;
  }

  private getInvalidAttemptsKey(ip: string): string {
    return `${this.INVALID_ATTEMPTS_PREFIX}${ip}`;
  }

  private getIpBlockKey(ip: string): string {
    return `${this.IP_BLOCK_PREFIX}${ip}`;
  }

  /**
   * TTL restante en segundos, o 0 si la clave no existe o no tiene caducidad.
   * Redis devuelve -2 cuando la clave no existe y -1 cuando no expira; ambos
   * casos se traducen a 0 para que el servicio los interprete como "no activo".
   */
  private async getRemainingTtl(key: string): Promise<number> {
    const ttl = await redis.ttl(key);
    return ttl > 0 ? ttl : 0;
  }

  /**
   * Incrementa un contador y le fija la ventana solo en el primer incremento,
   * de modo que la ventana no se extiende con cada intento.
   */
  private async incrementWithWindow(
    key: string,
    windowSeconds: number,
  ): Promise<number> {
    const total = await redis.incr(key);

    if (total === 1) {
      await redis.expire(key, windowSeconds);
    }

    return total;
  }

  async saveToken(
    tokenHash: string,
    record: PasswordResetTokenRecord,
    ttlSeconds: number,
  ): Promise<void> {
    await Promise.all([
      redis.setEx(this.getTokenKey(tokenHash), ttlSeconds, JSON.stringify(record)),
      redis.setEx(this.getUserTokenKey(record.userId), ttlSeconds, tokenHash),
    ]);
  }

  async findTokenRecord(
    tokenHash: string,
  ): Promise<PasswordResetTokenRecord | null> {
    const raw = await redis.get(this.getTokenKey(tokenHash));

    if (!raw) return null;

    try {
      return JSON.parse(raw) as PasswordResetTokenRecord;
    } catch {
      throw ServerError(
        "El enlace de restablecimiento almacenado en Redis está corrupto",
      );
    }
  }

  async findActiveTokenHashByUser(userId: string): Promise<string | null> {
    return redis.get(this.getUserTokenKey(userId));
  }

  async deleteToken(tokenHash: string, userId: string): Promise<void> {
    await Promise.all([
      redis.del(this.getTokenKey(tokenHash)),
      redis.del(this.getUserTokenKey(userId)),
    ]);
  }

  async getFreezeTtlSeconds(email: string): Promise<number> {
    return this.getRemainingTtl(this.getFreezeKey(email));
  }

  async startFreeze(email: string, ttlSeconds: number): Promise<void> {
    await redis.setEx(this.getFreezeKey(email), ttlSeconds, this.PRESENT);
  }

  async getEmailBlockTtlSeconds(email: string): Promise<number> {
    return this.getRemainingTtl(this.getEmailBlockKey(email));
  }

  /**
   * Activa el bloqueo y borra el contador de solicitudes. Borrarlo es lo que
   * hace que el contador vuelva a cero al vencer el bloqueo sin necesidad de
   * ninguna tarea de limpieza.
   */
  async blockEmail(email: string, ttlSeconds: number): Promise<void> {
    await Promise.all([
      redis.setEx(this.getEmailBlockKey(email), ttlSeconds, this.PRESENT),
      redis.del(this.getRequestAttemptsKey(email)),
    ]);
  }

  async incrementRequestAttempts(
    email: string,
    windowSeconds: number,
  ): Promise<number> {
    return this.incrementWithWindow(
      this.getRequestAttemptsKey(email),
      windowSeconds,
    );
  }

  async clearEmailCounters(email: string): Promise<void> {
    await Promise.all([
      redis.del(this.getFreezeKey(email)),
      redis.del(this.getRequestAttemptsKey(email)),
      redis.del(this.getEmailBlockKey(email)),
    ]);
  }

  async getIpBlockTtlSeconds(ip: string): Promise<number> {
    return this.getRemainingTtl(this.getIpBlockKey(ip));
  }

  async blockIp(ip: string, ttlSeconds: number): Promise<void> {
    await Promise.all([
      redis.setEx(this.getIpBlockKey(ip), ttlSeconds, this.PRESENT),
      redis.del(this.getInvalidAttemptsKey(ip)),
    ]);
  }

  async incrementInvalidAttempts(
    ip: string,
    windowSeconds: number,
  ): Promise<number> {
    return this.incrementWithWindow(
      this.getInvalidAttemptsKey(ip),
      windowSeconds,
    );
  }

  async clearInvalidAttempts(ip: string): Promise<void> {
    await redis.del(this.getInvalidAttemptsKey(ip));
  }
}
