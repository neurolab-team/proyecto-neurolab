import { AxiosError } from "axios";

export type HttpErrorAction =
  | { type: "INVALID_CREDENTIALS" }
  | { type: "UNAUTHORIZED_SESSION" }
  | { type: "FORBIDDEN" }
  | { type: "SERVER_ERROR" }
  | { type: "UNKNOWN_ERROR" };

export const resolveHttpError = (error: AxiosError): HttpErrorAction => {
  const status = error.response?.status;
  const url = error.config?.url ?? "";

  if (status === 401) {
    if (url.includes("/api/auth/login")) {
      return { type: "INVALID_CREDENTIALS" };
    }
    return { type: "UNAUTHORIZED_SESSION" };// Cuando se vence las cookies
  }

  if (status === 403) {
    return { type: "FORBIDDEN" };
  }

  if (status === 500) {
    return { type: "SERVER_ERROR" };
  }

  return { type: "UNKNOWN_ERROR" };
};