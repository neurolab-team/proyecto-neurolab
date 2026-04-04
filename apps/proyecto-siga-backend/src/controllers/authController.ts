import { Router } from "express";
import { AuthedRequest, auth } from "../middleware/auth";
import container from "../container/index";
import { IAuthService } from "../contracts/auth/IauthService";
import { LoginDto, ChangePasswordDto } from "@packages/common-schemas/auth.schemas";
import { wrap } from "../middleware/async";
import { Unauthorized } from "../utils/httpError";
import { ok } from "../utils/jsonResponse";
import { SessionService } from "../services/session/sessionService";

export const AuthController = Router();

const authService = container.resolve<IAuthService>("AuthService");
const sessionService = container.resolve(SessionService);

AuthController.post(
  "/login",
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
          verifiedEmail: user.verifiedEmail,
        },
      },
      "Inicio de sesión exitoso",
    );
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
