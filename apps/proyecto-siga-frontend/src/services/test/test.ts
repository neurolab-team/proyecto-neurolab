import { TestDataResponse } from "@packages/common-schemas/test.schemas";
import apiClient from "../../api/interceptors/axiosConfig";
import { Answer } from "@packages/common-types/answer.types";
import { BaseResponse } from "@packages/common-types/baseResponse.types";
import { Question, isTextBasedAnswer } from "@packages/common-types/question.types";

export const testService = {
  getTestForAssignment: async (
    assignmentId: string,
  ): Promise<TestDataResponse> => {
    const response = await apiClient.get<BaseResponse<TestDataResponse>>(
      `/api/assignments/${assignmentId}/test`,
    );
    return response.data.data;
  },
  submitTestAnswers: async (
    assignmentId: string,
    answers: Record<string, string>,
    questions: Question[],
  ): Promise<Answer[]> => {
    const questionMap = new Map(questions.map((q) => [q.questionId, q]));
    const answersArray = Object.keys(answers).map((questionId) => {
      const q = questionMap.get(questionId);
      const isTextAnswer = isTextBasedAnswer(q?.questionType);
      return {
        questionId,
        ...(isTextAnswer
          ? { textValue: answers[questionId] }
          : { questionOptionId: answers[questionId] }),
      };
    });
    const response = await apiClient.post<BaseResponse<Answer[]>>(
      `/api/answers/many`,
      {
        assignmentId: assignmentId,
        answers: answersArray,
      },
    );
    return response.data.data;
  },
};
