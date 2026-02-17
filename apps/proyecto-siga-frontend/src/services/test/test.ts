import apiClient from "../../api/interceptors/axiosConfig";

export const testService = {
  getTestForAssignment: async (assignmentId: string): Promise<any> => {
    const response = await apiClient.get(
      `/api/assignments/${assignmentId}/test`,
    );
    return response.data.data;
  },
  submitTestAnswers: async (
    assignmentId: string,
    answers: Record<string, string>,
  ): Promise<any> => {
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
