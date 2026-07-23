import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { authService } from "../../../services/auth/auth";
import { useAuth } from "../../../hooks/useAuth";
import ModalShell from "../core/ModalShell";
import FormErrorBanner from "../../FormErrorBanner";
import PasswordInput from "../../PasswordInput";
import { getApiErrorMessage } from "../../../libs/getApiErrorMessage";
import {
  passwordRequirements,
  validatePasswordStrength,
} from "../../../libs/authFormValidation";

interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type FormData = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

export default function ChangePasswordModal({
  isOpen,
  onClose,
}: ChangePasswordModalProps) {
  const auth = useAuth();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormData>();

  const mutation = useMutation({
    mutationFn: (data: FormData) =>
      authService.changePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      }),
    onSuccess: () => {
      setTimeout(() => {
        void auth.logout();
        onClose();
      }, 2000);
    },
  });

  const onSubmit = (data: FormData) => mutation.mutate(data);

  if (!isOpen) return null;

  return (
    <ModalShell isOpen={isOpen} onClose={onClose}>
      <h2 className="text-3xl font-bold text-[#102D69] mb-6">
        Cambiar Contraseña
      </h2>

      {mutation.isSuccess ? (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-center">
          <p className="font-bold">¡Contraseña cambiada exitosamente!</p>
          <p className="text-sm mt-1">Redirigiendo...</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Contraseña Actual
            </label>
            <PasswordInput
              {...register("currentPassword", {
                required: "Contraseña actual requerida",
              })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00A0B7] focus:border-transparent"
            />
            {errors.currentPassword && (
              <p className="text-red-500 text-xs mt-1">
                {errors.currentPassword.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nueva Contraseña
            </label>
            <PasswordInput
              {...register("newPassword", {
                required: "Nueva contraseña requerida",
                minLength: {
                  value: passwordRequirements.minLength,
                  message: passwordRequirements.minLengthMessage,
                },
                validate: validatePasswordStrength,
              })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00A0B7] focus:border-transparent"
            />
            <p className="text-xs text-gray-500 mt-1">
              {passwordRequirements.helperText}
            </p>
            {errors.newPassword && (
              <p className="text-red-500 text-xs mt-1">
                {errors.newPassword.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Confirmar Nueva Contraseña
            </label>
            <PasswordInput
              {...register("confirmPassword", {
                required: "Confirmar contraseña requerida",
                validate: (value) =>
                  value === watch("newPassword") ||
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

          <FormErrorBanner
            message={
              mutation.isError
                ? getApiErrorMessage(
                    mutation.error,
                    "Error al cambiar la contraseña",
                  )
                : null
            }
          />

          <button
            type="submit"
            disabled={mutation.isPending}
            className="w-full bg-gradient-to-r from-[#102D69] to-[#00A0B7] text-white py-3 rounded-lg font-bold hover:shadow-lg transition-all disabled:opacity-50"
          >
            {mutation.isPending
              ? "Cambiando contraseña..."
              : "Cambiar Contraseña"}
          </button>
        </form>
      )}
    </ModalShell>
  );
}
