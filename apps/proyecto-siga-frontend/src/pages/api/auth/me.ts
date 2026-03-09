import type { NextApiRequest, NextApiResponse } from "next";
import axios, { AxiosError } from "axios";
import {
  clearSessionCookie,
  getSessionIdFromCookie,
} from "@/libs/server/sessionCookie";
import { BaseResponse } from "@packages/common-types/baseResponse.types";
import { User } from "@packages/common-types/user.types";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<BaseResponse<User | null>>,
) {
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).json({
      success: false,
      data: null,
      message: "Método no permitido",
    });
  }
  try {
    const sessionId = getSessionIdFromCookie(req);
    if (!sessionId) {
      return res.status(401).json({
        success: false,
        data: null,
        message: "No autenticado",
      });
    }
    const authResponse = await axios.get<BaseResponse<User>>(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/me`,
      {
        headers: {
          "x-session-id": sessionId,
        },
        timeout: 10000,
      },
    );
    return res.status(200).json({
      success: true,
      data: authResponse.data.data,
      message: authResponse.data.message || "Usuario autenticado",
    });
    
  } catch (error) {
    const err = error as AxiosError<BaseResponse<null>>;
    const status = err.response?.status ?? 500;
    const message = err.response?.data?.message ?? "Error al consultar sesión";
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
