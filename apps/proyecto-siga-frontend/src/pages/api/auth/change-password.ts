import type { NextApiRequest, NextApiResponse } from "next";
import axios, { AxiosError } from "axios";
import {
  clearSessionCookie,
  getSessionIdFromCookie,
} from "@/libs/server/sessionCookie";
import { BaseResponse } from "@packages/common-types/baseResponse.types";

type ChangePasswordPayload = {
  currentPassword: string;
  newPassword: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<BaseResponse<null>>,
) {
  if (req.method !== "PUT") {
    res.setHeader("Allow", ["PUT"]);
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
    const payload = req.body as ChangePasswordPayload;
    const response = await axios.put<BaseResponse<null>>(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/change-password`,
      payload,
      {
        headers: {
          "x-session-id": sessionId,
          "Content-Type": "application/json",
        },
        timeout: 10000,
      },
    );

    clearSessionCookie(res);

    return res.status(200).json({
      success: true,
      data: null,
      message: response.data.message || "Contraseña cambiada exitosamente",
    });
  } catch (error) {
    const err = error as AxiosError<BaseResponse<null>>;
    const status = err.response?.status ?? 500;
    const message =
      err.response?.data?.message ?? "Error al cambiar la contraseña";

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
