import { inject, injectable } from "tsyringe";
import bcrypt from "bcrypt";
import {
  IAuthService,
  UserAuth,
  LoginCredentials,
  LoginResult,
  UserProfile,
} from "../../contracts/auth/IauthService";
import type { IUserRepo } from "../../contracts/user/IuserRepo";
import { Unauthorized, BadRequest } from "../../utils/httpError";
import { checkPassword } from "../../security/passwordPolicy";
import { User } from "../../contracts";
@injectable()
export class AuthService implements IAuthService {
  constructor(
    @inject("UserRepo") private readonly userRepo: IUserRepo,
  ) {}
  private async HashPassword(password: string): Promise<string> {
    const rounds = Number(process.env.BCRYPT_SALT_ROUNDS);
    const saltRounds = Number.isFinite(rounds) && rounds > 0 ? rounds : 10;
    return bcrypt.hash(password, saltRounds);
  }
  async login(email: string, password: string): Promise<LoginResult> {
    const credentials: LoginCredentials = { email, password };

    password = await this.HashPassword(password);
    const user = await this.validateCredentials(credentials);
    return {
      token: "",
      user: {
        userId: user.userId,
        userNumber: user.userNumber,
        email: user.email,
        name: user.name || "",
        role: user.role,
        userType: user.userType,
        gender: user.gender || "",
        isActive: user.isActive,
        lastLogin: user.lastLogin,
      },
    };
  }

  async validateCredentials(credentials: LoginCredentials): Promise<User> {
    const user = await this.userRepo.findByEmail(credentials.email);

    if (!user) {
      throw Unauthorized("Credenciales inválidas");
    }
    const isValidPassword = await bcrypt.compare(
      credentials.password,
      user.password!
    );
    if (!isValidPassword) {
      throw Unauthorized("Credenciales inválidas");
    }

    return {
      userId: user.userId,
      userNumber: user.userNumber,
      email: user.email,
      name: user.name || "",
      role: user.role,
      userType: user.userType,
      isActive: user.isActive,
      lastLogin: user.lastLogin || undefined,
    };
  }

  async getUserById(userId: string): Promise<UserAuth | null> {
    return this.userRepo.findById(userId) as Promise<UserAuth | null>;
  }

  async getUserProfile(userId: string): Promise<UserProfile> {
    const user = await this.userRepo.findById(userId);
    if (!user) {
      throw Unauthorized("Usuario no encontrado");
    }
    return {
      userId: user.userId,
      userNumber: user.userNumber,
      email: user.email,
      name: user.name,
      role: user.role,
      gender: user.gender || "",
      createdAt: user.createdAt,
    };
  }

  async changePassword(
    userId: string,
    currentPassword: string,
    newPassword: string
  ): Promise<void> {
    // Validate current password and get user
    const user = await this.getUserById(userId);
    if (!user) {
      throw Unauthorized("Usuario no encontrado");
    }

    const isValidPassword = await bcrypt.compare(
      currentPassword,
      user.password
    );
    if (!isValidPassword) {
      throw Unauthorized("Contraseña actual incorrecta");
    }

    // Validate new password with security policies
    const passwordErrors = await checkPassword(newPassword);
    if (passwordErrors.length > 0) {
      throw BadRequest(passwordErrors.join(". "));
    }

    // Hash new password
    const saltRounds = process.env.BCRYPT_SALT_ROUNDS
      ? Number(process.env.BCRYPT_SALT_ROUNDS)
      : 10;
    const newPasswordHash = await bcrypt.hash(newPassword, saltRounds);

    await this.userRepo.update(user.userId, {
      password: newPasswordHash,
      tokenVersion: { increment: 1 },
    });
  }

  async validateToken(userId: string, tokenVersion: number): Promise<boolean> {
    try {
      const user = await this.userRepo.findById(userId);

      if (!user || !user.isActive) {
        return false;
      }

      return user.tokenVersion === tokenVersion;
    } catch (error) {
      return false;
    }
  }
}
//TODO:
// evitar porque no hay logica para el last login y definir como se va a manejar cuando un usuario lo desactivan
