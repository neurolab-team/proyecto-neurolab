import axios, { AxiosError } from "axios";
import { NextResponse } from "next/server";
import {
  clearSessionCookieApp,
  getSessionIdFromCookieApp,
} from "@/libs/server/sessionCookieApp";
import type { BaseResponse } from "@packages/common-types/baseResponse.types";
import type { PsychologistStudentResultsResponse } from "@packages/common-types/psychologist.types";

export async function GET(request: Request) {
  const sessionId = await getSessionIdFromCookieApp();
  if (!sessionId) {
    await clearSessionCookieApp();
    return NextResponse.json<BaseResponse<PsychologistStudentResultsResponse | null>>(
      { success: false, data: null, message: "No autenticado" },
      { status: 401 },
    );
  }

  try {
    const query = new URL(request.url).searchParams.toString();
    const response = await axios.get<BaseResponse<PsychologistStudentResultsResponse>>(
      `${process.env.BACKEND_API_URL}/users/psychologist/students/results?${query}`,
      {
        headers: { "x-session-id": sessionId },
        timeout: 15000,
      },
    );

    return NextResponse.json(response.data, { status: response.status });
  } catch (error) {
    const err = error as AxiosError<BaseResponse<null>>;
    const status = err.response?.status ?? 500;
    const message =
      err.response?.data?.message ?? "Error al obtener resultados exportables";
    if (status === 401) await clearSessionCookieApp();

    return NextResponse.json<BaseResponse<PsychologistStudentResultsResponse | null>>(
      { success: false, data: null, message },
      { status },
    );
  }
}
