import { useRouter } from "next/compat/router";
import { useAuth } from "../../hooks/useAuth";
import { useEffect, useState } from "react";

type AuthStatus =
  | "checking"
  | "authorized"
  | "unauthenticated"
  | "forbidden";

export default function AuthGuard({
  children,
  auth,
}: {
  children: React.ReactNode;
  auth: boolean | string | string[];
}) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  const [authStatus, setAuthStatus] = useState<AuthStatus>("checking");

  useEffect(() => {
    if (isLoading) {
      setAuthStatus("checking");
      return;
    }

    if (!isLoading && !user) {
      setAuthStatus("unauthenticated");
      return;
    }

    if (!isLoading && user) {
      const userRole = user.role;
      let isAuthorized = false;

      if (auth === true) {
        isAuthorized = true;
      } else if (typeof auth === "string") {
        isAuthorized = userRole === auth;
      } else if (Array.isArray(auth)) {
        isAuthorized = auth.includes(userRole);
      }

      setAuthStatus(isAuthorized ? "authorized" : "forbidden");
    }
  }, [user, isLoading, auth]);

  useEffect(() => {
    if (authStatus === "unauthenticated") {
      if (router) {
        router.replace("/");
      } else if (typeof window !== "undefined") {
        window.location.assign("/");
      }
      return;
    }

    if (authStatus === "forbidden") {
      const timer = setTimeout(() => {
        if (router) {
          router.push("/");
        } else if (typeof window !== "undefined") {
          window.location.assign("/");
        }
      }, 3000);
      return () => clearTimeout(timer);
    }

    return undefined;
  }, [authStatus, router]);

  if (authStatus === "authorized") {
    return <>{children}</>;
  }

  if (authStatus === "forbidden") {
    return <AccessDeniedScreen />;
  }

  return <LoadingScreen />;
}

const LoadingScreen = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gradient-from via-gradient-via to-gradient-to">
    <div className="text-center">
      <svg
        className="animate-spin h-10 w-10 text-primary-dark mx-auto"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        ></circle>
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        ></path>
      </svg>
      <div className="text-primary-dark text-xl font-semibold mt-4">
        Verificando credenciales...
      </div>
    </div>
  </div>
);

const AccessDeniedScreen = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-purple-100 to-blue-100 py-12 px-4">
    <div className="text-center p-8 bg-white shadow-2xl rounded-2xl max-w-md w-full">

      <img
        src="https://placehold.co/300x150/102D69/FFFFFF?text=¡Quieto%20ahí!"
        alt="Acceso denegado"
        className="w-full h-auto rounded-lg mb-6 object-cover"
        onError={(e) => {
          (e.currentTarget as HTMLImageElement).src =
            'https://placehold.co/300x150/102D69/FFFFFF?text=¡Quieto%20ahí!';
        }}
      />

      <svg
        className="w-16 h-16 text-primary-dark mx-auto"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
        ></path>
      </svg>

      <h1 className="text-3xl font-bold text-primary-dark mt-4">
        Acceso Denegado
      </h1>
      <p className="text-gray-600 mt-2 text-lg">
        No tienes los permisos necesarios para ver esta página.
      </p>
      <p className="text-primary-light font-medium text-base mt-6">
        Serás redirigido al inicio en 3 segundos...
      </p>
    </div>
  </div>
);
