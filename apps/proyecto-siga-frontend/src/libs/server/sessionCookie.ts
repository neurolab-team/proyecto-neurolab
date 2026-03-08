import { serialize } from "cookie";
import { NextApiRequest, NextApiResponse } from "next";

const SESSION_COOKIE_NAME = "sid";

export const setSessionCookie = (
  res: NextApiResponse,
  sessionId: string,
): void => {
  const cookie = serialize(SESSION_COOKIE_NAME, sessionId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 días
  });

  res.setHeader("Set-Cookie", cookie);
};

export const clearSessionCookie = (res: NextApiResponse): void => {
  const cookie = serialize(SESSION_COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });

  res.setHeader("Set-Cookie", cookie);
};

export const getSessionIdFromCookie = (req: NextApiRequest): string | null => {
  const cookieHeader = req.headers.cookie;

  if (!cookieHeader) return null;

  const cookies = Object.fromEntries(
    cookieHeader.split("; ").map((cookie) => {
      const [name, ...rest] = cookie.split("=");
      return [name, rest.join("=")];
    }),
  );

  return cookies[SESSION_COOKIE_NAME] ?? null;
};
