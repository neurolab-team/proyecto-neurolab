import axios, { AxiosError } from "axios";
import { NextResponse } from "next/server";
import type { BaseResponse } from "@packages/common-types/baseResponse.types";
import { buildForwardedForHeaders } from "@/libs/server/clientIp";

const METHOD_NOT_ALLOWED = "Método no permitido";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const response = await axios.post<BaseResponse<null>>(
      `${process.env.BACKEND_API_URL}/auth/forgot-password`,
      body,
      {
        headers: {
          "Content-Type": "application/json",
          ...buildForwardedForHeaders(request),
        },
        timeout: 10000,
      },
    );

    return NextResponse.json(response.data, { status: response.status });
  } catch (error) {
    const err = error as AxiosError<BaseResponse<null>>;
    const status = err.response?.status ?? 500;
    const message =
      err.response?.data?.message ??
      "No fue posible solicitar el restablecimiento de contraseña";

    return NextResponse.json<BaseResponse<null>>(
      { success: false, data: null, message },
      { status },
    );
  }
}

export async function GET() {
  return NextResponse.json<BaseResponse<null>>(
    { success: false, data: null, message: METHOD_NOT_ALLOWED },
    { status: 405, headers: { Allow: "POST" } },
  );
}
