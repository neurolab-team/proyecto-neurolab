import { inject, injectable } from "tsyringe";
import bcrypt from "bcrypt";
import {
  LoginCredentials,
  LoginResult,
  UserProfile,
} from "@packages/common-types/auth.types";
import { IAuthService } from "../../contracts/auth/IauthService";
import type { IUserRepo } from "../../contracts/user/IuserRepo";
import { Unauthorized, BadRequest } from "../../utils/httpError";
import { checkPassword } from "../../security/passwordPolicy";
import { User } from "@packages/common-types/user.types";

type AuthUserRecord = User & {
  password: string | null;
};

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
      user: {
        userId: user.userId,
        userNumber: user.userNumber,
        email: user.email,
        name: user.name || "",
        role: user.role,
        userType: user.userType,
        gender: user.gender || "",
        isActive: user.isActive,
        mustChangePassword: user.mustChangePassword,
        passwordChangedAt: user.passwordChangedAt || undefined,
        lastLogin: user.lastLogin,
        verifiedEmail: user.verifiedEmail ,        
      },
    };
  }

  async updateLastLogin(
    userId: string,
    loginAt: Date = new Date(),
  ): Promise<UserProfile> {
    const user = await this.userRepo.update(userId, {
      lastLogin: loginAt,
    });

    return this.mapToUserProfile(user);
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

    if (!user.verifiedEmail) {
      throw Unauthorized("Debes verificar tu correo electrónico antes de iniciar sesión");
    }

    if (!user.isActive) {
      throw Unauthorized("Tu cuenta está inactiva. Contacta al administrador");
    }

    return {
      userId: user.userId,
      userNumber: user.userNumber,
      email: user.email,
      name: user.name || "",
      role: user.role,
      userType: user.userType,
      isActive: user.isActive,
      gender: user.gender || "",
      mustChangePassword: user.mustChangePassword,
      passwordChangedAt: user.passwordChangedAt || undefined,
      verifiedEmail: user.verifiedEmail ,
      lastLogin: user.lastLogin || undefined,
    };
  }

  async getUserById(userId: string): Promise<AuthUserRecord | null> {
    const user = await this.userRepo.findById(userId);
    if (!user) return null;

    return {
      userId: user.userId,
      userNumber: user.userNumber,
      email: user.email,
      name: user.name || "",
      role: user.role,
      userType: user.userType,
      gender: user.gender || "",
      birthDate: user.birthDate || undefined,
      lastLogin: user.lastLogin || undefined,
      passwordChangedAt: user.passwordChangedAt || undefined,
      mustChangePassword: user.mustChangePassword,
      verifiedEmail: user.verifiedEmail,
      isActive: user.isActive,
      password: user.password,
    };
  }

  async getUserProfile(userId: string): Promise<UserProfile> {
    const user = await this.userRepo.findById(userId);
    if (!user) {
      throw Unauthorized("Usuario no encontrado");
    }
    return this.mapToUserProfile(user);
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
      user.password || ""
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
      mustChangePassword: false,
      passwordChangedAt: new Date(),
    });
  }

  private mapToUserProfile(user: {
    userId: string;
    userNumber: string;
    email: string;
    name: string | null;
    role: User["role"];
    userType: User["userType"];
    gender: string | null;
    birthDate: Date | null;
    lastLogin: Date | null;
    passwordChangedAt?: Date | null;
    mustChangePassword: boolean;
    verifiedEmail: boolean;
    isActive: boolean;
  }): UserProfile {
    return {
      userId: user.userId,
      userNumber: user.userNumber,
      email: user.email,
      name: user.name || "",
      role: user.role,
      userType: user.userType,
      gender: user.gender || "",
      birthDate: user.birthDate || undefined,
      lastLogin: user.lastLogin || undefined,
      passwordChangedAt: user.passwordChangedAt || undefined,
      mustChangePassword: user.mustChangePassword,
      verifiedEmail: user.verifiedEmail,
      isActive: user.isActive,
    };
  }
}
//TODO:
// evitar porque no hay logica para el last login y definir como se va a manejar cuando un usuario lo desactivan
