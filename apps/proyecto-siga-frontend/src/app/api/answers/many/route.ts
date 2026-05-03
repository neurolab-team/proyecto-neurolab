import axios, { AxiosError } from "axios";
import { NextResponse } from "next/server";
import {
  clearSessionCookieApp,
  getSessionIdFromCookieApp,
} from "@/libs/server/sessionCookieApp";
import type { BaseResponse } from "@packages/common-types/baseResponse.types";
import type { Answer, CreateManyAnswersInput } from "@packages/common-types/answer.types";

export async function POST(request: Request) {
  const sessionId = await getSessionIdFromCookieApp();

  if (!sessionId) {
    await clearSessionCookieApp();
    return NextResponse.json<BaseResponse<Answer[] | null>>(
      { success: false, data: null, message: "No autenticado" },
      { status: 401 },
    );
  }

  try {
    const body = (await request.json()) as CreateManyAnswersInput;
    const response = await axios.post<BaseResponse<Answer[]>>(
      `${process.env.NEXT_PUBLIC_API_URL}/answers/many`,
      body,
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
    const message = err.response?.data?.message ?? "Error al registrar respuestas";
    if (status === 401) await clearSessionCookieApp();

    return NextResponse.json<BaseResponse<Answer[] | null>>(
      { success: false, data: null, message },
      { status },
    );
  }
}
