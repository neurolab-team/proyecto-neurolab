import apiClient from "../../api/interceptors/axiosConfig";
import {AssignmentScore} from "@packages/common-types/assignmentScore.types";
import { BaseResponse } from "@packages/common-types/baseResponse.types";

export interface DetailedAnswerResponse {
  textValue?: string | null;
  question: {
    prompt: string;
    code?: string | null;
    section: { name: string | null } | null;
  } | null;
  option: { label: string } | null;
}

export const assignmentScoreService = {

  submitAssignmentScore: async (
    id: string,
  ): Promise<BaseResponse<AssignmentScore>> => {
    const response = await apiClient.post<BaseResponse<AssignmentScore>>(
      `/api/assignmentScores/create`,
      {id},
   );
    return response.data;
  },

  getResults: async (assignmentId: string): Promise<any> => {
    const response = await apiClient.get<BaseResponse<any>>(
      `/api/assignmentScores/${assignmentId}/results`,
    );
    return response.data.data;
  },

  getDetailedAnswers: async (assignmentId: string): Promise<DetailedAnswerResponse[]> => {
    const response = await apiClient.get<BaseResponse<DetailedAnswerResponse[]>>(
      `/api/answers/assignment/${assignmentId}/detailed`,
    );
    return response.data.data;
  },
};
