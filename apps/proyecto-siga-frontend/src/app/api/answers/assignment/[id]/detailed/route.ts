import axios, { AxiosError } from "axios";
import { NextResponse } from "next/server";
import {
  clearSessionCookieApp,
  getSessionIdFromCookieApp,
} from "@/libs/server/sessionCookieApp";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: Request, context: RouteContext) {
  const sessionId = await getSessionIdFromCookieApp();
  if (!sessionId) {
    await clearSessionCookieApp();
    return NextResponse.json(
      { success: false, data: null, message: "No autenticado" },
      { status: 401 },
    );
  }

  const { id } = await context.params;

  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/answers/assignment/${id}/detailed`,
      {
        headers: { "x-session-id": sessionId },
        timeout: 10000,
      },
    );

    return NextResponse.json(response.data, { status: response.status });
  } catch (error) {
    const err = error as AxiosError<{ message?: string }>;
    const status = err.response?.status ?? 500;
    if (status === 401) await clearSessionCookieApp();

    return NextResponse.json(
      {
        success: false,
        data: null,
        message: err.response?.data?.message ?? "Error al obtener respuestas",
      },
      { status },
    );
  }
}
