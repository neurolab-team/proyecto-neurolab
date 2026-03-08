import type { NextApiRequest, NextApiResponse } from "next";
import axios, { AxiosError } from "axios";
import {
  clearSessionCookie,
  getSessionIdFromCookie,
} from "@/libs/server/sessionCookie";
import { BaseResponse } from "@packages/common-types/baseResponse.types";
import { User, userResponse, CreateUserInput } from "@packages/common-types/user.types";

type UsersResponse = BaseResponse<User[] | userResponse | null>;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<UsersResponse>,
) {
  if (req.method !== "GET" && req.method !== "POST") {
    res.setHeader("Allow", ["GET", "POST"]);
    return res.status(405).json({
      success: false,
      data: null,
      message: "Método no permitido",
    });
  }

  const sessionId = getSessionIdFromCookie(req);

  if (!sessionId) {
    clearSessionCookie(res);
    return res.status(401).json({
      success: false,
      data: null,
      message: "No autenticado",
    });
  }

  try {
    if (req.method === "GET") {
      const response = await axios.get<BaseResponse<User[]>>(
        `${process.env.NEXT_PUBLIC_API_URL}/users`,
        {
          headers: {
            "x-session-id": sessionId,
          },
          timeout: 10000,
        },
      );

      return res.status(200).json(response.data);
    }

    const response = await axios.post<BaseResponse<userResponse>>(
      `${process.env.NEXT_PUBLIC_API_URL}/users`,
      req.body as CreateUserInput,
      {
        headers: {
          "x-session-id": sessionId,
          "Content-Type": "application/json",
        },
        timeout: 10000,
      },
    );

    return res.status(201).json(response.data);
  } catch (error) {
    const err = error as AxiosError<BaseResponse<null>>;
    const status = err.response?.status ?? 500;
    const message = err.response?.data?.message ?? "Error al procesar usuarios";

    if (status === 401) {
      clearSessionCookie(res);
    }

    return res.status(status).json({
      success: false,
      data: null,
      message,
    });
  }
}
