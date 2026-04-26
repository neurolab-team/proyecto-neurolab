import type { NextApiRequest, NextApiResponse } from "next";
import axios, { AxiosError } from "axios";
import {
  clearSessionCookie,
  getSessionIdFromCookie,
} from "@/libs/server/sessionCookie";
import type { BaseResponse } from "@packages/common-types/baseResponse.types";
import type { PsychologistStudentResultsResponse } from "@packages/common-types/psychologist.types";

function normalizeQuery(query: NextApiRequest["query"]) {
  const params = new URLSearchParams();

  Object.entries(query).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach((entry) => {
        if (entry !== undefined) {
          params.append(key, entry);
        }
      });
      return;
    }

    if (value !== undefined) {
      params.append(key, value);
    }
  });

  return params;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<BaseResponse<PsychologistStudentResultsResponse | null>>,
) {
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
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
    const query = normalizeQuery(req.query).toString();
    const response = await axios.get<BaseResponse<PsychologistStudentResultsResponse>>(
      `${process.env.NEXT_PUBLIC_API_URL}/users/psychologist/students/results?${query}`,
      {
        headers: {
          "x-session-id": sessionId,
        },
        timeout: 15000,
      },
    );

    return res.status(response.status).json(response.data);
  } catch (error) {
    const err = error as AxiosError<BaseResponse<null>>;
    const status = err.response?.status ?? 500;
    const message =
      err.response?.data?.message ?? "Error al obtener resultados exportables";

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
