import axios, { AxiosError } from "axios";
import { NextResponse } from "next/server";
import {
  clearSessionCookieApp,
  getSessionIdFromCookieApp,
} from "@/libs/server/sessionCookieApp";
import type { BaseResponse } from "@packages/common-types/baseResponse.types";
import type {
  BulkAssignPsychologistTestInput,
  BulkAssignPsychologistTestResult,
} from "@packages/common-types/assignment.types";

export async function POST(request: Request) {
  const sessionId = await getSessionIdFromCookieApp();
  if (!sessionId) {
    await clearSessionCookieApp();
    return NextResponse.json<BaseResponse<BulkAssignPsychologistTestResult | null>>(
      { success: false, data: null, message: "No autenticado" },
      { status: 401 },
    );
  }

  try {
    const body = (await request.json()) as BulkAssignPsychologistTestInput;
    const response = await axios.post<BaseResponse<BulkAssignPsychologistTestResult>>(
      `${process.env.BACKEND_API_URL}/assignments/psychologist/bulk`,
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
    const message =
      err.response?.data?.message ?? "Error al procesar asignación masiva";
    if (status === 401) await clearSessionCookieApp();

    return NextResponse.json<BaseResponse<BulkAssignPsychologistTestResult | null>>(
      { success: false, data: null, message },
      { status },
    );
  }
}
