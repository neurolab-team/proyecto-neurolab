import { Prisma, assignmentScore } from "@packages/libs/prisma";
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
