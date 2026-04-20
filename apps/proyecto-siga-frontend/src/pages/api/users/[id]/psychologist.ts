import type { NextApiRequest, NextApiResponse } from "next";
import axios, { AxiosError } from "axios";
import {
  clearSessionCookie,
  getSessionIdFromCookie,
} from "@/libs/server/sessionCookie";
import type { BaseResponse } from "@packages/common-types/baseResponse.types";
import type {
  AssignPsychologistInput,
  User,
} from "@packages/common-types/user.types";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<BaseResponse<User | null>>,
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

  const { id } = req.query;
  if (typeof id !== "string" || id.trim().length === 0) {
    return res.status(400).json({
      success: false,
      data: null,
      message: "Usuario inválido",
    });
  }

  try {
    const response = await axios.patch<BaseResponse<User>>(
      `${process.env.NEXT_PUBLIC_API_URL}/users/${id}/psychologist`,
      req.body as AssignPsychologistInput,
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
      err.response?.data?.message ?? "Error al asignar el psicólogo";

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
