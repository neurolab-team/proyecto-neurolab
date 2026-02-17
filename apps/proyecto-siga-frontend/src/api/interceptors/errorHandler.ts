import { notify } from "../../libs/toastService";

const errorHandlers: Record<number, () => void> = {
  401: () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    notify.error("Sesión expirada, por favor inicia sesión nuevamente.");
    setTimeout(() => {
      window.location.href = "/";
    }, 3000);
  },
  403: () => notify.error("No tienes permisos para esto."),
  500: () => notify.error("Error en el servidor, intenta más tarde."),
};

export default errorHandlers;
