import type { NextApiRequest, NextApiResponse } from "next";
import axios, { AxiosError } from "axios";
import {
  clearSessionCookie,
  getSessionIdFromCookie,
} from "@/libs/server/sessionCookie";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).json({ success: false, data: null, message: "Método no permitido" });
  }

  const sessionId = getSessionIdFromCookie(req);
  if (!sessionId) {
    clearSessionCookie(res);
    return res.status(401).json({ success: false, data: null, message: "No autenticado" });
  }

  const { id } = req.query;

  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/assignmentScores/${id}/results`,
      {
        headers: { "x-session-id": sessionId },
        timeout: 10000,
      },
    );
    return res.status(response.status).json(response.data);
  } catch (error) {
    const err = error as AxiosError<{ message?: string }>;
    const status = err.response?.status ?? 500;
    if (status === 401) clearSessionCookie(res);
    return res.status(status).json({
      success: false,
      data: null,
      message: err.response?.data?.message ?? "Error al obtener resultados",
    });
  }
}
