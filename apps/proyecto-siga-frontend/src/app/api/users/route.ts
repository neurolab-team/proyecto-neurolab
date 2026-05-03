import axios, { AxiosError } from "axios";
import { NextResponse } from "next/server";
import {
  clearSessionCookieApp,
  getSessionIdFromCookieApp,
} from "@/libs/server/sessionCookieApp";
import type { BaseResponse } from "@packages/common-types/baseResponse.types";
import type {
  CreateUserInput,
  User,
  userResponse,
} from "@packages/common-types/user.types";

type UsersResponse = BaseResponse<User[] | userResponse | null>;

const unauthenticatedResponse = async () => {
  await clearSessionCookieApp();
  return NextResponse.json<UsersResponse>(
    { success: false, data: null, message: "No autenticado" },
    { status: 401 },
  );
};

export async function GET() {
  const sessionId = await getSessionIdFromCookieApp();
  if (!sessionId) return unauthenticatedResponse();

  try {
    const response = await axios.get<BaseResponse<User[]>>(
      `${process.env.NEXT_PUBLIC_API_URL}/users`,
      { headers: { "x-session-id": sessionId }, timeout: 10000 },
    );
    return NextResponse.json(response.data, { status: 200 });
  } catch (error) {
    const err = error as AxiosError<BaseResponse<null>>;
    const status = err.response?.status ?? 500;
    const message = err.response?.data?.message ?? "Error al procesar usuarios";
    if (status === 401) await clearSessionCookieApp();
    return NextResponse.json<UsersResponse>(
      { success: false, data: null, message },
      { status },
    );
  }
}

export async function POST(request: Request) {
  const sessionId = await getSessionIdFromCookieApp();
  if (!sessionId) return unauthenticatedResponse();

  try {
    const body = (await request.json()) as CreateUserInput;
    const response = await axios.post<BaseResponse<userResponse>>(
      `${process.env.NEXT_PUBLIC_API_URL}/users`,
      body,
      {
        headers: {
          "x-session-id": sessionId,
          "Content-Type": "application/json",
        },
        timeout: 10000,
      },
    );

    return NextResponse.json(response.data, { status: 201 });
  } catch (error) {
    const err = error as AxiosError<BaseResponse<null>>;
    const status = err.response?.status ?? 500;
    const message = err.response?.data?.message ?? "Error al procesar usuarios";
    if (status === 401) await clearSessionCookieApp();
    return NextResponse.json<UsersResponse>(
      { success: false, data: null, message },
      { status },
    );
  }
}
