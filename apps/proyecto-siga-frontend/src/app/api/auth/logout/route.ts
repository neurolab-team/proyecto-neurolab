import axios, { AxiosError } from "axios";
import { NextResponse } from "next/server";
import {
  clearSessionCookieApp,
  getSessionIdFromCookieApp,
} from "@/libs/server/sessionCookieApp";
import type { BaseResponse } from "@packages/common-types/baseResponse.types";

export async function POST() {
  const sessionId = await getSessionIdFromCookieApp();

  try {
    if (sessionId) {
      await axios.post(
        `${process.env.BACKEND_API_URL}/auth/logout`,
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

    await clearSessionCookieApp();

    return NextResponse.json<BaseResponse<null>>(
      {
        success: false,
        data: null,
        message,
      },
      { status },
    );
  }

  await clearSessionCookieApp();

  return NextResponse.json<BaseResponse<null>>(
    {
      success: true,
      data: null,
      message: "Logout exitoso",
    },
    { status: 200 },
  );
}
