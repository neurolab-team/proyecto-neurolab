import { inject, injectable } from "tsyringe";
import bcrypt from "bcrypt";
import {
  IUserService,
  User,
  CreateUserInput,
} from "../../contracts/user/IuserService";
import { generateSecurePassword } from "../../utils/sendEmail";
import prisma from "@packages/libs/prisma";
import { BadRequest, NotFound } from "../../utils/httpError";
import { IEmailVerificationService } from "../../contracts/mail/IemailVerificationService";
import { IUserRepo } from "../../contracts/user/IuserRepo";
import { IVerificationService } from "../../contracts/verification/IverificationService";

@injectable()
export class UserService implements IUserService {
  constructor(
    @inject("EmailVerificationService")
    private readonly emailVerificationService: IEmailVerificationService,
    @inject("UserRepo")
    private readonly userRepo: IUserRepo,
    @inject("VerificationService")
    private readonly verificationService: IVerificationService,
    // @inject("PasswordResetTokenRepo")
    // private readonly passwordResetTokenRepo: IPasswordResetTokenRepo,
  ) {}

  private async HashPassword(password: string): Promise<string> {
    const rounds = Number(process.env.BCRYPT_SALT_ROUNDS || 10);
    const saltRounds = Number.isFinite(rounds) && rounds > 0 ? rounds : 10;
    return bcrypt.hash(password, saltRounds);
  }

  async getUsers(): Promise<User[]> {
    return this.userRepo.findMany() as Promise<User[]>;
  }

  async getUserById(id: string): Promise<User | null> {
    return this.userRepo.findById(id) as Promise<User | null>;
  }

  async checkEmailAvailable(
    email: string,
    excludeId?: string
  ): Promise<boolean> {
    const existingUser = await this.userRepo.findByEmail(email.toLowerCase());
    if (!existingUser) return true;
    if (excludeId && existingUser.userId === excludeId) return true;
    return false;
  }

  async createUser(input: CreateUserInput): Promise<User> {
    return prisma.$transaction(async (tx) => {
      const isEmailAvailable = await this.checkEmailAvailable(input.email);
      if (!isEmailAvailable) {
        throw BadRequest("El email ya está registrado");
      }

      const email = input.email.toLowerCase();

      if (
        input.userType === "itmStudent" &&
        !email.endsWith("@correo.itm.edu.co")
      ) {
        throw BadRequest(
          "Los estudiantes deben usar correo @correo.itm.edu.co"
        );
      }
      if (input.userType === "itmEmployee" && !email.endsWith("@itm.edu.co")) {
        throw BadRequest("Los empleados deben usar correo @itm.edu.co");
      }
      let hashedPassword:string;

      if (input.password === "" || !input.password) { // genera password temporales
        const temporaryPassword = await generateSecurePassword();
        hashedPassword = await this.HashPassword(temporaryPassword);
        console.log(`Temporary password: ${temporaryPassword}`); //Solo para testeo
      }else {
        hashedPassword = await this.HashPassword(input.password);
      }
      
      const user = await this.userRepo.create(
        {
          userNumber: input.userNumber,
          email: input.email.toLowerCase(),
          name: input.name ?? "",
          role: input.role,
          userType: input.userType,
          gender: input.gender,
          birthDate: input.birthDate ? new Date(input.birthDate) : undefined,
          password: hashedPassword,
          isActive: true,
          lastLogin: null,
        },
        tx
      );
      if (input.role in ["admin", "psychologist"]) {
        console.log("implementar logica de envío de email para admin y psychologist");
        return user as User;
      }
      const verificationToken = await this.verificationService.createVerificationToken(user.email);
      const verificationUrl = `${process.env.APP_FRONTEND_URL}/verify-email?token=${verificationToken}`;
      await this.emailVerificationService.sendVerificationEmailUser(
        user.email,
        user.name || "Usuario",
        verificationUrl
      );


      return user as User;
    });
  }

  // async updateUser(id: string, input: UpdateUserInput): Promise<User> { //not implemented yet
  //   return prisma.$transaction(async (tx) => {
  //     const existingUser = await this.userRepo.findById(id, tx);
  //     if (!existingUser) {
  //       throw NotFound("Usuario no encontrado");
  //     }
  //     if (input.email && input.email !== existingUser.email) {
  //       const isEmailAvailable = await this.checkEmailAvailable(
  //         input.email,
  //         id
  //       );
  //       if (!isEmailAvailable) {
  //         throw BadRequest("El email ya está registrado");
  //       }
  //     }
  //     const updatedUser = await this.userRepo.update(
  //       id,
  //       {
  //         email: input.email?.toLowerCase() ?? existingUser.email,
  //         name: input.name ?? existingUser.name,
  //         role: input.role ?? existingUser.role,
  //       },
  //       tx
  //     );

  //     return updatedUser as User;
  //   });
  // }

  async deactivateUser(id: string): Promise<void> {
    await prisma.$transaction(async (tx) => {
      const user = await this.userRepo.findById(id, tx);
      if (!user) {
        throw NotFound("Usuario no encontrado");
      }

      if (!user.isActive) {
        throw BadRequest("El usuario ya está desactivado");
      }

      await this.userRepo.update(
        id,
        {
          isActive: false,
          tokenVersion: { increment: 1 },
        },
        tx
      );

      try {
        // await this.refreshTokenRepo.updateMany(
        //   { userId: id },
        //   { revokedAt: new Date() },
        //   tx

        // );
      } catch (error) {
        throw BadRequest("Error al revocar tokens de sesión", {
          details: error,
        });
      }
    });
  }

  async activateUser(id: string): Promise<void> {
    await prisma.$transaction(async (tx) => {
      const user = await this.userRepo.findById(id, tx);
      if (!user) {
        throw NotFound("Usuario no encontrado");
      }

      if (user.isActive) {
        throw BadRequest("El usuario ya está activo");
      }

      await this.userRepo.update(id, { isActive: true }, tx);
    });
  }

  async verifyEmail(token: string): Promise<void> {
    const email = await this.verificationService.consumeVerificationToken(token);
    await prisma.user.update({
      where: { email: email! },
      data: { 
        verifiedEmail: true,
      }
    });
  }

  // async requestPasswordReset(email: string): Promise<void> {
  //   const user = await this.userRepo.findByEmail(email.toLowerCase());

  //   if (!user) {
  //     throw NotFound("Usuario no encontrado");
  //   }

  //   if (!user.isActive) {
  //     throw BadRequest(
  //       "La cuenta no está activada. Solicita reenviar el email de activación."
  //     );
  //   }

  //   await prisma.$transaction(async (tx) => {
  //     await this.passwordResetTokenRepo.deleteMany({ userId: user.userId }, tx);

  //     const resetToken = jwt.sign(
  //       { userId: user.userId, type: "password_reset" },
  //       process.env.JWT_SECRET!,
  //       { expiresIn: "1h" }
  //     );

  //     await this.passwordResetTokenRepo.create(
  //       {
  //         token: resetToken,
  //         user: { connect: { id: user.userId } },
  //         expiresAt: new Date(Date.now() + 60 * 60 * 1000),
  //       },
  //       tx
  //     );

  //     await this.emailService.sendPasswordResetEmail({
  //       email: user.email,
  //       name: user.name || "Usuario",
  //       resetToken,
  //     });
  //   });
  // }

  // async resetPassword(token: string, newPassword: string): Promise<void> {
  //   await prisma.$transaction(async (tx) => {
  //     const resetToken = await this.passwordResetTokenRepo.findByToken(
  //       token,
  //       { user: true },
  //       tx
  //     );

  //     if (!resetToken) {
  //       throw BadRequest("Token de restablecimiento inválido");
  //     }

  //     if (resetToken.expiresAt < new Date()) {
  //       throw BadRequest("Token de restablecimiento expirado");
  //     }

  //     const passwordHash = await this.validateAndHashPassword(
  //       newPassword,
  //       resetToken.user.email
  //     );

  //     await this.userRepo.update(
  //       resetToken.userId,
  //       {
  //         password: passwordHash,
  //         tokenVersion: { increment: 1 },
  //       },
  //       tx
  //     );

  //     await this.passwordResetTokenRepo.delete(resetToken.id, tx);

  //     try {
  //       await this.refreshTokenRepo.updateMany(
  //         { userId: resetToken.userId },
  //         { revokedAt: new Date() },
  //         tx
  //       );
  //     } catch (error) {
  //       throw BadRequest("Error al revocar tokens de sesión", { details: error });
  //     }
  //   });
  // }

  // async resendActivation(email: string): Promise<void> {
  //   const user = await this.userRepo.findByEmail(email.toLowerCase());

  //   if (!user) {
  //     throw NotFound("Usuario no encontrado");
  //   }

  //   if (user.isActive) {
  //     throw BadRequest("La cuenta ya está activada");
  //   }

  //   await prisma.$transaction(async (tx) => {
  //     await this.emailVerificationTokenRepo.deleteMany(
  //       { userId: user.userId },
  //       tx
  //     );

  //     const temporaryPassword =
  //       this.verificationService.generateSecurePassword();
  //     const passwordHash = await this.validateAndHashPassword(
  //       temporaryPassword,
  //       user.email
  //     );

  //     await this.userRepo.update(user.userId, { password: passwordHash }, tx);

  //     const verificationToken = jwt.sign(
  //       { userId: user.userId, type: "email_verification" },
  //       process.env.JWT_SECRET!,
  //       { expiresIn: "24h" }
  //     );

  //     await this.emailVerificationTokenRepo.create(
  //       {
  //         token: verificationToken,
  //         user: { connect: { id: user.userId } },
  //         expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
  //       },
  //       tx
  //     );

  //     await this.emailService.sendVerificationEmail({
  //       email: user.email,
  //       name: user.name || "Usuario",
  //       temporaryPassword,
  //       verificationToken,
  //     });
  //   });
  // }

  async checkUnverifiedAccount(email: string): Promise<boolean> {
    const user = await this.userRepo.findByEmail(email.toLowerCase());
    return user ? !user.isActive : false;
  }
}
