import prisma from "@packages/libs/prisma";
import { IAssignmentScoreRepo } from "../contracts/assignmentScore/IassignmentScoreRepo";
import { Prisma, assignmentScore } from "@packages/libs/prisma";

export class AssignmentScoreRepository implements IAssignmentScoreRepo {
  create(
    data: Prisma.assignmentScoreCreateInput,
    tx = prisma,
  ): Promise<assignmentScore> {
    return tx.assignmentScore.create({ data });
  }
  findByAssignmentId(
    assignmentId: string,
    tx = prisma,
  ): Promise<assignmentScore | null> {
    return tx.assignmentScore.findUnique({ where: { assignmentId } });
  }
}
