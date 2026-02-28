import { useRouter } from "next/router";
import { ReactNode, useCallback, useEffect, useMemo, useState } from "react";
import { AuthContext } from "../context/authContext";
import apiClient from "../api/interceptors/axiosConfig";
import { User } from "@packages/common-types/user.types";
import { BaseResponse } from "@packages/common-types/baseResponse.types";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const refreshUser = useCallback(async (): Promise<User | null> => {
    try {
      const response = await apiClient.get<BaseResponse<User>>("/api/auth/me");
      setUser(response.data.data);
      return response.data.data;
    } catch {
      setUser(null);
      return null;
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    const checkAuth = async () => {
      try {
        const { data } = await apiClient.get<User>("/api/auth/me");
        if (isMounted) {
          setUser(data);
        }
      } catch {
        if (isMounted) {
          setUser(null);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    checkAuth();

    return () => {
      isMounted = false;
    };
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    setIsLoading(true);

    try {
      const { data } = await apiClient.post<BaseResponse<User>>("/api/auth/login", {
        email,
        password,
      });

      const userData = data.data;
      setUser(userData);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await apiClient.post("/api/auth/logout");
    } catch {
      // aunque falle el backend, limpiamos el estado local
    } finally {
      setUser(null);
      router.push("/");
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
