import apiClient from "../../api/interceptors/axiosConfig";
import {AssignmentScore} from "@packages/common-types/assignmentScore.types";
import { BaseResponse } from "packages/common-types/baseResponse.types";

export const assignmentScoreService = {

  submitAssignmentScore: async (
    assignmentId: string,
  ): Promise<BaseResponse<AssignmentScore>> => {
    const response = await apiClient.post<BaseResponse<AssignmentScore>>(
      `/api/assignmentScores/create/${assignmentId}`,
      {},
   );
    return response.data;
  },
};
