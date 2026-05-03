import axios, { AxiosError } from "axios";
import { NextResponse } from "next/server";
import {
  clearSessionCookieApp,
  getSessionIdFromCookieApp,
} from "@/libs/server/sessionCookieApp";
import type { BaseResponse } from "@packages/common-types/baseResponse.types";
import type { TestDataResponse } from "@packages/common-schemas/test.schemas";

type RouteContext = { params: Promise<{ assignmentId: string }> };

export async function GET(_request: Request, context: RouteContext) {
  const sessionId = await getSessionIdFromCookieApp();

  if (!sessionId) {
    await clearSessionCookieApp();
    return NextResponse.json<BaseResponse<TestDataResponse | null>>(
      { success: false, data: null, message: "No autenticado" },
      { status: 401 },
    );
  }

  const { assignmentId } = await context.params;
  if (!assignmentId || assignmentId.trim().length === 0) {
    return NextResponse.json<BaseResponse<TestDataResponse | null>>(
      { success: false, data: null, message: "assignmentId inválido" },
      { status: 400 },
    );
  }

  try {
    const response = await axios.get<BaseResponse<TestDataResponse>>(
      `${process.env.NEXT_PUBLIC_API_URL}/assignments/${assignmentId}/test`,
      {
        headers: { "x-session-id": sessionId },
        timeout: 10000,
      },
    );

    return NextResponse.json(response.data, { status: response.status });
  } catch (error) {
    const err = error as AxiosError<BaseResponse<null>>;
    const status = err.response?.status ?? 500;
    const message =
      err.response?.data?.message ?? "Error al obtener la prueba de la asignación";
    if (status === 401) await clearSessionCookieApp();

    return NextResponse.json<BaseResponse<TestDataResponse | null>>(
      { success: false, data: null, message },
      { status },
    );
  }
}
