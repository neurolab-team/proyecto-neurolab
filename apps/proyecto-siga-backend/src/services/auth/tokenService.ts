import { inject, injectable } from "tsyringe";
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from "../../utils/jwt";
import { Unauthorized } from "../../utils/httpError";
import type { IUserRepo } from "../../contracts/user/IuserRepo";
import { IRefreshTokenService } from "../../contracts/auth/IrefreshTokenService";
import { TokenCacheService } from "../token/tokenCacheService";

@injectable()
export class TokenService implements IRefreshTokenService {
  constructor(
    @inject("UserRepo") private readonly userRepo: IUserRepo,
    @inject("TokenCacheService")
    private readonly tokenCacheService: TokenCacheService,
  ) {}

  private async generateTokens(//que pasa si genero varias veces?
    user: {
      userId: string;
      role: string;
      email: string;
      tokenVersion: number | null;
    },
  ) {
    const accessToken = signAccessToken({
      sub: user.userId,
      role: user.role,
      email: user.email,
      tokenVersion: user.tokenVersion || 0,
    });
    await this.tokenCacheService.storeAccessToken(user.userId, accessToken); 

    const refreshToken = signRefreshToken({
      sub: user.userId,
      role: user.role,
      email: user.email,
      tokenVersion: user.tokenVersion || 0,
    });
    await this.tokenCacheService.storeRefreshToken(user.userId, refreshToken);

    return { accessToken, refreshToken };
  }

  // no me gusta que vuelva a buscar el usuario
  async issuePair(userId: string) {
    const user = await this.userRepo.findById(userId);
    if (!user) throw Unauthorized("Usuario no encontrado");
    return this.generateTokens(user);
  }

  //Revisar la logica de rotacion
  async rotateRefresh(oldToken: string) {
    let payload;
    try {
      payload = verifyRefreshToken(oldToken);
      if (!payload) throw new Error();
      if (!payload.jti) throw new Error();
    } catch {
      throw Unauthorized("Refresh token inválido");
    }

    // const rt = await this.refreshTokenRepo.findById(payload.jti);
    // if (!rt) throw Unauthorized("Refresh token no registrado");
    // if (rt.revokedAt) throw Unauthorized("Refresh token revocado");
    // if (rt.expiresAt <= new Date())
    //   throw Unauthorized("Refresh token expirado");

    // await this.refreshTokenRepo.update(payload.jti, { revokedAt: new Date() });

    const user = await this.userRepo.findById(payload.sub);
    if (!user) throw Unauthorized("Usuario no encontrado");

    return this.generateTokens(user);
  }

  async revoke(jti: string) {
    // await this.refreshTokenRepo.updateMany(
    //   { jti, revokedAt: null },
    //   { revokedAt: new Date() }
    // );
    console.log("no implementado");
  }
  async revokeAllForUser(userId: string) {
    // await this.userRepo.update(userId, { tokenVersion: { increment: 1 } });
    // await this.refreshTokenRepo.updateMany(
    //   { userId, revokedAt: null },
    //   { revokedAt: new Date() }
    // );
    console.log("no implementado");
  }
}

/*TODO:
  - TokenServiceRepo se debe eliminar solo usar cache

*/
