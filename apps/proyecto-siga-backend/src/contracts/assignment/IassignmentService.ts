import { TestDataResponse } from "@packages/common-schemas/test.schemas";
import { AssignmentWithTestsDataResponse } from "@packages/common-types/assignment.types";
import { assignment, Prisma } from "@prisma/client";

export interface IAssignmentService {
    getAssignmentById(assignmentId:string): Promise<TestDataResponse | null>;
    getAssignmentsWithTestsByUserId(userId:string): Promise<AssignmentWithTestsDataResponse[] | null>;
    assignInitialTestsToUser(userId:string, tx?:Prisma.TransactionClient): Promise<void>;
    markAssignmentAsCompleted(assignmentId:string): Promise<assignment | null>;
    markAssignmentAsReviewed(
      psychologistId: string,
      assignmentId: string,
    ): Promise<assignment | null>;
}
