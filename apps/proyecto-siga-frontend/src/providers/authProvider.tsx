"use client";

import { ReactNode, useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { AuthContext } from "../context/authContext";
import { User } from "@packages/common-types/user.types";
import { authService } from "../services/auth/auth";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const refreshUser = useCallback(async (): Promise<User | null> => {
    try {
      const authUser = await authService.me();
      setUser(authUser);
      return authUser;
    } catch {
      setUser(null);
      return null;
    }
  }, []);

  useEffect(() => {
    const onUnauthorized = () => {
      setUser(null);
    };

    if (typeof window !== "undefined") {
      window.addEventListener("auth:unauthorized", onUnauthorized);
    }

    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("auth:unauthorized", onUnauthorized);
      }
    };
  }, []);

  useEffect(() => {
    refreshUser().finally(() => setIsLoading(false));
  }, [refreshUser]);

  const login = async (email: string, password: string): Promise<void> => {
    setIsLoading(true);

    try {
      const userData = await authService.login({ email, password });
      setUser(userData);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await authService.logout();
    } catch {
      // aunque falle el backend, limpiamos el estado local
    } finally {
      setUser(null);
      router.push("/");
      router.refresh();
    }
  };

  const value = useMemo(
    () => ({
      user,
      isLoading,
      isAuthenticated: !!user,
      login,
      logout,
      refreshUser,
    }),
    [user, isLoading, refreshUser],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
