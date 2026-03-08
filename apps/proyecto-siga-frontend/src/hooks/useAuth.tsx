import { useContext } from "react";
import { AuthContext, AuthContextType } from "../context/authContext";

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("Ha ocurrido un error inesperado");
  }

  return context;
};