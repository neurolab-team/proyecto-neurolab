import { TestDataResponse } from "@packages/common-schemas/test.schemas";
import { AssignmentWithTestsDataResponse } from "@packages/common-types/assignment.types";

export interface IAssignmentService {
    getAssignmentById(assignmentId:string): Promise<TestDataResponse | null>;
    getAssignmentsWithTestsByUserId(userId:string): Promise<AssignmentWithTestsDataResponse[] | null>;
}