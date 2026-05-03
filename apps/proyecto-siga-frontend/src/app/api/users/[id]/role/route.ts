import axios, { AxiosError } from "axios";
import { NextResponse } from "next/server";
import {
  clearSessionCookieApp,
  getSessionIdFromCookieApp,
} from "@/libs/server/sessionCookieApp";
import type { BaseResponse } from "@packages/common-types/baseResponse.types";
import type { UpdateUserRoleInput, User } from "@packages/common-types/user.types";

type RouteContext = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, context: RouteContext) {
  const sessionId = await getSessionIdFromCookieApp();
  if (!sessionId) {
    await clearSessionCookieApp();
    return NextResponse.json<BaseResponse<User | null>>(
      { success: false, data: null, message: "No autenticado" },
      { status: 401 },
    );
  }

  const { id } = await context.params;
  if (!id || id.trim().length === 0) {
    return NextResponse.json<BaseResponse<User | null>>(
      { success: false, data: null, message: "Usuario inválido" },
      { status: 400 },
    );
  }

  try {
    const body = (await request.json()) as UpdateUserRoleInput;
    const response = await axios.patch<BaseResponse<User>>(
      `${process.env.NEXT_PUBLIC_API_URL}/users/${id}/role`,
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
    const message = err.response?.data?.message ?? "Error al actualizar el rol";
    if (status === 401) await clearSessionCookieApp();

    return NextResponse.json<BaseResponse<User | null>>(
      { success: false, data: null, message },
      { status },
    );
  }
}
