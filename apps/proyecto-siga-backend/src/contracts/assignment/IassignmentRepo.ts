import { Assignment } from "@packages/common-types/assignment.types";

export interface IAssignmentRepo {
    getAssignmentForId(assignmentId: string): Promise<Assignment | null>;
}
