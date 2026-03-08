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
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({
      success: false,
      data: null,
      message: "Método no permitido",
    });
  }

  const sessionId = getSessionIdFromCookie(req);

  try {
    if (sessionId) {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/logout`,
        {},
        {
          headers: {
            "x-session-id": sessionId,
            "Content-Type": "application/json",
          },
          timeout: 10000,
        },
      );
    }
  } catch (error) {
    const err = error as AxiosError<BaseResponse<null>>;
    const status = err.response?.status ?? 500;
    const message = err.response?.data?.message ?? "Error cerrando sesión";

    clearSessionCookie(res);

    return res.status(status).json({
      success: false,
      data: null,
      message,
    });
  }

  clearSessionCookie(res);

  return res.status(200).json({
    success: true,
    data: null,
    message: "Logout exitoso",
  });
}
