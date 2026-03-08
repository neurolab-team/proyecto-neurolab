import { useContext } from "react";
import { ModalContext, ModalContextType } from "../context/modalContext";

export const useModal = (): ModalContextType => {
  const context = useContext(ModalContext);

  if (!context) {
    throw new Error("Ha ocurrido un error inesperado");
  }

  return context;
};
