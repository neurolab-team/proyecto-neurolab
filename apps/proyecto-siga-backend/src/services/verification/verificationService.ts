import { inject, injectable } from "tsyringe";
import crypto from "crypto";
import { TokenCacheService } from "../token/tokenCacheService";
import { IVerificationService } from "../../contracts/verification/IverificationService";
import { BadRequest } from "../../utils/httpError";



@injectable()
export class VerificationService implements IVerificationService {
  constructor(
    @inject("TokenCacheService")
    private readonly tokenCacheService: TokenCacheService
  ) {}
  async consumeVerificationToken(token:string): Promise< void | string>  {
    const storedToken = await this.tokenCacheService.validateVerificationToken(token);
    if (!storedToken.valid) {
      throw BadRequest("Token de verificación inválido o expirado");
    }
    return storedToken.email;
  }

  async createVerificationToken(email: string) {
    const token = crypto.randomBytes(32).toString("hex");
    await this.tokenCacheService.storeVerificationToken(email, token);
    return token; 
  }
}
