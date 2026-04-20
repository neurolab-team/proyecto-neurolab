import type { NextApiRequest, NextApiResponse } from "next";
import axios, { AxiosError } from "axios";
import {
  clearSessionCookie,
  getSessionIdFromCookie,
} from "@/libs/server/sessionCookie";
import type { BaseResponse } from "@packages/common-types/baseResponse.types";
import type { AssignmentWithTestsDataResponse } from "@packages/common-types/assignment.types";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<BaseResponse<AssignmentWithTestsDataResponse[] | null>>,
) {
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
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

  const { userId } = req.query;

  if (typeof userId !== "string" || userId.trim().length === 0) {
    return res.status(400).json({
      success: false,
      data: null,
      message: "Usuario inválido",
    });
  }

  try {
    const response = await axios.get<BaseResponse<AssignmentWithTestsDataResponse[]>>(
      `${process.env.NEXT_PUBLIC_API_URL}/assignments/by-user/${userId}/tests`,
      {
        headers: {
          "x-session-id": sessionId,
        },
        timeout: 10000,
      },
    );

    return res.status(response.status).json(response.data);
  } catch (error) {
    const err = error as AxiosError<BaseResponse<null>>;
    const status = err.response?.status ?? 500;
    const message =
      err.response?.data?.message ?? "Error al obtener asignaciones del usuario";

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
