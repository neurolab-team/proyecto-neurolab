import { Router } from "express";
import { auth, AuthedRequest } from "../middleware/auth";
import container from "../container/index";
import { IAuthService } from "../contracts/auth/IauthService";
import { TokenService } from "../services/auth/tokenService";
import {
  LoginDto,
  RefreshDto,
  LogoutDto,
  ChangePasswordDto,
} from "@packages/common-schemas/auth.schemas";
import { wrap } from "../middleware/async";
import { Unauthorized } from "../utils/httpError";
import { verifyRefreshToken } from "../utils/jwt";
import { ok } from "../utils/jsonResponse";

export const AuthController = Router();

const authService = container.resolve<IAuthService>("AuthService");
const tokenService = container.resolve<TokenService>("TokenService");



const parseRefreshToken = (refreshToken: string) => {
  const parts = refreshToken.split(".");
  if (parts.length !== 3) {
    throw Unauthorized("Refresh token inválido");
  }
  return refreshToken;
};

// Routes
AuthController.post(
  "/login",
  wrap(async (req, res) => {
    const { email, password } = LoginDto.parse(req.body);

    // Login through service
    const result = await authService.login(email, password);

    // Generate token pair
    const tokens = await tokenService.issuePair(result.user.userId);

    ok(res, {
      data: {
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        user: {
          id: result.user.userId,
          userNumber: result.user.userNumber,
          email: result.user.email,
          gender: result.user.gender,
          role: result.user.role,
          name: result.user.name,
          isActive: result.user.isActive,
          lastLogin: result.user.lastLogin,
          verifiedEmail: result.user.verifiedEmail ,
        },
      },
    });
  })
);

AuthController.post(
  "/refresh",
  wrap(async (req, res) => {
    const { refreshToken } = RefreshDto.parse(req.body);

    const tokenPair = await tokenService.rotateRefresh(refreshToken);

    ok(res, {
      data: {
        accessToken: tokenPair.accessToken,
        refreshToken: tokenPair.refreshToken,
      },
    });
  })
);

AuthController.post(
  "/logout",
  wrap(async (req, res) => {
    const { refreshToken } = LogoutDto.parse(req.body);

    const validRefreshToken = parseRefreshToken(refreshToken);

    const payload = verifyRefreshToken(validRefreshToken);
    if (!payload) {
      throw Unauthorized("Refresh token inválido");
    }
    if (!payload.jti) {
      throw Unauthorized("Refresh token inválido");
    }

    await tokenService.revoke(payload.jti);

    ok(res, {
      data: {
        message: "Logout exitoso",
      },
    });
  })
);

AuthController.post(
  "/logout-all",
  auth,
  wrap(async (req: AuthedRequest, res) => {
    await tokenService.revokeAllForUser(req.user!.id);

    ok(res, {
      data: {
        message: "Logout exitoso",
      },
    });
  })
);

AuthController.get(
  "/me",
  auth,
  wrap(async (req: AuthedRequest, res) => {
    const userProfile = await authService.getUserProfile(req.user!.id);

    if (!userProfile) {
      throw Unauthorized("Usuario no encontrado");
    }
    ok(res, {
      data: userProfile,
    });
  })
);

AuthController.put(
  "/change-password",
  auth,
  wrap(async (req: AuthedRequest, res) => {
    const { currentPassword, newPassword } = ChangePasswordDto.parse(req.body);

    // Change password through service (includes all validations)
    await authService.changePassword(
      req.user!.id,
      currentPassword,
      newPassword
    );

    ok(res, {
      data: {
        message: "Contraseña cambiada exitosamente",
      },
    });
  })
);

export default AuthController;