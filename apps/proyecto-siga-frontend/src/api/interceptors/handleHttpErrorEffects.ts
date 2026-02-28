import { notify } from "../../libs/toastService";
import { HttpErrorAction } from "./resolveHttpError";

const dispatchUnauthorizedEvent = () => {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent("auth:unauthorized"));
};

export const handleHttpErrorEffects = (action: HttpErrorAction) => {
  switch (action.type) {
    case "INVALID_CREDENTIALS":
      notify.error("Credenciales inválidas.");
      break;

    case "UNAUTHORIZED_SESSION":
      notify.error("Tu sesión expiró. Inicia sesión nuevamente.");
      dispatchUnauthorizedEvent();
      break;

    case "FORBIDDEN":
      notify.error("No tienes permisos para esta acción.");
      break;

    case "SERVER_ERROR":
      notify.error("Error en el servidor. Intenta más tarde.");
      break;

    default:
      notify.error("Ocurrió un error inesperado.");
      break;
  }
};