import { Prisma, answer } from "@packages/libs/prisma";
import { AnswerWithDetails, DetailedAnswer } from "./answer.types";

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

  findDetailedByAssignment(
    assignmentId: string,
    tx?: Prisma.TransactionClient,
  ): Promise<DetailedAnswer[]>;
}
