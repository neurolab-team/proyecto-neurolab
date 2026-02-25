import { TestDataResponse } from "@packages/common-schemas/test.schemas";
import apiClient from "../../api/interceptors/axiosConfig";
import { Answer } from "@packages/common-types/answer.types";

export const testService = {
  getTestForAssignment: async (assignmentId: string): Promise<TestDataResponse[]> => {
    const response = await apiClient.get(
      `/api/assignments/${assignmentId}/test`,
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
    const response = await apiClient.post(
      `/api/answers/many`,
      { assignmentId: assignmentId, answers: answersArray },
    );
    return response.data.data;
  },
};
