import { Prisma, assignmentScore } from "@prisma/client";
export interface IAssignmentScoreRepo {
  create(
    data: Prisma.assignmentScoreCreateInput,
    tx?: Prisma.TransactionClient,
  ): Promise<assignmentScore>;
  findByAssignmentId(
    assignmentId: string,
    tx?: Prisma.TransactionClient,
  ): Promise<assignmentScore | null>;
}
