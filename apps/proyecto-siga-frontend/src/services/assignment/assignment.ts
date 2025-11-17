import axios from "axios";
import { TestDataResponse } from "@packages/common-schemas/test.schemas";
const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const assignmentService = {
  getAllTests: async (accessToken: string,userId:string): Promise<any> => {
    const response = axios.get(`${API_URL}/api/assignments/by-user/${userId}/tests`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.then((res) => res.data.data);
  },
  getTestForAssignment: async (assignmentId: string): Promise<TestDataResponse[] | null> => {
    const response = await axios.get(
      `${API_URL}/api/assignments/${assignmentId}/test`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      }, //no es buena practica pero es temporal
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
