import { cookies } from "next/headers";

const SESSION_COOKIE_NAME = "sid";
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7;

const getCookieOptions = (maxAge: number) => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
  maxAge,
});

export const setSessionCookieApp = async (sessionId: string): Promise<void> => {
  const cookieStore = await cookies();
  cookieStore.set(
    SESSION_COOKIE_NAME,
    sessionId,
    getCookieOptions(SESSION_MAX_AGE_SECONDS),
  );
};

export const clearSessionCookieApp = async (): Promise<void> => {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, "", getCookieOptions(0));
};

export const getSessionIdFromCookieApp = async (): Promise<string | null> => {
  const cookieStore = await cookies();
  return cookieStore.get(SESSION_COOKIE_NAME)?.value ?? null;
};
