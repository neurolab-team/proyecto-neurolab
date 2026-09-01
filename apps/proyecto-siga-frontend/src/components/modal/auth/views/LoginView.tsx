import { UseFormRegister, FieldErrors } from "react-hook-form";
import FormErrorBanner from "../../../FormErrorBanner";

export type LoginFormData = {
  email: string;
  password: string;
};

interface LoginViewProps {
  register: UseFormRegister<LoginFormData>;
  errors: FieldErrors<LoginFormData>;
  onSubmit: () => void;
  isSubmitting: boolean;
  errorMessage: string | string[] | null;
  onForgotPassword: () => void;
}

const INPUT_CLASS =
  "w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-opacity-50 focus:ring-[#2a4d8f] focus:border-[#2a4d8f] transition-all appearance-none bg-white text-gray-700 font-medium";

/**
 * Formulario de inicio de sesión. Presentacional: el contenedor le pasa el
 * `register`/`errors` del formulario y los manejadores de envío y de "olvidé
 * mi contraseña".
 */
export default function LoginView({
  register,
  errors,
  onSubmit,
  isSubmitting,
  errorMessage,
  onForgotPassword,
}: LoginViewProps) {
  return (
    <div>
      <h2 className="text-3xl font-bold text-[#102D69] mb-6">Iniciar Sesión</h2>

      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Correo Electrónico
          </label>
          <input
            type="email"
            {...register("email", {
              required: "Correo electrónico requerido",
            })}
            className={INPUT_CLASS}
          />
          {errors.email && (
            <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
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
            className={INPUT_CLASS}
          />
          {errors.password && (
            <p className="text-red-500 text-xs mt-1">
              {errors.password.message}
            </p>
          )}
        </div>

        <FormErrorBanner message={errorMessage} />

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-gradient-to-r from-[#001d4e] via-[#102D69] to-[#2a4d8f] text-white py-3 rounded-lg font-bold hover:shadow-lg transition-all disabled:opacity-50"
        >
          {isSubmitting ? "Iniciando sesión..." : "Iniciar Sesión"}
        </button>

        <button
          type="button"
          onClick={onForgotPassword}
          className="w-full text-sm font-semibold text-[#102D69] hover:text-[#00A0B7] transition-colors"
        >
          ¿Olvidaste tu contraseña?
        </button>
      </form>
    </div>
  );
}
