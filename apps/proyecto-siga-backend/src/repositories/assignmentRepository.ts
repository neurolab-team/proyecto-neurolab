import prisma from "@packages/libs/prisma";
import { IAssignmentRepo } from "../contracts/assignment/IassignmentRepo";
import {
  Assignment,
  AssignmentWithTestsDataResponse,
} from "@packages/common-types/assignment.types";
import { assignment, Prisma } from "@prisma/client";

export class AssignmentRepository implements IAssignmentRepo {
  
  updateAssignmentStatus(
    assignmentId: string,
    data: Prisma.assignmentUpdateInput,
  ): Promise<assignment> {
    const { status } = data;
    return prisma.assignment.update({
      where: { assignmentId: assignmentId },
      data: { status },
    });
  }

  assignInitialTestsToUser(
    data: Prisma.assignmentCreateInput,
    tx?: Prisma.TransactionClient,
  ): Promise<assignment> {
    const prismaClient = tx || prisma;
    return prismaClient.assignment.create({
      data,
    });
  }
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

  async getTestCodeByAssignmentId(assignmentId: string): Promise<string | null> {
  const result = await prisma.assignment.findUnique({
    where: { assignmentId },
    select: { test: { select: { testCode: true } } },
  });
  return result?.test?.testCode ?? null;
}

}
