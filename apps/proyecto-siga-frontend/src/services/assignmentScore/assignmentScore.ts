import apiClient from "../../api/interceptors/axiosConfig";

export const assignmentScoreService = {

  submitAssignmentScore: async (
    assignmentId: string,
  ): Promise<any> => {
    const response = await apiClient.post(
      `/api/assignmentScores/create/${assignmentId}`,
      {},
   );
    return response.data.data;
  },
};
