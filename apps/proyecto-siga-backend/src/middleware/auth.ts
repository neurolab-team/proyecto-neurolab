import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
// import prisma from '@packages/libs/prisma'
import { Forbidden, ServerError, Unauthorized } from "../utils/httpError";
import { container } from "tsyringe";
import { TokenCacheService } from "../services/token/tokenCacheService";

export type AppRole = "admin" | "psychologist" | "user";

export interface AuthedUser {
  id: string;
  role: AppRole;
  email: string;
}

export interface AuthedRequest extends Request {
  user?: AuthedUser;
  headers: Request["headers"];
  body: any;
}

export async function auth(
  req: AuthedRequest,
  res: Response,
  next: NextFunction
) {
  const h = req.headers.authorization || "";
  const token = h.startsWith("Bearer ") ? h.slice(7) : null;
  if (!token) return next(Unauthorized());

  try {
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      return next(ServerError("jwt clave no está configurado"));
    }
    const payload: any = jwt.verify(token, jwtSecret);

    if (!payload.sub || !payload.role || !payload.email) {
      return next(Unauthorized("Token inválido"));
    }

    req.user = { id: payload.sub, role: payload.role, email: payload.email };

    const tokenCacheService =
      container.resolve<TokenCacheService>("TokenCacheService");
    await tokenCacheService.storeAccessToken(req.user.id, token);
    next();
  } catch (error) {
    return next(
      ServerError("Errror inesperado verificando token", { detail: error })
    );
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

export const asAny = (
  _req: AuthedRequest,
  _res: Response,
  next: NextFunction
) => next();

export const asAdmin = checkRole(["admin"]);

export const asAdminOrPsychologist = checkRole(["admin", "psychologist"]);


//TODO:
//no se usa el asAny en el proyecto revisar como implementarlo o quitarlo