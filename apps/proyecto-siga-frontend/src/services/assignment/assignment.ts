import apiClient from "../../api/interceptors/axiosConfig";
import { TestDataResponse } from "@packages/common-schemas/test.schemas";
import { AssignmentWithTestsDataResponse } from "@packages/common-types/assignment.types";
import { Answer } from "@packages/common-types/answer.types";
import { BaseResponse } from "@packages/common-types/baseResponse.types";

export const assignmentService = {
  getAllTests: async (
    userId: string,
  ): Promise<AssignmentWithTestsDataResponse[]> => {
    const response = await apiClient.get<
      BaseResponse<AssignmentWithTestsDataResponse[]>
    >(`/api/assignments/by-user/${userId}/tests`);
    return response.data.data;
  },
  getTestForAssignment: async (
    assignmentId: string,
  ): Promise<TestDataResponse> => {
    const response = await apiClient.get<BaseResponse<TestDataResponse>>(
      `api/assignments/${assignmentId}/test`,
    );
    return response.data.data;
  },
  submitTestAnswers: async (
    assignmentId: string,
    answers: Record<string, string>,
  ): Promise<Answer[]> => {
    const answersArray = Object.keys(answers).map((questionId) => {
      const questionOptionId = answers[questionId];
      return {
        questionId: questionId,
        questionOptionId: questionOptionId,
      };
    });
    const response = await apiClient.post<BaseResponse<Answer[]>>(
      "/api/answers/many",
      {
        assignmentId: assignmentId,
        answers: answersArray,
      },
    );
    return response.data.data;
  },
};
