import { UseFormRegister, FieldErrors } from "react-hook-form";
import FormErrorBanner from "../../../FormErrorBanner";

export type ForgotPasswordFormData = {
  resetEmail: string;
};

interface ForgotPasswordViewProps {
  register: UseFormRegister<ForgotPasswordFormData>;
  errors: FieldErrors<ForgotPasswordFormData>;
  onSubmit: () => void;
  isSubmitting: boolean;
  isSuccess: boolean;
  successMessage: string | null;
  errorMessage: string | string[] | null;
  onBackToLogin: () => void;
}

const INPUT_CLASS =
  "w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-opacity-50 focus:ring-[#2a4d8f] focus:border-[#2a4d8f] transition-all appearance-none bg-white text-gray-700 font-medium";

const PRIMARY_BUTTON =
  "w-full bg-gradient-to-r from-[#001d4e] via-[#102D69] to-[#2a4d8f] text-white py-3 rounded-lg font-bold hover:shadow-lg transition-all disabled:opacity-50";

const BACK_BUTTON =
  "w-full text-sm font-semibold text-[#102D69] hover:text-[#00A0B7] transition-colors";

/** Solicitud del enlace de restablecimiento de contraseña. */
export default function ForgotPasswordView({
  register,
  errors,
  onSubmit,
  isSubmitting,
  isSuccess,
  successMessage,
  errorMessage,
  onBackToLogin,
}: ForgotPasswordViewProps) {
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
              d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
        </div>
        <h3 className="text-2xl font-bold text-[#102D69] mb-2">
          Restablecer Contraseña
        </h3>
        <p className="text-gray-600 text-sm">
          Escribe tu correo electrónico y te enviaremos un enlace para crear una
          contraseña nueva. El enlace caduca en 30 minutos.
        </p>
      </div>

      {isSuccess ? (
        <div className="space-y-4">
          <p
            className="rounded-xl bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-800"
            role="status"
          >
            {successMessage}
          </p>
          <p className="text-xs text-gray-500">
            Revisa tu bandeja de entrada y la carpeta de correo no deseado. Si
            necesitas otro enlace, deberás esperar unos minutos antes de
            solicitarlo.
          </p>
          <button type="button" onClick={onBackToLogin} className={PRIMARY_BUTTON}>
            Volver a Iniciar Sesión
          </button>
        </div>
      ) : (
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="resetEmail"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Correo Electrónico
            </label>
            <input
              id="resetEmail"
              type="email"
              autoComplete="email"
              {...register("resetEmail", {
                required: "Correo electrónico requerido",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Correo electrónico inválido",
                },
              })}
              className={INPUT_CLASS}
            />
            {errors.resetEmail && (
              <p className="text-red-500 text-xs mt-1">
                {errors.resetEmail.message}
              </p>
            )}
          </div>

          <FormErrorBanner message={errorMessage} />

          <button type="submit" disabled={isSubmitting} className={PRIMARY_BUTTON}>
            {isSubmitting ? "Enviando..." : "Enviar Enlace"}
          </button>

          <button type="button" onClick={onBackToLogin} className={BACK_BUTTON}>
            Volver a Iniciar Sesión
          </button>
        </form>
      )}
    </div>
  );
}
