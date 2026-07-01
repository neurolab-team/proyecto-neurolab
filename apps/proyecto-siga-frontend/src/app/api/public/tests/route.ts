import axios, { AxiosError } from "axios";
import { NextResponse } from "next/server";
import type { BaseResponse } from "@packages/common-types/baseResponse.types";
import type { PublicTestCard } from "@packages/common-types/test.types";

export async function GET() {
  try {
    const response = await axios.get<BaseResponse<PublicTestCard[]>>(
      `${process.env.BACKEND_API_URL}/public/tests`,
      {
        headers: { "Content-Type": "application/json" },
        timeout: 10000,
      },
    );

    return NextResponse.json(response.data, { status: response.status });
  } catch (error) {
    const err = error as AxiosError<BaseResponse<null>>;
    const status = err.response?.status ?? 500;
    const message =
      err.response?.data?.message ?? "Error al obtener las pruebas públicas";

    return NextResponse.json<BaseResponse<PublicTestCard[] | null>>(
      { success: false, data: null, message },
      { status },
    );
  }
}
