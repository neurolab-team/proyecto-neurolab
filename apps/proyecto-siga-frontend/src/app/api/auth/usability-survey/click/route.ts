import axios, { AxiosError } from "axios";
import { NextResponse } from "next/server";
import {
  clearSessionCookieApp,
  getSessionIdFromCookieApp,
} from "@/libs/server/sessionCookieApp";
import type { BaseResponse } from "@packages/common-types/baseResponse.types";

export async function PATCH() {
  const sessionId = await getSessionIdFromCookieApp();

  if (!sessionId) {
    await clearSessionCookieApp();
    return NextResponse.json<BaseResponse<null>>(
      { success: false, data: null, message: "No autenticado" },
      { status: 401 },
    );
  }

  try {
    const response = await axios.patch<BaseResponse<null>>(
      `${process.env.BACKEND_API_URL}/auth/usability-survey/click`,
      {},
      {
        headers: {
          "x-session-id": sessionId,
          "Content-Type": "application/json",
        },
        timeout: 10000,
      },
    );

    return NextResponse.json(response.data, { status: response.status });
  } catch (error) {
    const err = error as AxiosError<BaseResponse<null>>;
    const status = err.response?.status ?? 500;
    const message =
      err.response?.data?.message ?? "Error al registrar la encuesta como vista";
    if (status === 401) await clearSessionCookieApp();

    return NextResponse.json<BaseResponse<null>>(
      { success: false, data: null, message },
      { status },
    );
  }
}
