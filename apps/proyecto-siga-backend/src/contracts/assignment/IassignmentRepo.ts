import { Assignment, AssignmentWithTestsDataResponse } from "@packages/common-types/assignment.types";

export interface IAssignmentRepo {
    getAssignmentForId(assignmentId: string): Promise<Assignment | null>;
    getAssignmentsWithTestsByUserId(userId:string): Promise<AssignmentWithTestsDataResponse[] | null>;
}
