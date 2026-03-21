import type { NextApiRequest, NextApiResponse } from "next";
import axios, { AxiosError } from "axios";
import {
  clearSessionCookie,
  getSessionIdFromCookie,
} from "@/libs/server/sessionCookie";
import { BaseResponse } from "@packages/common-types/baseResponse.types";
import { PsychologistDashboardStats } from "@packages/common-types/psychologist.types";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<BaseResponse<PsychologistDashboardStats | null>>,
) {
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res
      .status(405)
      .json({ success: false, data: null, message: "Metodo no permitido" });
  }

  const sessionId = getSessionIdFromCookie(req);
  if (!sessionId) {
    clearSessionCookie(res);
    return res
      .status(401)
      .json({ success: false, data: null, message: "No autenticado" });
  }

  try {
    const response = await axios.get<BaseResponse<PsychologistDashboardStats>>(
      `${process.env.NEXT_PUBLIC_API_URL}/assignments/psychologist/dashboard/stats`,
      { headers: { "x-session-id": sessionId }, timeout: 10000 },
    );
    return res.status(response.status).json(response.data);
  } catch (error) {
    const err = error as AxiosError<BaseResponse<null>>;
    const status = err.response?.status ?? 500;
    const message =
      err.response?.data?.message ?? "Error al obtener estadisticas";
    if (status === 401) clearSessionCookie(res);
    return res.status(status).json({ success: false, data: null, message });
  }
}
