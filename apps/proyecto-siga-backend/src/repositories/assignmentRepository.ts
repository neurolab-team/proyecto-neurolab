import prisma from "@packages/libs/prisma";
import { IAssignmentRepo } from "../contracts/assignment/IassignmentRepo";
import { Assignment } from "@packages/common-types/assignment.types";

export class AssignmentRepository implements IAssignmentRepo {
  getAssignmentForId(assignmentId: string): Promise<Assignment | null> {
    return prisma.assignment.findFirst({
      select: {
        assignmentId: true,
        testId: true,
        status: true,
      },
      where: {
        assignmentId: assignmentId,
      },
    });
  }
}
