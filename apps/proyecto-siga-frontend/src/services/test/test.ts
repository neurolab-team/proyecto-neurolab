import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const testService = {
  getTestForAssignment: async (assignmentId: string): Promise<any> => {
    const response = axios.get(
      `${API_URL}/api/assignments/${assignmentId}/test`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      }, //no es buena practica pero es temporal
    );
    return response.then((res) => res.data.data);
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
    const response = axios.post(
      `${API_URL}/api/answers/many`,
      { assignmentId: assignmentId, answers: answersArray },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      },
    );
    return response.then((res) => res.data.data);
  },
};
//TODO: Reemplazar la manera como se envian los bearer tokens
//
