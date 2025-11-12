import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const testService = {
  getTestForAssignment: async (assignmentId: string): Promise<any> => {
    const response = axios.get(
      `${API_URL}/api/assignments/${assignmentId}/test`,
      {headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` }},//no es buena practica pero es temporal
    );
    return response.then((res) => res.data.data);
  },
  submitTestAnswers: async (
    assignmentId: string,
    answers: Record<string, string>,
  ): Promise<any> => {
    console.log(
      `[Servicio] Enviando ${Object.keys(answers).length} respuestas para: ${assignmentId}`,
    );
    // Simulamos una demora de red
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return { success: true, message: "Test completado" };
  },
};
//TODO: Reemplazar la manera como se envian los bearer tokens
// 