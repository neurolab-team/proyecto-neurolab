import type { NextApiRequest, NextApiResponse } from "next";
import axios, { AxiosError } from "axios";
import {
  clearSessionCookie,
  getSessionIdFromCookie,
} from "@/libs/server/sessionCookie";
import type { BaseResponse } from "@packages/common-types/baseResponse.types";
import type {
  BulkAssignPsychologistTestInput,
  BulkAssignPsychologistTestResult,
} from "@packages/common-types/assignment.types";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<BaseResponse<BulkAssignPsychologistTestResult | null>>,
) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({
      success: false,
      data: null,
      message: "Método no permitido",
    });
  }

  const sessionId = getSessionIdFromCookie(req);
  if (!sessionId) {
    clearSessionCookie(res);
    return res.status(401).json({
      success: false,
      data: null,
      message: "No autenticado",
    });
  }

  try {
    const response = await axios.post<BaseResponse<BulkAssignPsychologistTestResult>>(
      `${process.env.NEXT_PUBLIC_API_URL}/assignments/psychologist/bulk`,
      req.body as BulkAssignPsychologistTestInput,
      {
        headers: {
          "x-session-id": sessionId,
          "Content-Type": "application/json",
        },
        timeout: 10000,
      },
    );

    return res.status(response.status).json(response.data);
  } catch (error) {
    const err = error as AxiosError<BaseResponse<null>>;
    const status = err.response?.status ?? 500;
    const message =
      err.response?.data?.message ?? "Error al procesar asignación masiva";

    if (status === 401) {
      clearSessionCookie(res);
    }

    return res.status(status).json({
      success: false,
      data: null,
      message,
    });
  }
}
