import axios from "axios";
import type { BaseResponse } from "@packages/common-types/baseResponse.types";
import type { User } from "@packages/common-types/user.types";
import { getSessionIdFromCookieApp } from "./sessionCookieApp";

export const getCurrentUserFromSession = async (): Promise<User | null> => {
  const sessionId = await getSessionIdFromCookieApp();

  if (!sessionId) {
    return null;
  }

  try {
    const response = await axios.get<BaseResponse<User>>(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/me`,
      {
        headers: {
          "x-session-id": sessionId,
        },
        timeout: 10000,
      },
    );

    return response.data.data;
  } catch {
    return null;
  }
};
