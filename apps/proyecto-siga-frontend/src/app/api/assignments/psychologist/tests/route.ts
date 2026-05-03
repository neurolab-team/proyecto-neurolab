import axios, { AxiosError } from "axios";
import { NextResponse } from "next/server";
import {
  clearSessionCookieApp,
  getSessionIdFromCookieApp,
} from "@/libs/server/sessionCookieApp";
import type { BaseResponse } from "@packages/common-types/baseResponse.types";
import type { PsychologistAssignableTest } from "@packages/common-types/assignment.types";

export async function GET() {
  const sessionId = await getSessionIdFromCookieApp();
  if (!sessionId) {
    await clearSessionCookieApp();
    return NextResponse.json<BaseResponse<PsychologistAssignableTest[] | null>>(
      { success: false, data: null, message: "No autenticado" },
      { status: 401 },
    );
  }

  try {
    const response = await axios.get<BaseResponse<PsychologistAssignableTest[]>>(
      `${process.env.NEXT_PUBLIC_API_URL}/assignments/psychologist/tests`,
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
      err.response?.data?.message ?? "Error al obtener pruebas asignables";
    if (status === 401) await clearSessionCookieApp();

    return NextResponse.json<BaseResponse<PsychologistAssignableTest[] | null>>(
      { success: false, data: null, message },
      { status },
    );
  }
}
