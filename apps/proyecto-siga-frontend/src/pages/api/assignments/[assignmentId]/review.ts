import type { NextApiRequest, NextApiResponse } from "next";
import axios, { AxiosError } from "axios";
import {
  clearSessionCookie,
  getSessionIdFromCookie,
} from "@/libs/server/sessionCookie";
import { BaseResponse } from "@packages/common-types/baseResponse.types";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<BaseResponse<null>>,
) {
  if (req.method !== "PATCH") {
    res.setHeader("Allow", ["PATCH"]);
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

  const { assignmentId } = req.query;
  if (
    typeof assignmentId !== "string" ||
    assignmentId.trim().length === 0
  ) {
    return res.status(400).json({
      success: false,
      data: null,
      message: "assignmentId inválido",
    });
  }

  try {
    const response = await axios.patch<BaseResponse<null>>(
      `${process.env.NEXT_PUBLIC_API_URL}/assignments/${assignmentId}/review`,
      {},
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
      err.response?.data?.message ?? "Error al marcar la asignación como revisada";

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
