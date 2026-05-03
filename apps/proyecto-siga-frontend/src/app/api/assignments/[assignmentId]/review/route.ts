import axios, { AxiosError } from "axios";
import { NextResponse } from "next/server";
import {
  clearSessionCookieApp,
  getSessionIdFromCookieApp,
} from "@/libs/server/sessionCookieApp";
import type { BaseResponse } from "@packages/common-types/baseResponse.types";

type RouteContext = { params: Promise<{ assignmentId: string }> };

export async function PATCH(_request: Request, context: RouteContext) {
  const sessionId = await getSessionIdFromCookieApp();
  if (!sessionId) {
    await clearSessionCookieApp();
    return NextResponse.json<BaseResponse<null>>(
      { success: false, data: null, message: "No autenticado" },
      { status: 401 },
    );
  }

  const { assignmentId } = await context.params;
  if (!assignmentId || assignmentId.trim().length === 0) {
    return NextResponse.json<BaseResponse<null>>(
      { success: false, data: null, message: "assignmentId inválido" },
      { status: 400 },
    );
  }

  try {
    const response = await axios.patch<BaseResponse<null>>(
      `${process.env.NEXT_PUBLIC_API_URL}/assignments/${assignmentId}/review`,
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
      err.response?.data?.message ?? "Error al marcar la asignación como revisada";
    if (status === 401) await clearSessionCookieApp();

    return NextResponse.json<BaseResponse<null>>(
      { success: false, data: null, message },
      { status },
    );
  }
}
