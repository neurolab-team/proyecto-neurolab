import axios from "axios";
import { useRouter } from "next/router";
import { ReactNode, useEffect, useState } from "react";
<<<<<<< HEAD
import { AuthContext, User } from "../context/authContext";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
=======
import { AuthContext } from "../context/authContext";
import { User } from "@packages/common-types/user.types";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
>>>>>>> remotes/origin/jhonzabala/refactoringWeb
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("accessToken");
<<<<<<< HEAD
      if (!token) {
        setIsLoading(false);
        setUser(null);
        return;
      }
=======
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

>>>>>>> remotes/origin/jhonzabala/refactoringWeb
      try {
        const { data } = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/auth/me`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
<<<<<<< HEAD
          }
=======
          },
>>>>>>> remotes/origin/jhonzabala/refactoringWeb
        );

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
<<<<<<< HEAD
=======
        setAccessToken(null);
        setRefreshToken(null);
>>>>>>> remotes/origin/jhonzabala/refactoringWeb
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("user");
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

<<<<<<< HEAD
  const login = (accessToken: string, refreshToken: string, user: User) => {
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
    localStorage.setItem("user", JSON.stringify(user));
=======
  const login = (newAccessToken: string, newRefreshToken: string, user: User) => {
    localStorage.setItem("accessToken", newAccessToken);
    localStorage.setItem("refreshToken", newRefreshToken);
    localStorage.setItem("user", JSON.stringify(user));
    setAccessToken(newAccessToken);
    setRefreshToken(newRefreshToken);
>>>>>>> remotes/origin/jhonzabala/refactoringWeb
    setUser(user);
  };

  const logout = () => {
    setUser(null);
<<<<<<< HEAD
=======
    setAccessToken(null);
    setRefreshToken(null);
>>>>>>> remotes/origin/jhonzabala/refactoringWeb
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");

    router.push("/");
  };

  const value = {
    user,
<<<<<<< HEAD
=======
    accessToken,
    refreshToken,
>>>>>>> remotes/origin/jhonzabala/refactoringWeb
    isLoading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
