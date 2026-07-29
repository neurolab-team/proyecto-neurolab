import { inject, injectable } from "tsyringe";
import bcrypt from "bcrypt";
import { randomBytes } from "crypto";
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

function resolveSaltRounds(): number {
  const rounds = Number(process.env.BCRYPT_SALT_ROUNDS);
  return Number.isFinite(rounds) && rounds > 0 ? rounds : 10;
}

/**
 * Hash de una cadena aleatoria, generado una vez al arrancar y con el mismo
 * coste que los hashes reales. Se usa para que las rutas de login que fallan
 * porque el email no existe consuman el mismo tiempo que las que fallan por
 * contraseña incorrecta, y no se pueda inferir qué correos están registrados.
 * Nada puede coincidir con él: la cadena de origen se descarta.
 */
const TIMING_EQUALIZER_HASH = bcrypt.hashSync(
  randomBytes(32).toString("hex"),
  resolveSaltRounds(),
);

@injectable()
export class AuthService implements IAuthService {
  constructor(
    @inject("UserRepo") private readonly userRepo: IUserRepo,
  ) {}

  private async HashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, resolveSaltRounds());
  }

  async login(email: string, password: string): Promise<LoginResult> {
    const credentials: LoginCredentials = { email, password };

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
      // Se compara contra un hash de descarte para que un email inexistente
      // tarde lo mismo que uno existente con contraseña incorrecta. Sin esto,
      // la diferencia de tiempo (~100 ms) permite averiguar desde fuera qué
      // correos están registrados.
      await bcrypt.compare(credentials.password, TIMING_EQUALIZER_HASH);
      throw Unauthorized("Credenciales inválidas");
    }

    const isValidPassword = await bcrypt.compare(
      credentials.password,
      user.password ?? TIMING_EQUALIZER_HASH
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
      role: user.role as User["role"],
      userType: user.userType as User["userType"],
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
      role: user.role as User["role"],
      userType: user.userType as User["userType"],
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
      user.password ?? TIMING_EQUALIZER_HASH
    );
    if (!isValidPassword) {
      throw Unauthorized("Contraseña actual incorrecta");
    }

    // Validate new password with security policies
    const passwordErrors = await checkPassword(newPassword, user.email);
    if (passwordErrors.length > 0) {
      throw BadRequest(passwordErrors.join(". "));
    }

    // Hash new password
    const newPasswordHash = await this.HashPassword(newPassword);

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
    role: string;
    userType: string;
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
      role: user.role as User["role"],
      userType: user.userType as User["userType"],
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
