import { Router } from "express";
import type { Request } from "express";
import { AuthedRequest, auth } from "../middleware/auth";
import container from "../container/index";
import { IAuthService } from "../contracts/auth/IauthService";
import { IPasswordResetService } from "../contracts/passwordReset/IpasswordResetService";
import {
  LoginDto,
  ChangePasswordDto,
  ForgotPasswordDto,
  ResetPasswordDto,
} from "@packages/common-schemas/auth.schemas";
import { wrap } from "../middleware/async";
import { Unauthorized } from "../utils/httpError";
import { ok } from "../utils/jsonResponse";
import { SessionService } from "../services/session/sessionService";
import {
  authIpRateLimiter,
  loginRateLimiter,
  forgotPasswordRateLimiter,
} from "../security/httpSecurity";

export const AuthController = Router();

const authService = container.resolve<IAuthService>("AuthService");
const sessionService = container.resolve(SessionService);
const passwordResetService = container.resolve<IPasswordResetService>(
  "PasswordResetService",
);

/**
 * Origen de la petición para el contador de enlaces inválidos. Express resuelve
 * `req.ip` a partir de X-Forwarded-For porque la app corre con `trust proxy`; el
 * BFF de Next reenvía la IP real del cliente. El literal de reserva evita que
 * una petición sin IP resoluble quede sin ninguna contabilidad.
 */
function resolveClientIp(req: Request): string {
  return req.ip ?? req.socket?.remoteAddress ?? "unknown";
}

AuthController.post(
  "/login",
  authIpRateLimiter,
  loginRateLimiter,
  wrap(async (req, res) => {
    const { email, password } = LoginDto.parse(req.body);
    const result = await authService.login(email, password);
    const session = await sessionService.createSession({
      userId: result.user.userId,
    });
    const user = await authService.updateLastLogin(result.user.userId);

    return ok(
      res,
      {
        sessionId: session.sessionId,
        user: {
          userId: user.userId,
          userNumber: user.userNumber,
          email: user.email,
          gender: user.gender,
          role: user.role,
          name: user.name,
          isActive: user.isActive,
          lastLogin: user.lastLogin,
          passwordChangedAt: user.passwordChangedAt,
          mustChangePassword: user.mustChangePassword,
          verifiedEmail: user.verifiedEmail,
        },
      },
      "Inicio de sesión exitoso",
    );
  }),
);

// Rutas públicas del flujo de restablecimiento de contraseña.
// Los límites de 5 minutos de espera, 3 solicitudes y 30 minutos de bloqueo
// viven en PasswordResetService, porque necesitan devolver el tiempo restante
// al usuario y limpiarse tras un restablecimiento exitoso. Los limitadores de
// abajo son la segunda capa por IP.
AuthController.post(
  "/forgot-password",
  authIpRateLimiter,
  forgotPasswordRateLimiter,
  wrap(async (req, res) => {
    const { email } = ForgotPasswordDto.parse(req.body);

    await passwordResetService.requestPasswordReset(email);

    return ok(
      res,
      null,
      "Te enviamos un enlace para restablecer tu contraseña. Caduca en 30 minutos.",
    );
  }),
);

AuthController.post(
  "/reset-password",
  authIpRateLimiter,
  wrap(async (req, res) => {
    const { token, newPassword } = ResetPasswordDto.parse(req.body);

    await passwordResetService.resetPassword(
      token,
      newPassword,
      resolveClientIp(req),
    );

    return ok(res, null, "Contraseña restablecida. Ya puedes iniciar sesión.");
  }),
);

AuthController.post(
  "/logout",
  auth,
  wrap(async (req: AuthedRequest, res) => {
    if (!req.sessionId) {
      throw Unauthorized("Sesión inválida");
    }

    await sessionService.revokeSession(req.sessionId);
    return ok(res, null, "Logout exitoso");
  }),
);

AuthController.post(
  "/logout-all",
  auth,
  wrap(async (req: AuthedRequest, res) => {
    await sessionService.revokeAllUserSessions(req.user!.userId);

    return ok(res, null, "Logout exitoso");
  }),
);

AuthController.get(
  "/me",
  auth,
  wrap(async (req: AuthedRequest, res) => {
    const userProfile = await authService.getUserProfile(req.user!.userId);
    if (!userProfile) {
      throw Unauthorized("Usuario no encontrado");
    }

    return ok(res, userProfile, "Usuario autenticado");
  }),
);

AuthController.patch(
  "/usability-survey/click",
  auth,
  wrap(async (req: AuthedRequest, res) => {
    await authService.markUsabilitySurveyClicked(req.user!.userId);
    return ok(res, null, "Registrado");
  }),
);

AuthController.put(
  "/change-password",
  auth,
  wrap(async (req: AuthedRequest, res) => {
    const { currentPassword, newPassword } = ChangePasswordDto.parse(req.body);

    await authService.changePassword(
      req.user!.userId,
      currentPassword,
      newPassword,
    );

    await sessionService.revokeAllUserSessions(req.user!.userId);

    return ok(res, null, "Contraseña cambiada exitosamente");
  }),
);

export default AuthController;
