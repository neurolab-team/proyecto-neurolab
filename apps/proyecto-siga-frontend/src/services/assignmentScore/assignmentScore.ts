import apiClient from "../../api/interceptors/axiosConfig";
import {AssignmentScore} from "@packages/common-types/assignmentScore.types";

export const assignmentScoreService = {

  submitAssignmentScore: async (
    assignmentId: string,
  ): Promise<AssignmentScore> => {
    const response = await apiClient.post(
      `/api/assignmentScores/create/${assignmentId}`,
      {},
   );
    return response.data.data;
  },
};
