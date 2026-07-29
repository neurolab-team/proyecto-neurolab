import { Request, Response, NextFunction } from "express";
import {
  AppRole,
  SessionAuthResult,
} from "@packages/common-types/session.types";
import { Forbidden, Unauthorized } from "../utils/httpError";
import container from "../container";
import { SessionService } from "../services/session/sessionService";

export interface AuthedUser {
  userId: string;
  role: AppRole;
  email: string;
  mustChangePassword: boolean;
}

export interface AuthedRequest extends Request {
  user?: AuthedUser;
  sessionId?: string;
  headers: Request["headers"];
  body: any;
}

export type AuthResult = SessionAuthResult;

export function applyAuthResult(req: AuthedRequest, authResult: AuthResult): void {
  req.user = {
    userId: authResult.userId,
    role: authResult.role,
    email: authResult.email,
    mustChangePassword: authResult.mustChangePassword,
  };
  req.sessionId = authResult.sessionId;
}

/**
 * Rutas accesibles mientras el usuario arrastra una contraseña temporal: lo
 * mínimo para poder cambiarla, saber quién es y cerrar sesión.
 */
const PASSWORD_CHANGE_EXEMPT_ROUTES = new Set([
  "PUT /api/auth/change-password",
  "GET /api/auth/me",
  "POST /api/auth/logout",
  "POST /api/auth/logout-all",
]);

/**
 * Las cuentas de admin y psicólogo se crean con una contraseña temporal enviada
 * por correo y `mustChangePassword: true`. Antes este flag solo lo respetaba el
 * modal de login del frontend: la sesión ya era válida para toda la API, así
 * que bastaba con no usar la interfaz para no cambiar nunca esa contraseña.
 *
 * El bloqueo vive dentro de `auth` a propósito. Es el único punto por el que
 * pasan todas las rutas privadas, así que un router nuevo queda cubierto sin
 * que nadie tenga que acordarse de añadir nada.
 */
function assertPasswordChangeNotPending(req: AuthedRequest): void {
  if (!req.user?.mustChangePassword) return;

  const path = `${req.baseUrl}${req.path}`.replace(/\/$/, "");

  if (PASSWORD_CHANGE_EXEMPT_ROUTES.has(`${req.method} ${path}`)) return;

  throw Forbidden("Debes cambiar tu contraseña temporal antes de continuar");
}

export async function auth(
  req: AuthedRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    const sessionService = container.resolve(SessionService);
    const sessionId = sessionService.getSessionIdFromRequest(req);

    if (!sessionId) {
      throw Unauthorized("Sesión no encontrada");
    }

    const authResult = await sessionService.authenticate(sessionId);
    applyAuthResult(req, authResult);
    assertPasswordChangeNotPending(req);
    return next();
  } catch (error) {
    return next(error);
  }
}

export const checkRole = (allowedRoles: AppRole[]) => {
  return (req: AuthedRequest, res: Response, next: NextFunction) => {
    if (allowedRoles.includes(req.user?.role as AppRole)) {
      return next();
    }
    throw Forbidden();
  };
};

export const asUser = checkRole(["user"]);
export const asAdmin = checkRole(["admin"]);
export const asPsychologist = checkRole(["psychologist"]);
export const asAdminOrPsychologist = checkRole(["admin", "psychologist"]);
