import { useRouter } from "next/router";
import { ReactNode, useEffect, useState } from "react";
import { AuthContext } from "../context/authContext";
import axiosConfig from "../api/interceptors/axiosConfig";
import { User } from "@packages/common-types/user.types";
import { BaseResponse } from "packages/common-types/baseResponse.types";
//import { UserProfile } from "packages/common-types/auth.types";
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("accessToken");
      const refresh = localStorage.getItem("refreshToken");

      if (!token) {
        setIsLoading(false);
        setUser(null);
        setAccessToken(null);
        setRefreshToken(null);
        return;
      }

      // Set tokens immediately from localStorage
      setAccessToken(token);
      setRefreshToken(refresh);
//Recorder implementar el type userProfile yno User como esta actualmente.
      try {
        const { data } = await axiosConfig.get<BaseResponse<User>>("/api/auth/me");

        const userData: User = data.data;

        if (
          !userData.isActive ||
          !userData.verifiedEmail ||
          !userData.lastLogin
        ) {
          setUser(null);
          localStorage.setItem("user", JSON.stringify(userData));
        } else {
          setUser(userData);
          localStorage.setItem("user", JSON.stringify(userData));
        }
      } catch {
        setUser(null);
        setAccessToken(null);
        setRefreshToken(null);
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("user");
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = (
    newAccessToken: string,
    newRefreshToken: string,
    user: User,
  ) => {
    localStorage.setItem("accessToken", newAccessToken);
    localStorage.setItem("refreshToken", newRefreshToken);
    localStorage.setItem("user", JSON.stringify(user));
    setAccessToken(newAccessToken);
    setRefreshToken(newRefreshToken);
    setUser(user);
  };

  const logout = () => {
    setUser(null);
    setAccessToken(null);
    setRefreshToken(null);
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");

    router.push("/");
  };

  const value = {
    user,
    accessToken,
    refreshToken,
    isLoading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
