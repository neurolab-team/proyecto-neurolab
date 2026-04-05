import { useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { useAuth } from "../../../hooks/useAuth";
import { authService } from "../../../services/auth/auth";
import { User } from "@packages/common-types/user.types";
import ModalShell from "../core/ModalShell";
import FormErrorBanner from "../../FormErrorBanner";
import { getApiErrorMessage } from "../../../libs/getApiErrorMessage";

type FormData = {
  email: string;
  password: string;
  confirmPassword: string;
};

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}
type ModalView = "login" | "firstLogin" | "inactive" | "emailVerification";

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const auth = useAuth();
  const [user, setUser] = useState<User | null>(null);
  const [modalView, setModalView] = useState<ModalView>("login");
  const [loginPassword, setLoginPassword] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormData>();

  const loginMutation = useMutation({
    mutationFn: async (data: FormData) => {
      return await authService.login({
        email: data.email,
        password: data.password,
      });
    },
    onSuccess: async (loggedUser) => {
      setUser(loggedUser);

      if (!loggedUser.isActive) {
        setModalView("inactive");
      } else if (!loggedUser.verifiedEmail) {
        setModalView("emailVerification");
      } else if (!loggedUser.lastLogin) {
        setModalView("firstLogin");
      } else {
        await auth.refreshUser();
        onClose();
      }
    },
  });

  const onSubmit = (data: FormData) => {
    setLoginPassword(data.password);
    loginMutation.mutate(data);
  };

  const changePasswordMutation = useMutation({
    mutationFn: async (data: { currentPassword: string; newPassword: string }) => {
      await authService.changePassword(data);
    },
    onSuccess: async () => {
      onClose();
      await auth.logout();
    },
  });

  const onChangePasswordSubmit = (data: FormData) => {
    if (data.password !== data.confirmPassword) {
      return;
    }
    changePasswordMutation.mutate({
      currentPassword: loginPassword,
      newPassword: data.password!,
    });
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
            <p className="text-gray-600 mb-4">Tu cuenta ha sido desactivada.</p>

            <p className="text-sm text-gray-500 mb-6">
              Comuníquese con el administrador para activar tu cuenta.
              <br />
              <span className="font-semibold">support@neurolab.itm.</span>
            </p>

            <button
              onClick={() => {
                setModalView("login");
                onClose();
              }}
              className="bg-gradient-to-r from-[#001d4e] via-[#102D69] to-[#2a4d8f] text-white px-6 py-3 rounded-lg font-bold hover:shadow-lg transition-all"
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
                      value: 6,
                      message: "La contraseña debe tener al menos 6 caracteres",
                    },
                  })}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-opacity-50 focus:ring-[#2a4d8f] focus:border-[#2a4d8f] transition-all appearance-none bg-white text-gray-700 font-medium"
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
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-opacity-50 focus:ring-[#2a4d8f] focus:border-[#2a4d8f] transition-all appearance-none bg-white text-gray-700 font-medium"
                />
                {errors.confirmPassword && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>

              <FormErrorBanner message={changePasswordMutation.isError ? getApiErrorMessage(changePasswordMutation.error, 'Error al cambiar la contraseña.') : null} />

              <button
                type="submit"
                disabled={changePasswordMutation.isPending}
                className="w-full bg-gradient-to-r from-[#001d4e] via-[#102D69] to-[#2a4d8f] text-white py-3 rounded-lg font-bold hover:shadow-lg transition-all disabled:opacity-50"
              >
                {changePasswordMutation.isPending
                  ? "Cambiando..."
                  : "Cambiar Contraseña"}
              </button>
            </form>
          </div>
        );

      case "emailVerification":
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
            <p className="textG-gray-600 mb-4">
              No has verificado tu correo electrónico.
            </p>
            <p className="text-sm text-gray-500 mb-6">
              Comuníquese con el administrador para activar tu cuenta.
              <br />
              <span className="font-semibold">support@neurolab.itm.com</span>
            </p>
            <button
              className="w-full bg-gradient-to-r from-[#001d4e] via-[#102D69] to-[#2a4d8f] text-white py-3 
            rounded-lg font-bold hover:shadow-lg transition-all disabled:opacity-50
            mb-3"
            >
              ¿Volver a enviar correo de verificación?
            </button>
            <button
              onClick={() => {
                onClose();
              }}
              className="bg-gradient-to-r from-[#001d4e] via-[#102D69] to-[#2a4d8f] text-white px-6 py-3 rounded-lg font-bold hover:shadow-lg transition-all"
            >
              Cerrar
            </button>
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
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-opacity-50 focus:ring-[#2a4d8f] focus:border-[#2a4d8f] transition-all appearance-none bg-white text-gray-700 font-medium"
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
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-opacity-50 focus:ring-[#2a4d8f] focus:border-[#2a4d8f] transition-all appearance-none bg-white text-gray-700 font-medium"
                />
                {errors.password && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <FormErrorBanner message={loginMutation.isError ? getApiErrorMessage(loginMutation.error, 'No fue posible iniciar sesión.') : null} />

              <button
                type="submit"
                disabled={loginMutation.isPending}
                className="w-full bg-gradient-to-r from-[#001d4e] via-[#102D69] to-[#2a4d8f] text-white py-3 rounded-lg font-bold hover:shadow-lg transition-all disabled:opacity-50"
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
  return <ModalShell isOpen={isOpen} onClose={onClose}>{renderContent()}</ModalShell>;
}
