import axios, { AxiosError } from "axios";
import { NextResponse } from "next/server";
import {
  clearSessionCookieApp,
  getSessionIdFromCookieApp,
} from "@/libs/server/sessionCookieApp";
import type { BaseResponse } from "@packages/common-types/baseResponse.types";
import type { AssignmentScore } from "@packages/common-types/assignmentScore.types";

type CreateAssignmentScorePayload = { id: string };

export async function POST(request: Request) {
  const sessionId = await getSessionIdFromCookieApp();
  if (!sessionId) {
    await clearSessionCookieApp();
    return NextResponse.json<BaseResponse<AssignmentScore | null>>(
      { success: false, data: null, message: "No autenticado" },
      { status: 401 },
    );
  }

  const { id } = (await request.json()) as CreateAssignmentScorePayload;
  if (typeof id !== "string" || id.trim().length === 0) {
    return NextResponse.json<BaseResponse<AssignmentScore | null>>(
      { success: false, data: null, message: "id inválido" },
      { status: 400 },
    );
  }

  try {
    const response = await axios.post<BaseResponse<AssignmentScore>>(
      `${process.env.BACKEND_API_URL}/assignmentScores/create`,
      { id },
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
      err.response?.data?.message ?? "Error al crear el puntaje de asignación";
    if (status === 401) await clearSessionCookieApp();

    return NextResponse.json<BaseResponse<AssignmentScore | null>>(
      { success: false, data: null, message },
      { status },
    );
  }
}
