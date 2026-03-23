import { AxiosError } from "axios";

type ApiValidationError = {
  field?: string;
  message?: string;
};

type ApiErrorPayload = {
  message?: string;
  error?: string;
  details?: {
    validationErrors?: ApiValidationError[];
  };
};

const isNonEmptyString = (value: unknown): value is string =>
  typeof value === "string" && value.trim().length > 0;

export const getApiErrorMessage = (
  error: unknown,
  fallbackMessage = "Ocurrio un error inesperado.",
): string | string[] => {
  if (error instanceof AxiosError) {
    const data = error.response?.data as ApiErrorPayload | undefined;

    const validationMessages = data?.details?.validationErrors
      ?.map((item) => item?.message)
      .filter(isNonEmptyString);

    if (validationMessages && validationMessages.length > 0) {
      return validationMessages.length === 1 ? validationMessages[0] : validationMessages;
    }

    if (isNonEmptyString(data?.message)) {
      return data.message;
    }

    if (isNonEmptyString(data?.error)) {
      return data.error;
    }
  }

  if (error instanceof Error && isNonEmptyString(error.message)) {
    return error.message;
  }

  return fallbackMessage;
};
