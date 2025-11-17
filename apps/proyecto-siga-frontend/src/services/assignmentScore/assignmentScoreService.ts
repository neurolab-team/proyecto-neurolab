import axios from "axios";
const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const assignmentScoreService = {

  submitAssignmentScore: async (
    assignmentId: string,
  ): Promise<any> => {
    const response = await axios.post(
      `${API_URL}/api/assignmentScores/create/${assignmentId}`,
      {},
      {
        
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      },
    );
    return response.data.data;
  },
};
//TODO: Reemplazar la manera como se envian los bearer tokens
//
