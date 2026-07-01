import axios, { AxiosError } from "axios";
import { NextResponse } from "next/server";
import {
  clearSessionCookieApp,
  getSessionIdFromCookieApp,
} from "@/libs/server/sessionCookieApp";
import type { BaseResponse } from "@packages/common-types/baseResponse.types";
import type { User } from "@packages/common-types/user.types";

export async function GET() {
  try {
    const sessionId = await getSessionIdFromCookieApp();

    if (!sessionId) {
      return NextResponse.json<BaseResponse<User | null>>(
        {
          success: false,
          data: null,
          message: "No autenticado",
        },
        { status: 401 },
      );
    }

    const authResponse = await axios.get<BaseResponse<User>>(
      `${process.env.BACKEND_API_URL}/auth/me`,
      {
        headers: {
          "x-session-id": sessionId,
        },
        timeout: 10000,
      },
    );

    return NextResponse.json<BaseResponse<User | null>>(
      {
        success: true,
        data: authResponse.data.data,
        message: authResponse.data.message || "Usuario autenticado",
      },
      { status: 200 },
    );
  } catch (error) {
    const err = error as AxiosError<BaseResponse<null>>;
    const status = err.response?.status ?? 500;
    const message = err.response?.data?.message ?? "Error al consultar sesión";

    if (status === 401) {
      await clearSessionCookieApp();
    }

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
