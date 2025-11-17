import { AssignmentScore } from "@packages/common-types/assignmentScore.types";

export interface IAssignmentScoreService {
  createAssignmentScore(assigmentId: string): Promise<AssignmentScore>;
  getAssignmentScoreByAssignmentId(
    assignmentId: string,
  ): Promise<AssignmentScore | null>;
}
