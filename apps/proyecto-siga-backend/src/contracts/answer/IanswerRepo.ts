import { Prisma, answer } from "@prisma/client";
import { AnswerWithDetails } from "./answer.types";

export interface IAnswerRepo {
  findById(id: string, tx?: Prisma.TransactionClient): Promise<answer | null>;
  findMany(tx?: Prisma.TransactionClient): Promise<answer[]>;
  findByAssignmentTest(
    assignmentId: string,
    tx?: Prisma.TransactionClient,
  ): Promise<answer[]>;
  create(
    data: Prisma.answerCreateInput,
    tx?: Prisma.TransactionClient,
  ): Promise<answer>;
  createMany(
    data: Prisma.answerCreateManyInput[],
    tx?: Prisma.TransactionClient,
  ): Promise<answer[]>;

  findByAssignmentTestWithDetails(
    assigmentId: string,
    tx?: Prisma.TransactionClient,
  ): Promise<AnswerWithDetails[]>;

  // delete(id: string, tx?: Prisma.TransactionClient): Promise<void>;
  // count(
  //     where:Prisma.answerWhereInput,
  //     tx?: Prisma.TransactionClient
  // ): Promise<number>;
}
