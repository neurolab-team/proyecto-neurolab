import { inject, injectable } from "tsyringe";
import { randomBytes } from "crypto";
import { PasswordResetTokenRecord } from "@packages/common-types/passwordReset.types";
import { IPasswordResetService } from "../../contracts/passwordReset/IpasswordResetService";
import { IPasswordResetRepo } from "../../contracts/passwordReset/IpasswordResetRepo";
import { IPasswordResetEmailService } from "../../contracts/mail/IpasswordResetEmailService";
import { IAuthService } from "../../contracts/auth/IauthService";
import { ISessionService } from "../../contracts/session/IsessionService";
import type { IUserRepo } from "../../contracts/user/IuserRepo";
import {
  BadRequest,
  Forbidden,
  NotFound,
  ServerError,
  TooManyRequests,
} from "../../utils/httpError";
import {
  getPasswordResetPolicy,
  toRemainingMinutes,
} from "../../security/passwordResetPolicy";
import { logger } from "../../utils/logger";

const TOKEN_BYTES = 32;

/**
 * Mensaje único para cualquier enlace no utilizable: inexistente, caducado,
 * revocado o ya usado. Distinguir la causa le diría a un atacante si acertó la
 * forma del token, así que los cuatro casos comparten texto (FR-015).
 */
const INVALID_LINK_MESSAGE =
  "El enlace no es válido o ya caducó. Solicita uno nuevo.";

@injectable()
export class PasswordResetService implements IPasswordResetService {
  constructor(
    @inject("PasswordResetRepo")
    private readonly passwordResetRepo: IPasswordResetRepo,
    @inject("UserRepo")
    private readonly userRepo: IUserRepo,
    @inject("PasswordResetEmailService")
    private readonly passwordResetEmailService: IPasswordResetEmailService,
    @inject("AuthService")
    private readonly authService: IAuthService,
    @inject("SessionService")
    private readonly sessionService: ISessionService,
  ) {}

  /**
   * Emite un enlace y lo envía por correo.
   *
   * El orden importa: los bloqueos se comprueban antes de consultar la base de
   * datos, para que una petición bloqueada no cueste una consulta; y los
   * contadores se tocan solo después de que el correo haya salido, porque una
   * solicitud que no produce envío no debe consumir cuota (FR-019, FR-020).
   */
  async requestPasswordReset(email: string): Promise<void> {
    const policy = getPasswordResetPolicy();
    const normalizedEmail = this.normalizeEmail(email);

    await this.assertEmailNotBlocked(normalizedEmail);
    await this.assertNotInFreezeWindow(normalizedEmail);

    const user = await this.resolveEligibleUser(normalizedEmail);

    const token = randomBytes(TOKEN_BYTES).toString("hex");
    await this.issueToken(token, user.userId, normalizedEmail, policy.tokenTtlSeconds);

    const resetUrl = this.buildResetUrl(token);
    await this.passwordResetEmailService.sendPasswordResetEmail(
      normalizedEmail,
      user.name || "Usuario",
      resetUrl,
      Math.round(policy.tokenTtlSeconds / 60),
    );

    logger.info(
      `[passwordReset] enlace enviado a ${normalizedEmail} (usuario ${user.userId})`,
    );

    await this.registerAcceptedRequest(normalizedEmail, policy);
  }

  /**
   * Aplica la contraseña nueva. El enlace se consume después de escribir la
   * credencial: si la contraseña no cumple la política, el enlace sigue vivo y
   * la persona puede reintentar sin esperar los 5 minutos.
   */
  async resetPassword(
    token: string,
    newPassword: string,
    clientIp: string,
  ): Promise<void> {
    const policy = getPasswordResetPolicy();

    await this.assertIpNotBlocked(clientIp);

    const tokenHash = this.passwordResetRepo.hashToken(token);
    const record = await this.passwordResetRepo.findTokenRecord(tokenHash);

    if (!record) {
      await this.registerInvalidLinkAttempt(clientIp, policy);
      throw BadRequest(INVALID_LINK_MESSAGE);
    }

    const user = await this.userRepo.findById(record.userId);

    if (!user) {
      // El enlace era válido pero la cuenta desapareció. Se limpia el enlace y
      // se responde con el mensaje uniforme: no hay nada que la persona pueda
      // hacer con esa información y distinguirlo revelaría estado de cuentas.
      await this.passwordResetRepo.deleteToken(tokenHash, record.userId);
      throw NotFound(INVALID_LINK_MESSAGE);
    }

    await this.authService.resetPassword(record.userId, newPassword);

    await this.passwordResetRepo.deleteToken(tokenHash, record.userId);
    await this.passwordResetRepo.clearEmailCounters(record.email);
    await this.sessionService.revokeAllUserSessions(record.userId);

    logger.info(
      `[passwordReset] contraseña restablecida para el usuario ${record.userId}`,
    );
  }

  private normalizeEmail(email: string): string {
    return email.trim().toLowerCase();
  }

  private async assertEmailNotBlocked(email: string): Promise<void> {
    const remainingSeconds =
      await this.passwordResetRepo.getEmailBlockTtlSeconds(email);

    if (remainingSeconds > 0) {
      throw TooManyRequests(
        `Alcanzaste el máximo de solicitudes. Intenta de nuevo en ${toRemainingMinutes(
          remainingSeconds,
        )} minuto(s).`,
      );
    }
  }

  private async assertNotInFreezeWindow(email: string): Promise<void> {
    const remainingSeconds =
      await this.passwordResetRepo.getFreezeTtlSeconds(email);

    if (remainingSeconds > 0) {
      throw TooManyRequests(
        `Ya enviamos un enlace hace poco. Podrás solicitar otro en ${toRemainingMinutes(
          remainingSeconds,
        )} minuto(s).`,
      );
    }
  }

  private async assertIpNotBlocked(clientIp: string): Promise<void> {
    const remainingSeconds =
      await this.passwordResetRepo.getIpBlockTtlSeconds(clientIp);

    if (remainingSeconds > 0) {
      throw TooManyRequests(
        `Demasiados intentos con enlaces inválidos. Intenta de nuevo en ${toRemainingMinutes(
          remainingSeconds,
        )} minuto(s).`,
      );
    }
  }

  /**
   * Resuelve la cuenta y devuelve un mensaje específico por estado, según la
   * decisión de producto Q3: B de la especificación. Esto permite comprobar
   * desde fuera si un correo está registrado (riesgo R1, aceptado).
   */
  private async resolveEligibleUser(email: string) {
    const user = await this.userRepo.findByEmail(email);

    if (!user) {
      throw NotFound("Este correo no está registrado.");
    }

    if (!user.verifiedEmail) {
      throw Forbidden(
        "Debes verificar tu correo antes de restablecer la contraseña.",
      );
    }

    if (!user.isActive) {
      throw Forbidden("Tu cuenta está desactivada. Contacta al administrador.");
    }

    return user;
  }

  /**
   * Revoca el enlace anterior de la cuenta antes de guardar el nuevo, para que
   * nunca haya más de uno vigente (FR-013).
   */
  private async issueToken(
    token: string,
    userId: string,
    email: string,
    ttlSeconds: number,
  ): Promise<void> {
    const previousTokenHash =
      await this.passwordResetRepo.findActiveTokenHashByUser(userId);

    if (previousTokenHash) {
      await this.passwordResetRepo.deleteToken(previousTokenHash, userId);
    }

    const record: PasswordResetTokenRecord = {
      userId,
      email,
      createdAt: new Date().toISOString(),
    };

    await this.passwordResetRepo.saveToken(
      this.passwordResetRepo.hashToken(token),
      record,
      ttlSeconds,
    );
  }

  private async registerAcceptedRequest(
    email: string,
    policy: ReturnType<typeof getPasswordResetPolicy>,
  ): Promise<void> {
    const attempts = await this.passwordResetRepo.incrementRequestAttempts(
      email,
      policy.blockSeconds,
    );

    await this.passwordResetRepo.startFreeze(email, policy.freezeSeconds);

    if (attempts >= policy.maxRequests) {
      await this.passwordResetRepo.blockEmail(email, policy.blockSeconds);
      logger.warn(
        `[passwordReset] bloqueo de solicitudes activado para ${email} tras ${attempts} intento(s)`,
      );
    }
  }

  private async registerInvalidLinkAttempt(
    clientIp: string,
    policy: ReturnType<typeof getPasswordResetPolicy>,
  ): Promise<void> {
    const attempts = await this.passwordResetRepo.incrementInvalidAttempts(
      clientIp,
      policy.blockSeconds,
    );

    if (attempts >= policy.maxInvalidAttempts) {
      await this.passwordResetRepo.blockIp(clientIp, policy.blockSeconds);
      logger.warn(
        `[passwordReset] bloqueo por enlaces inválidos activado para el origen ${clientIp} tras ${attempts} intento(s)`,
      );
    }
  }

  private buildResetUrl(token: string): string {
    const frontendUrl = process.env.APP_FRONTEND_URL;

    if (!frontendUrl) {
      throw ServerError(
        "APP_FRONTEND_URL no está configurada: no se puede construir el enlace de restablecimiento",
      );
    }

    return `${frontendUrl}/reset-password?token=${token}`;
  }
}
