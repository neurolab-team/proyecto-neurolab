import { inject, injectable } from "tsyringe";
import { Prisma } from "@prisma/client";
import { UpdateUserRoleInput, User } from "@packages/common-types/user.types";
import { BadRequest, NotFound } from "../../utils/httpError";
import { IUserRepo } from "../../contracts/user/IuserRepo";
import { mapUserRecordToUser } from "../../modules/users/user.mapper";
import { TransactionManager } from "../transaction/transactionManager";

@injectable()
export class UserAccountService {
  constructor(
    @inject("UserRepo") private readonly userRepo: IUserRepo,
    @inject("TransactionManager") private readonly txManager: TransactionManager,
  ) {}

  async getUsers(): Promise<User[]> {
    const users = await this.userRepo.findManyWithPsychologist();
    return users.map((user) => mapUserRecordToUser(user));
  }

  async getUserById(id: string): Promise<User | null> {
    const user = await this.userRepo.findById(id);
    return user ? mapUserRecordToUser(user) : null;
  }

  async checkEmailAvailable(email: string, excludeId?: string): Promise<boolean> {
    const existingUser = await this.userRepo.findByEmail(email.toLowerCase());
    if (!existingUser) return true;
    if (excludeId && existingUser.userId === excludeId) return true;
    return false;
  }

  async updateUserRole(id: string, input: UpdateUserRoleInput): Promise<User> {
    return this.txManager.run(async (tx) => {
      const user = await this.userRepo.findById(id, tx);
      if (!user) {
        throw NotFound("Usuario no encontrado");
      }

      if (user.role === input.role) {
        return mapUserRecordToUser(user);
      }

      if (user.role === "user" && input.role !== "user") {
        throw BadRequest(
          "No está permitido promover usuarios a roles administrativos o de psicología.",
        );
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

  async deactivateUser(id: string): Promise<void> {
    await this.txManager.run(async (tx) => {
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
    await this.txManager.run(async (tx) => {
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
}
