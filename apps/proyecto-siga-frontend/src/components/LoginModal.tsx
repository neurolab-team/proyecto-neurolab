import { useState } from "react";
import axios, { AxiosError } from "axios";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";

type FormData = {
  email: string;
  password: string;
  confirmPassword: string;
};
type User = {
  name: string;
  email: string;
};
interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: () => void;
}
type ModalView = "login" | "firstLogin" | "inactive";

export default function LoginModal({
  isOpen,
  onClose,
  onLoginSuccess,
}: LoginModalProps) {
  const [user, setUser] = useState<User | null>(null);
  const [modalView, setModalView] = useState<ModalView>("login");
  const [accessToken, setAccessToken] = useState("");
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormData>();

  const loginMutation = useMutation({
    mutationFn: async (data: FormData) => {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`,
        data
      );
      return response.data;
    },
    onSuccess: (response, _) => {
      const { accessToken, refreshToken, user } = response.data.data;
      setAccessToken(accessToken);
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      setUser(user);
      if (!user.isActive) {
        setModalView("inactive");
      } else if (!user.lastLogin) {
        setModalView("firstLogin");
      } else {
        onLoginSuccess();
        onClose();
      }
    },
  });
  const onSubmit = (data: FormData) => {
    loginMutation.mutate(data);
  };

  const changePasswordMutation = useMutation({
    mutationFn: async (data: { newPassword: string }) => {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/change-password`,
        data,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      return response.data;
    },
    onSuccess: () => {
      onLoginSuccess();
      onClose();
      // Resetear vista
      setModalView("login");
    },
  });
  const onChangePasswordSubmit = (data: FormData) => {
    if (data.password !== data.confirmPassword) {
      return;
    }
    changePasswordMutation.mutate({ newPassword: data.password! });
  };

  if (!isOpen) return null;

  const renderContent = () => {
    switch (modalView) {
      case "inactive":
        return (
          <div className="text-center py-8">
            <div className="w-24 h-24 bg-yellow-100 rounded-full mx-auto mb-4 flex items-center justify-center">
              <svg
                className="w-16 h-16 text-yellow-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-[#102D69] mb-2">
              Cuenta Inactiva
            </h3>
            <p className="text-gray-600 mb-4">
              Tu cuenta ha sido desactivada.
            </p>
            {user?.email && (
              <p className="text-sm text-gray-500 mb-6">
                Comuníquese con el administrador para activar
                tu cuenta.<br />
                <span className="font-semibold">{user.email}</span>
              </p>
            )}
            <button
              onClick={() => {
                setModalView("login");
                onClose();
              }}
              className="bg-gradient-to-r from-[#102D69] to-[#00A0B7] text-white px-6 py-3 rounded-lg font-bold hover:shadow-lg transition-all"
            >
              Entendido
            </button>
          </div>
        );

      case "firstLogin":
        return (
          <div>
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <svg
                  className="w-10 h-10 text-[#00A0B7]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-[#102D69] mb-2">
                Cambiar Contraseña
              </h3>
              <p className="text-gray-600 text-sm">
                Es tu primer inicio de sesión. Por seguridad, debes cambiar tu
                contraseña temporal.
              </p>
            </div>

            <form
              onSubmit={handleSubmit(onChangePasswordSubmit)}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nueva Contraseña
                </label>
                <input
                  type="password"
                  {...register("password", {
                    required: "Contraseña requerida",
                    minLength: {
                      value: 8,
                      message: "La contraseña debe tener al menos 8 caracteres",
                    },
                  })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00A0B7] focus:border-transparent"
                />
                {errors.password && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Confirmar Nueva Contraseña
                </label>
                <input
                  type="password"
                  {...register("confirmPassword", {
                    required: "Confirmar contraseña requerida",
                    validate: (value) =>
                      value === watch("password") ||
                      "Las contraseñas no coinciden",
                  })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00A0B7] focus:border-transparent"
                />
                {errors.confirmPassword && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>

              {changePasswordMutation.error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                  {(
                    changePasswordMutation.error as AxiosError<{
                      message: string;
                    }>
                  ).response?.data?.message || "Error al cambiar la contraseña"}
                </div>
              )}

              <button
                type="submit"
                disabled={changePasswordMutation.isPending}
                className="w-full bg-gradient-to-r from-[#102D69] to-[#00A0B7] text-white py-3 rounded-lg font-bold hover:shadow-lg transition-all disabled:opacity-50"
              >
                {changePasswordMutation.isPending
                  ? "Cambiando..."
                  : "Cambiar Contraseña"}
              </button>
            </form>
          </div>
        );

      default:
        return (
          <div>
            <h2 className="text-3xl font-bold text-[#102D69] mb-6">
              Iniciar Sesión
            </h2>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Correo Electrónico
                </label>
                <input
                  type="email"
                  {...register("email", {
                    required: "Correo electrónico requerido",
                  })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00A0B7] focus:border-transparent"
                />
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Contraseña
                </label>
                <input
                  type="password"
                  {...register("password", {
                    required: "Contraseña requerida",
                  })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00A0B7] focus:border-transparent"
                />
                {errors.password && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {loginMutation.error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                  {(loginMutation.error as AxiosError<{ message: string }>)
                    .response?.data?.message || "Credenciales inválidas"}
                </div>
              )}

              <button
                type="submit"
                disabled={loginMutation.isPending}
                className="w-full bg-gradient-to-r from-[#102D69] to-[#00A0B7] text-white py-3 rounded-lg font-bold hover:shadow-lg transition-all disabled:opacity-50"
              >
                {loginMutation.isPending
                  ? "Iniciando sesión..."
                  : "Iniciar Sesión"}
              </button>
            </form>
          </div>
        );
    }
  };
  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-2xl w-full max-w-md p-8 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {renderContent()}
      </div>
    </div>
  );
}
