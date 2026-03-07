import type { NextApiRequest, NextApiResponse } from "next";
import axios, { AxiosError } from "axios";
import { BaseResponse } from "@packages/common-types/baseResponse.types";
import { RegisterResponse } from "@packages/common-types/auth.types";
import { CreateUserInput } from "@packages/common-types/user.types";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<BaseResponse<RegisterResponse | null>>,
) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({
      success: false,
      data: null,
      message: "Método no permitido",
    });
  }

  try {
    const response = await axios.post<BaseResponse<RegisterResponse>>(
      `${process.env.NEXT_PUBLIC_API_URL}/public/users/register`,
      req.body as Omit<CreateUserInput, "role">,
      {
        headers: {
          "Content-Type": "application/json",
        },
        timeout: 10000,
      },
    );

    return res.status(response.status).json(response.data);
  } catch (error) {
    const err = error as AxiosError<BaseResponse<null>>;
    const status = err.response?.status ?? 500;
    const message =
      err.response?.data?.message ?? "Error al registrar usuario";

    return res.status(status).json({
      success: false,
      data: null,
      message,
    });
  }
}
