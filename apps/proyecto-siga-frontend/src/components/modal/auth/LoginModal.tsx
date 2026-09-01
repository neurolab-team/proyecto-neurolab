import { useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useAuth } from "../../../hooks/useAuth";
import { authService } from "../../../services/auth/auth";
import { usersService } from "../../../services/users/users";
import ModalShell from "../core/ModalShell";
import { getApiErrorMessage } from "../../../libs/getApiErrorMessage";
import LoginView, { LoginFormData } from "./views/LoginView";
import FirstLoginView, { FirstLoginFormData } from "./views/FirstLoginView";
import ForgotPasswordView, {
  ForgotPasswordFormData,
} from "./views/ForgotPasswordView";
import InactiveView from "./views/InactiveView";
import EmailVerificationView from "./views/EmailVerificationView";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type ModalView =
  | "login"
  | "firstLogin"
  | "inactive"
  | "emailVerification"
  | "forgotPassword";

/**
 * Contenedor del flujo de autenticación. No renderiza formularios directamente:
 * orquesta las mutaciones y el estado compartido, y delega cada pantalla a una
 * vista presentacional en `./views`.
 *
 * `loginPassword` se conserva del inicio de sesión para poder cambiar la
 * contraseña temporal en el primer login sin volver a pedirla, que es el
 * comportamiento previo de este componente.
 */
export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const auth = useAuth();
  const router = useRouter();

  const [modalView, setModalView] = useState<ModalView>("login");
  const [loginPassword, setLoginPassword] = useState("");
  const [attemptedEmail, setAttemptedEmail] = useState("");
  const [resendMessage, setResendMessage] = useState<string | null>(null);
  const [forgotPasswordMessage, setForgotPasswordMessage] = useState<
    string | null
  >(null);

  const loginForm = useForm<LoginFormData>();
  const firstLoginForm = useForm<FirstLoginFormData>();
  const forgotPasswordForm = useForm<ForgotPasswordFormData>();

  const loginMutation = useMutation({
    mutationFn: async (data: LoginFormData) => {
      return authService.login({
        email: data.email,
        password: data.password,
      });
    },
    onSuccess: async (loggedUser) => {
      if (!loggedUser.isActive) {
        setModalView("inactive");
      } else if (!loggedUser.verifiedEmail) {
        setModalView("emailVerification");
      } else if (loggedUser.mustChangePassword) {
        setModalView("firstLogin");
      } else {
        await auth.refreshUser();
        onClose();
        router.refresh();
      }
    },
  });

  const resendVerificationMutation = useMutation({
    mutationFn: async () => {
      if (!attemptedEmail) return;
      return usersService.resendVerificationEmail(attemptedEmail);
    },
    onSuccess: (response) => {
      setResendMessage(
        response?.message ||
          "Si tu correo no está verificado, enviamos un nuevo enlace.",
      );
    },
    onError: (error) => {
      const rawMessage = getApiErrorMessage(
        error,
        "No fue posible reenviar el correo.",
      );
      setResendMessage(
        Array.isArray(rawMessage) ? rawMessage.join(", ") : rawMessage,
      );
    },
  });

  const changePasswordMutation = useMutation({
    mutationFn: async (data: {
      currentPassword: string;
      newPassword: string;
    }) => {
      await authService.changePassword(data);
    },
    onSuccess: async () => {
      onClose();
      await auth.logout();
    },
  });

  const forgotPasswordMutation = useMutation({
    mutationFn: async (email: string) => {
      return authService.forgotPassword({ email });
    },
    onSuccess: (response) => {
      setForgotPasswordMessage(
        response?.message ||
          "Te enviamos un enlace para restablecer tu contraseña.",
      );
    },
  });

  const handleLoginSubmit = loginForm.handleSubmit((data) => {
    setLoginPassword(data.password);
    setAttemptedEmail(data.email);
    setResendMessage(null);
    loginMutation.mutate(data);
  });

  const handleChangePasswordSubmit = firstLoginForm.handleSubmit((data) => {
    if (data.password !== data.confirmPassword) {
      return;
    }
    changePasswordMutation.mutate({
      currentPassword: loginPassword,
      newPassword: data.password,
    });
  });

  const handleForgotPasswordSubmit = forgotPasswordForm.handleSubmit((data) => {
    setForgotPasswordMessage(null);
    forgotPasswordMutation.mutate(data.resetEmail);
  });

  const handleOpenForgotPassword = () => {
    setForgotPasswordMessage(null);
    forgotPasswordMutation.reset();
    setModalView("forgotPassword");
  };

  const handleBackToLogin = () => {
    setForgotPasswordMessage(null);
    forgotPasswordMutation.reset();
    setModalView("login");
  };

  const handleAcknowledgeInactive = () => {
    setModalView("login");
    onClose();
  };

  if (!isOpen) return null;

  const renderContent = () => {
    switch (modalView) {
      case "inactive":
        return <InactiveView onAcknowledge={handleAcknowledgeInactive} />;

      case "firstLogin":
        return (
          <FirstLoginView
            register={firstLoginForm.register}
            errors={firstLoginForm.formState.errors}
            watch={firstLoginForm.watch}
            onSubmit={handleChangePasswordSubmit}
            isSubmitting={changePasswordMutation.isPending}
            errorMessage={
              changePasswordMutation.isError
                ? getApiErrorMessage(
                    changePasswordMutation.error,
                    "Error al cambiar la contraseña.",
                  )
                : null
            }
          />
        );

      case "emailVerification":
        return (
          <EmailVerificationView
            onResend={() => resendVerificationMutation.mutate()}
            isResending={resendVerificationMutation.isPending}
            canResend={Boolean(attemptedEmail)}
            resendMessage={resendMessage}
            onClose={onClose}
          />
        );

      case "forgotPassword":
        return (
          <ForgotPasswordView
            register={forgotPasswordForm.register}
            errors={forgotPasswordForm.formState.errors}
            onSubmit={handleForgotPasswordSubmit}
            isSubmitting={forgotPasswordMutation.isPending}
            isSuccess={forgotPasswordMutation.isSuccess}
            successMessage={forgotPasswordMessage}
            errorMessage={
              forgotPasswordMutation.isError
                ? getApiErrorMessage(
                    forgotPasswordMutation.error,
                    "No fue posible enviar el enlace de restablecimiento.",
                  )
                : null
            }
            onBackToLogin={handleBackToLogin}
          />
        );

      default:
        return (
          <LoginView
            register={loginForm.register}
            errors={loginForm.formState.errors}
            onSubmit={handleLoginSubmit}
            isSubmitting={loginMutation.isPending}
            errorMessage={
              loginMutation.isError
                ? getApiErrorMessage(
                    loginMutation.error,
                    "No fue posible iniciar sesión.",
                  )
                : null
            }
            onForgotPassword={handleOpenForgotPassword}
          />
        );
    }
  };

  return (
    <ModalShell isOpen={isOpen} onClose={onClose}>
      {renderContent()}
    </ModalShell>
  );
}
