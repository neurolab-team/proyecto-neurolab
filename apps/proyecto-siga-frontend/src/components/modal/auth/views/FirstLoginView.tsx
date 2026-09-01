import { UseFormRegister, FieldErrors, UseFormWatch } from "react-hook-form";
import FormErrorBanner from "../../../FormErrorBanner";

export type FirstLoginFormData = {
  password: string;
  confirmPassword: string;
};

interface FirstLoginViewProps {
  register: UseFormRegister<FirstLoginFormData>;
  errors: FieldErrors<FirstLoginFormData>;
  watch: UseFormWatch<FirstLoginFormData>;
  onSubmit: () => void;
  isSubmitting: boolean;
  errorMessage: string | string[] | null;
}

const INPUT_CLASS =
  "w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-opacity-50 focus:ring-[#2a4d8f] focus:border-[#2a4d8f] transition-all appearance-none bg-white text-gray-700 font-medium";

/**
 * Cambio de contraseña obligatorio en el primer inicio de sesión. La contraseña
 * actual (temporal) no se pide en este formulario: la conoce el contenedor a
 * partir del login recién realizado. Este componente solo recoge la contraseña
 * nueva y su confirmación.
 */
export default function FirstLoginView({
  register,
  errors,
  watch,
  onSubmit,
  isSubmitting,
  errorMessage,
}: FirstLoginViewProps) {
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

      <form onSubmit={onSubmit} className="space-y-4">
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
            className={INPUT_CLASS}
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
                value === watch("password") || "Las contraseñas no coinciden",
            })}
            className={INPUT_CLASS}
          />
          {errors.confirmPassword && (
            <p className="text-red-500 text-xs mt-1">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        <FormErrorBanner message={errorMessage} />

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-gradient-to-r from-[#001d4e] via-[#102D69] to-[#2a4d8f] text-white py-3 rounded-lg font-bold hover:shadow-lg transition-all disabled:opacity-50"
        >
          {isSubmitting ? "Cambiando..." : "Cambiar Contraseña"}
        </button>
      </form>
    </div>
  );
}
