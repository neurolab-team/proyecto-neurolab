import { inject, injectable } from "tsyringe";
import { Prisma } from "@prisma/client";
import { AssignPsychologistInput, User } from "@packages/common-types/user.types";
import { BadRequest, NotFound } from "../../utils/httpError";
import { IUserRepo } from "../../contracts/user/IuserRepo";
import { mapUserRecordToUser } from "../../modules/users/user.mapper";
import { TransactionManager } from "../transaction/transactionManager";

@injectable()
export class PsychologistAssignmentService {
  constructor(
    @inject("UserRepo") private readonly userRepo: IUserRepo,
    @inject("TransactionManager") private readonly txManager: TransactionManager,
  ) {}

  async assignPsychologistToUser(
    targetUserId: string,
    input: AssignPsychologistInput,
  ): Promise<User> {
    return this.txManager.run(async (tx) => {
      const user = await this.userRepo.findById(targetUserId, tx);
      if (!user) {
        throw NotFound("Usuario no encontrado");
      }

      if (user.role !== "user") {
        throw BadRequest(
          "Solo se puede asignar psicologo a usuarios con rol de estudiante o usuario final.",
        );
      }

      if (input.psychologistId) {
        const psychologist = await this.userRepo.findById(input.psychologistId, tx);

        if (!psychologist) {
          throw NotFound("Psicologo no encontrado");
        }

        if (psychologist.role !== "psychologist") {
          throw BadRequest("El usuario seleccionado no tiene rol de psicologo.");
        }

        if (!psychologist.isActive) {
          throw BadRequest("El psicologo seleccionado no está activo.");
        }
      }

      if (input.psychologistId === user.assignedPsychologistId) {
        return mapUserRecordToUser(user);
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

      const updatedUser = await this.userRepo.update(targetUserId, updateData, tx);
      return mapUserRecordToUser(updatedUser);
    });
  }
}
