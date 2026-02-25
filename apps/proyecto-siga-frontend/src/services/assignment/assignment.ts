import apiClient from "../../api/interceptors/axiosConfig";
import { TestDataResponse } from "@packages/common-schemas/test.schemas";
import { AssignmentWithTestsDataResponse } from "@packages/common-types/assignment.types";
import { Answer } from "@packages/common-types/answer.types";
export const assignmentService = {
  getAllTests: async (
    userId: string,
  ): Promise<AssignmentWithTestsDataResponse[]> => {
    const response = apiClient.get(`/api/assignments/by-user/${userId}/tests`);
    return response.then((res) => res.data.data);
  },
  getTestForAssignment: async (
    assignmentId: string,
  ): Promise<TestDataResponse[]> => {
    const response = await apiClient.get(
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
    const response = apiClient.post("/api/answers/many", {
      assignmentId: assignmentId,
      answers: answersArray,
    });
    return response.then((res) => res.data.data);
  },
};
