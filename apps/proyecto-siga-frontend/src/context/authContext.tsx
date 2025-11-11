import { createContext } from "react";
<<<<<<< HEAD

export type AppRole = "admin" | "psychologist" | "user"; //Cambiar a valores reales de roles dinamicos

export type User = {
  name: string;
  email: string;
  isActive: boolean;
  verifiedEmail: boolean;
  lastLogin: Date | null;
  role: AppRole;
};

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  login: (accessToken: string, refreshToken: string, user: User) => void;
  logout: () => void;
};

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);
=======
import { User } from "@packages/common-types/user.types";

type AuthContextType = {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isLoading: boolean;
  login: (
    accessToken: string,
    refreshToken: string,
    user: User,
  ) => void;
  logout: () => void;
};

export const AuthContext = createContext<AuthContextType | undefined>(undefined);


>>>>>>> remotes/origin/jhonzabala/refactoringWeb
