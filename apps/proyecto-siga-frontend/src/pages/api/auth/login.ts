import type { NextApiRequest, NextApiResponse } from "next";
import axios, { AxiosError } from "axios";
import { setSessionCookie } from "../../../libs/server/sessionCookie";
import { BaseResponse } from "@packages/common-types/baseResponse.types";
import { User } from "@packages/common-types/user.types";
import { LoginCredentials } from "@packages/common-types/auth.types";
import { LoginData } from "@packages/common-types/auth.types";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<BaseResponse<User | null>>,
) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({
      success: false,
      data: null,
      message: "Método no permitido",
    });
  }

  try {
    const { email, password } = req.body as LoginCredentials;
    const authResponse = await axios.post<BaseResponse<LoginData>>(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
      { email, password },
      {
        headers: {
          "Content-Type": "application/json",
        },
        timeout: 10000,
      },
    );

    const { sessionId, user } = authResponse.data.data;

    if (!sessionId || !user) {
      return res.status(502).json({
        success: false,
        data: null,
        message: "Respuesta inválida del servicio de autenticación",
      });
    }

    setSessionCookie(res, sessionId);

    return res.status(200).json({
      success: true,
      data: user,
      message: authResponse.data.message || "Inicio de sesión exitoso",
    });
  } catch (error) {
    const err = error as AxiosError<BaseResponse<null>>;
    const status = err.response?.status ?? 500;
    const message = err.response?.data?.message ?? "Error interno del servidor";

    return res.status(status).json({
      success: false,
      data: null,
      message,
    });
  }
}
