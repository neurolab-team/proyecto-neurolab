import prisma from "@packages/libs/prisma";
import { IAssignmentRepo } from "../contracts/assignment/IassignmentRepo";
import {
  Assignment,
  AssignmentWithTestsDataResponse,
} from "@packages/common-types/assignment.types";

export class AssignmentRepository implements IAssignmentRepo {
  async getAssignmentsWithTestsByUserId(
    userId: string,
  ): Promise<AssignmentWithTestsDataResponse[] | null> {
    const assignment = await prisma.assignment.findMany({
      where: {
        assignedToId: userId,
      },
      select: {
        test: {
          select: {
            testId: true,
            title: true,
          },
        },
        dueAt: true,
        startedAt: true,
        assignmentId: true,
        status: true,
      },
    });
    
    const formattedAssignments = assignment.map((asgmnt) => {
      const assignmentResponse: AssignmentWithTestsDataResponse = {
        assignmentId: asgmnt.assignmentId,
        dueAt: asgmnt.dueAt || null,
        startedAt: asgmnt.startedAt || null,
        status: asgmnt.status,
        test: {
          testId: asgmnt.test.testId,
          title: asgmnt.test.title,
        },
      };
      return assignmentResponse;
    });

    return formattedAssignments;
  }
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
