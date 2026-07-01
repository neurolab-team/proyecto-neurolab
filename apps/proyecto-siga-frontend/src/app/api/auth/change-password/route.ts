import axios, { AxiosError } from "axios";
import { NextResponse } from "next/server";
import {
  clearSessionCookieApp,
  getSessionIdFromCookieApp,
} from "@/libs/server/sessionCookieApp";
import type { BaseResponse } from "@packages/common-types/baseResponse.types";

type ChangePasswordPayload = {
  currentPassword: string;
  newPassword: string;
};

export async function PUT(request: Request) {
  const sessionId = await getSessionIdFromCookieApp();

  if (!sessionId) {
    await clearSessionCookieApp();

    return NextResponse.json<BaseResponse<null>>(
      {
        success: false,
        data: null,
        message: "No autenticado",
      },
      { status: 401 },
    );
  }

  try {
    const payload = (await request.json()) as ChangePasswordPayload;
    const response = await axios.put<BaseResponse<null>>(
      `${process.env.BACKEND_API_URL}/auth/change-password`,
      payload,
      {
        headers: {
          "x-session-id": sessionId,
          "Content-Type": "application/json",
        },
        timeout: 10000,
      },
    );

    await clearSessionCookieApp();

    return NextResponse.json<BaseResponse<null>>(
      {
        success: true,
        data: null,
        message: response.data.message || "Contraseña cambiada exitosamente",
      },
      { status: 200 },
    );
  } catch (error) {
    const err = error as AxiosError<BaseResponse<null>>;
    const status = err.response?.status ?? 500;
    const message =
      err.response?.data?.message ?? "Error al cambiar la contraseña";

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
