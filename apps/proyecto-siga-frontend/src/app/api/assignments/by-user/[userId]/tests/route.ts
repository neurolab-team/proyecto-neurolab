import axios, { AxiosError } from "axios";
import { NextResponse } from "next/server";
import {
  clearSessionCookieApp,
  getSessionIdFromCookieApp,
} from "@/libs/server/sessionCookieApp";
import type { BaseResponse } from "@packages/common-types/baseResponse.types";
import type { AssignmentWithTestsDataResponse } from "@packages/common-types/assignment.types";

type RouteContext = { params: Promise<{ userId: string }> };

export async function GET(_request: Request, context: RouteContext) {
  const sessionId = await getSessionIdFromCookieApp();

  if (!sessionId) {
    await clearSessionCookieApp();
    return NextResponse.json<BaseResponse<AssignmentWithTestsDataResponse[] | null>>(
      { success: false, data: null, message: "No autenticado" },
      { status: 401 },
    );
  }

  const { userId } = await context.params;
  if (!userId || userId.trim().length === 0) {
    return NextResponse.json<BaseResponse<AssignmentWithTestsDataResponse[] | null>>(
      { success: false, data: null, message: "Usuario inválido" },
      { status: 400 },
    );
  }

  try {
    const response = await axios.get<BaseResponse<AssignmentWithTestsDataResponse[]>>(
      `${process.env.NEXT_PUBLIC_API_URL}/assignments/by-user/${userId}/tests`,
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
      err.response?.data?.message ?? "Error al obtener asignaciones del usuario";
    if (status === 401) await clearSessionCookieApp();

    return NextResponse.json<BaseResponse<AssignmentWithTestsDataResponse[] | null>>(
      { success: false, data: null, message },
      { status },
    );
  }
}
