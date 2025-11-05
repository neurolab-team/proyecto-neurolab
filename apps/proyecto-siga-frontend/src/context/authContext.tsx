import { createContext } from "react";

export type User = {
  name: string;
  email: string;
  isActive: boolean;
  verifiedEmail: boolean;
  lastLogin: Date | null;
};

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  login: (accessToken: string, refreshToken: string, user: User) => void;
  logout: () => void;
};

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);
