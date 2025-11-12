import { TestDataResponse } from "@packages/common-schemas/test.schemas";

export interface IAssignmentService {
    getAssignmentById(assignmentId:string): Promise<TestDataResponse | null>;
}