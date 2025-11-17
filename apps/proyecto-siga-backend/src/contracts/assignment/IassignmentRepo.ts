import { Assignment, AssignmentWithTestsDataResponse } from "@packages/common-types/assignment.types";
import { assignment, Prisma } from "@prisma/client";

export interface IAssignmentRepo {
    getAssignmentForId(assignmentId: string): Promise<Assignment | null>;
    getAssignmentsWithTestsByUserId(userId:string): Promise<AssignmentWithTestsDataResponse[] | null>;
    assignInitialTestsToUser(data:Prisma.assignmentCreateInput, tx?:Prisma.TransactionClient): Promise<assignment>;
    updateAssignmentStatus(assignmentId:string,data:Prisma.assignmentUpdateInput ): Promise<assignment>; // Implementar tx
}
