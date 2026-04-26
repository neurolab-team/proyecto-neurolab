import { inject, injectable } from "tsyringe";
import bcrypt from "bcrypt";
import { Prisma } from "@prisma/client";
import {
  AssignPsychologistInput,
  CreateUserInput,
  UpdateUserRoleInput,
  User,
} from "@packages/common-types/user.types";
import {
  PsychologistStudentResultsFilters,
  PsychologistStudentResultsResponse,
} from "@packages/common-types/psychologist.types";
import prisma from "@packages/libs/prisma";
import { generateSecurePassword } from "../../utils/sendEmail";
import { BadRequest, NotFound } from "../../utils/httpError";
import { IEmailVerificationService } from "../../contracts/mail/IemailVerificationService";
import { IUserRepo } from "../../contracts/user/IuserRepo";
import { IVerificationService } from "../../contracts/verification/IverificationService";
import { IAssignmentService } from "../../contracts/assignment/IassignmentService";
import { IUserService } from "../../contracts/user/IuserService";
import { PsychologistStudentsQueryService } from "../../modules/psychologist/psychologistStudentsQuery";
import { mapUserRecordToUser } from "../../modules/users/user.mapper";

@injectable()
export class UserService implements IUserService {
  constructor(
    @inject("EmailVerificationService")
    private readonly emailVerificationService: IEmailVerificationService,
    @inject("UserRepo")
    private readonly userRepo: IUserRepo,
    @inject("VerificationService")
    private readonly verificationService: IVerificationService,
    @inject("AssignmentService")
    private readonly assignmentService: IAssignmentService,
    @inject("PsychologistStudentsQueryService")
    private readonly psychologistStudentsQueryService: PsychologistStudentsQueryService,
  ) {}

  private async HashPassword(password: string): Promise<string> {
    const rounds = Number(process.env.BCRYPT_SALT_ROUNDS || 10);
    const saltRounds = Number.isFinite(rounds) && rounds > 0 ? rounds : 10;
    return bcrypt.hash(password, saltRounds);
  }

  async getUsers(): Promise<User[]> {
    const users = await this.userRepo.findManyWithPsychologist();
    return users.map((user) => mapUserRecordToUser(user));
  }

  async getUserById(id: string): Promise<User | null> {
    const user = await this.userRepo.findById(id);
    return user ? mapUserRecordToUser(user) : null;
  }

  async getPsychologistStudents(psychologistId: string) {
    return this.psychologistStudentsQueryService.getPsychologistStudents(
      psychologistId,
    );
  }

  async getPsychologistStudentById(psychologistId: string, studentId: string) {
    return this.psychologistStudentsQueryService.getPsychologistStudentById(
      psychologistId,
      studentId,
    );
  }

  async getPsychologistStudentResults(
    psychologistId: string,
    filters: PsychologistStudentResultsFilters,
  ): Promise<PsychologistStudentResultsResponse> {
    return this.psychologistStudentsQueryService.getPsychologistStudentResults(
      psychologistId,
      filters,
    );
  }

  async checkEmailAvailable(
    email: string,
    excludeId?: string,
  ): Promise<boolean> {
    const existingUser = await this.userRepo.findByEmail(email.toLowerCase());
    if (!existingUser) return true;
    if (excludeId && existingUser.userId === excludeId) return true;
    return false;
  }

  async createUser(input: CreateUserInput): Promise<User> {
    const email = input.email.toLowerCase();

    if (
      input.userType === "itmStudent" &&
      !email.endsWith("@correo.itm.edu.co")
    ) {
      throw BadRequest("Los estudiantes deben usar correo @correo.itm.edu.co");
    }

    if (input.userType === "itmEmployee" && !email.endsWith("@itm.edu.co")) {
      throw BadRequest("Los empleados deben usar correo @itm.edu.co");
    }

    const hashedPassword = await this.HashPassword(input.password!);
    const verificationToken =
      await this.verificationService.createVerificationToken(email);

    const user = await prisma.$transaction(async (tx) => {
      const createdUser = await this.userRepo.create(
        {
          userNumber: input.userNumber,
          email,
          name: input.name ?? "",
          role: input.role,
          userType: input.userType,
          gender: input.gender,
          birthDate: input.birthDate ? new Date(input.birthDate) : undefined,
          password: hashedPassword,
          isActive: true,
          verifiedEmail: false,
          lastLogin: null,
        },
        tx,
      );

      await this.assignmentService.assignInitialTestsToUser(
        createdUser.userId,
        tx,
      );

      return createdUser;
    });

    const verificationUrl = `${process.env.APP_FRONTEND_URL}/verify-email?token=${verificationToken}`;

    await this.emailVerificationService.sendVerificationEmailUser(
      user.email,
      user.name || "Usuario",
      verificationUrl,
    );

    return mapUserRecordToUser(user);
  }

  async createUserByAdmin(input: CreateUserInput): Promise<User> {
    const temporaryPassword = await generateSecurePassword();
    const hashedPassword = await this.HashPassword(temporaryPassword);
    console.log(`Temporary password: ${temporaryPassword}`);

    const user = await prisma.$transaction(async (tx) => {
      const createdUser = await this.userRepo.create(
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
          verifiedEmail: true,
          lastLogin: null,
        },
        tx,
      );

      return createdUser;
    });

    await this.emailVerificationService.sendVerificationEmailStaff(
      user.email,
      user.name || (user.role === "admin" ? "Administrador" : "Psicólogo"),
      temporaryPassword,
      `${process.env.APP_FRONTEND_URL}`,
    );

    return mapUserRecordToUser(user);
  }

  async updateUserRole(id: string, input: UpdateUserRoleInput): Promise<User> {
    return prisma.$transaction(async (tx) => {
      const user = await this.userRepo.findById(id, tx);
      if (!user) {
        throw NotFound("Usuario no encontrado");
      }

      if (user.role === input.role) {
        return mapUserRecordToUser(user);
      }

      if (user.role === "psychologist" && input.role !== "psychologist") {
        const assignedStudentsCount = await this.userRepo.count(
          {
            assignedPsychologistId: id,
          },
          tx,
        );

        if (assignedStudentsCount > 0) {
          throw BadRequest(
            "No puedes cambiar el rol de un psicologo que tiene estudiantes asignados.",
          );
        }
      }

      const updateData: Prisma.userUpdateInput = {
        role: input.role,
        assignedPsychologistAt:
          input.role === "user" ? user.assignedPsychologistAt : null,
      };

      if (input.role !== "user") {
        updateData.assignedPsychologist = { disconnect: true };
      }

      const updatedUser = await this.userRepo.update(id, updateData, tx);
      return mapUserRecordToUser(updatedUser);
    });
  }

  async assignPsychologistToUser(
    id: string,
    input: AssignPsychologistInput,
  ): Promise<User> {
    return prisma.$transaction(async (tx) => {
      const user = await this.userRepo.findById(id, tx);
      if (!user) {
        throw NotFound("Usuario no encontrado");
      }

      if (user.role !== "user") {
        throw BadRequest(
          "Solo se puede asignar psicologo a usuarios con rol de estudiante o usuario final.",
        );
      }

      if (input.psychologistId) {
        const psychologist = await this.userRepo.findById(
          input.psychologistId,
          tx,
        );

        if (!psychologist) {
          throw NotFound("Psicologo no encontrado");
        }

        if (psychologist.role !== "psychologist") {
          throw BadRequest(
            "El usuario seleccionado no tiene rol de psicologo.",
          );
        }
      }

      const updateData: Prisma.userUpdateInput = {
        assignedPsychologistAt: input.psychologistId ? new Date() : null,
        assignedPsychologist: input.psychologistId
          ? {
              connect: { userId: input.psychologistId },
            }
          : {
              disconnect: true,
            },
      };

      const updatedUser = await this.userRepo.update(id, updateData, tx);
      return mapUserRecordToUser(updatedUser);
    });
  }

  async deactivateUser(id: string): Promise<void> {
    await prisma.$transaction(async (tx) => {
      const user = await this.userRepo.findById(id, tx);
      if (!user) {
        throw NotFound("Usuario no encontrado");
      }

      if (!user.isActive) {
        throw BadRequest("El usuario ya está desactivado");
      }

      await this.userRepo.update(id, { isActive: false }, tx);
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
    const email =
      await this.verificationService.consumeVerificationToken(token);
    await prisma.user.update({
      where: { email: email! },
      data: {
        verifiedEmail: true,
      },
    });
  }

  async checkUnverifiedAccount(email: string): Promise<boolean> {
    const user = await this.userRepo.findByEmail(email.toLowerCase());
    return user ? !user.isActive : false;
  }
}
