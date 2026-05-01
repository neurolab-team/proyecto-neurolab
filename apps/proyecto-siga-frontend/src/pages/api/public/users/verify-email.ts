import type { NextApiRequest, NextApiResponse } from "next";
import axios, { AxiosError } from "axios";
import type { BaseResponse } from "@packages/common-types/baseResponse.types";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<BaseResponse<null>>,
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
    const response = await axios.post<BaseResponse<null>>(
      `${process.env.NEXT_PUBLIC_API_URL}/public/users/verify-email`,
      req.body,
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
      err.response?.data?.message ?? "No fue posible verificar el correo";

    return res.status(status).json({
      success: false,
      data: null,
      message,
    });
  }
}
