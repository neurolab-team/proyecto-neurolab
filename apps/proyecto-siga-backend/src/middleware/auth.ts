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
  };
  req.sessionId = authResult.sessionId;
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
