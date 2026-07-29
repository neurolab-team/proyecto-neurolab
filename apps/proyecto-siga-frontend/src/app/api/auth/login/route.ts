import axios, { AxiosError } from "axios";
import { NextResponse } from "next/server";
import { setSessionCookieApp } from "@/libs/server/sessionCookieApp";
import { buildForwardedForHeaders } from "@/libs/server/clientIp";
import type { BaseResponse } from "@packages/common-types/baseResponse.types";
import type { User } from "@packages/common-types/user.types";
import type {
  LoginCredentials,
  LoginData,
} from "@packages/common-types/auth.types";

export async function POST(request: Request) {
  try {
    const { email, password } = (await request.json()) as LoginCredentials;
    const authResponse = await axios.post<BaseResponse<LoginData>>(
      `${process.env.BACKEND_API_URL}/auth/login`,
      { email, password },
      {
        headers: {
          "Content-Type": "application/json",
          ...buildForwardedForHeaders(request),
        },
        timeout: 10000,
      },
    );

    const { sessionId, user } = authResponse.data.data;

    if (!sessionId || !user) {
      return NextResponse.json<BaseResponse<User | null>>(
        {
          success: false,
          data: null,
          message: "Respuesta inválida del servicio de autenticación",
        },
        { status: 502 },
      );
    }

    await setSessionCookieApp(sessionId);

    return NextResponse.json<BaseResponse<User | null>>(
      {
        success: true,
        data: user,
        message: authResponse.data.message || "Inicio de sesión exitoso",
      },
      { status: 200 },
    );
  } catch (error) {
    const err = error as AxiosError<BaseResponse<null>>;
    const status = err.response?.status ?? 500;
    const message = err.response?.data?.message ?? "Error interno del servidor";

    return NextResponse.json<BaseResponse<null>>(
      {
        success: false,
        data: null,
        message,
      },
      { status },
    );
  }
}
