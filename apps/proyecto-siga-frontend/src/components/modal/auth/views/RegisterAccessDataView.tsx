import { ArrowLeft, Mail, ShieldCheck } from "lucide-react";
import type {
  FieldErrors,
  UseFormRegister,
  UseFormWatch,
} from "react-hook-form";
import FormErrorBanner from "../../../FormErrorBanner";
import PasswordInput from "../../../PasswordInput";
import PasswordStrengthMeter from "../../../PasswordStrengthMeter";
import {
  EMAIL_PATTERN,
  getEmailDomainForUserType,
  getEmailPlaceholderForUserType,
  INPUT_CLASS,
  PRIMARY_BUTTON_CLASS,
  RegisterFormData,
  SECONDARY_BUTTON_CLASS,
  validateEmailForUserType,
} from "../registerForm";
import {
  passwordRequirements,
  validatePasswordStrength,
} from "../../../../libs/authFormValidation";

interface RegisterAccessDataViewProps {
  register: UseFormRegister<RegisterFormData>;
  errors: FieldErrors<RegisterFormData>;
  watch: UseFormWatch<RegisterFormData>;
  isAdminMode: boolean;
  onBack: () => void;
  onSubmit: () => void;
  isSubmitting: boolean;
  errorMessage: string | string[] | null;
}

const normalizeEmail = (value: string | undefined) =>
  (value ?? "").trim().toLowerCase();

/**
 * Paso 2 del registro: datos de acceso. El correo se confirma en un segundo
 * campo y se muestra tal como quedará registrado, para evitar errores
 * tipográficos en la dirección que recibirá el enlace de verificación.
 */
export default function RegisterAccessDataView({
  register,
  errors,
  watch,
  isAdminMode,
  onBack,
  onSubmit,
  isSubmitting,
  errorMessage,
}: RegisterAccessDataViewProps) {
  const userType = watch("userType");
  const email = watch("email") ?? "";
  const confirmEmail = watch("confirmEmail") ?? "";
  const password = watch("password") ?? "";
  const confirmPassword = watch("confirmPassword") ?? "";

  const domain = getEmailDomainForUserType(userType);
  const isEmailConfirmed =
    EMAIL_PATTERN.test(email.trim()) &&
    normalizeEmail(email) === normalizeEmail(confirmEmail) &&
    validateEmailForUserType(email, userType) === true;

  const passwordsMatch =
    password.length > 0 && password === confirmPassword;

  return (
    <form onSubmit={onSubmit} className="flex min-h-0 flex-1 flex-col">
      <div className="flex-1 space-y-5 overflow-y-auto px-5 py-6 sm:px-8">
        <div>
          <label
            htmlFor="register-email"
            className="text-sm font-semibold text-gray-800"
          >
            Correo electrónico <span className="text-[#00A0B7]">*</span>
          </label>
          <p className="mt-0.5 text-xs text-gray-500">
            {isAdminMode
              ? domain
                ? `Debe terminar en ${domain}. Allí llegará la contraseña temporal.`
                : "Allí llegará la contraseña temporal."
              : domain
                ? `Debe terminar en ${domain}. Aquí recibirás el enlace de verificación.`
                : "Aquí recibirás el enlace de verificación."}
          </p>
          <input
            id="register-email"
            type="email"
            autoComplete="email"
            className={`mt-2 ${INPUT_CLASS}`}
            placeholder={getEmailPlaceholderForUserType(userType)}
            {...register("email", {
              required: "Este campo es obligatorio",
              pattern: {
                value: EMAIL_PATTERN,
                message: "Ingresa un correo electrónico válido",
              },
              validate: (value) => validateEmailForUserType(value, userType),
              // Al corregir el correo se revalida su confirmación, para que no
              // quede un "no coinciden" obsoleto.
              deps: ["confirmEmail"],
            })}
          />
          {errors.email && (
            <p role="alert" className="mt-1.5 text-sm text-red-500">
              {errors.email.message}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="register-confirm-email"
            className="text-sm font-semibold text-gray-800"
          >
            Confirmar correo electrónico{" "}
            <span className="text-[#00A0B7]">*</span>
          </label>
          <input
            id="register-confirm-email"
            type="email"
            autoComplete="email"
            className={`mt-2 ${INPUT_CLASS}`}
            placeholder="Vuelve a escribir tu correo"
            {...register("confirmEmail", {
              required: "Confirma tu correo electrónico",
              validate: (value) =>
                normalizeEmail(value) === normalizeEmail(watch("email")) ||
                "Los correos no coinciden",
            })}
          />
          {errors.confirmEmail && (
            <p role="alert" className="mt-1.5 text-sm text-red-500">
              {errors.confirmEmail.message}
            </p>
          )}
        </div>

        {isEmailConfirmed && (
          <div
            aria-live="polite"
            className="flex items-center gap-3 rounded-xl border border-green-200 bg-green-50 px-4 py-3"
          >
            <Mail
              className="h-5 w-5 flex-shrink-0 text-green-600"
              aria-hidden="true"
            />
            <p className="text-sm text-green-800">
              Enviaremos el{" "}
              {isAdminMode ? "acceso temporal" : "enlace de verificación"} a{" "}
              <strong className="break-all">{email.trim()}</strong>
            </p>
          </div>
        )}

        {!isAdminMode && (
          <>
            <div>
              <label
                htmlFor="register-password"
                className="text-sm font-semibold text-gray-800"
              >
                Contraseña <span className="text-[#00A0B7]">*</span>
              </label>
              <PasswordInput
                id="register-password"
                autoComplete="new-password"
                aria-describedby="register-password-strength"
                className={`mt-2 ${INPUT_CLASS}`}
                placeholder="Crea una contraseña segura"
                {...register("password", {
                  required: "Este campo es obligatorio",
                  minLength: {
                    value: passwordRequirements.minLength,
                    message: passwordRequirements.minLengthMessage,
                  },
                  validate: validatePasswordStrength,
                  deps: ["confirmPassword"],
                })}
              />
              {errors.password && (
                <p role="alert" className="mt-1.5 text-sm text-red-500">
                  {errors.password.message}
                </p>
              )}
              <PasswordStrengthMeter
                id="register-password-strength"
                password={password}
              />
            </div>

            <div>
              <label
                htmlFor="register-confirm-password"
                className="text-sm font-semibold text-gray-800"
              >
                Confirmar contraseña <span className="text-[#00A0B7]">*</span>
              </label>
              <PasswordInput
                id="register-confirm-password"
                autoComplete="new-password"
                className={`mt-2 ${INPUT_CLASS}`}
                placeholder="Repite la contraseña"
                {...register("confirmPassword", {
                  required: "Confirma tu contraseña",
                  validate: (value) =>
                    value === watch("password") ||
                    "Las contraseñas no coinciden",
                })}
              />
              {errors.confirmPassword ? (
                <p role="alert" className="mt-1.5 text-sm text-red-500">
                  {errors.confirmPassword.message}
                </p>
              ) : (
                passwordsMatch && (
                  <p
                    aria-live="polite"
                    className="mt-1.5 flex items-center gap-1.5 text-sm text-green-700"
                  >
                    <ShieldCheck className="h-4 w-4" aria-hidden="true" />
                    Las contraseñas coinciden
                  </p>
                )
              )}
            </div>
          </>
        )}

        {isAdminMode && (
          <div className="rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-800">
            Se generará una contraseña temporal y se enviará al correo indicado.
            El usuario deberá cambiarla en su primer inicio de sesión.
          </div>
        )}

        <FormErrorBanner message={errorMessage} />
      </div>

      <div className="border-t border-gray-100 bg-gray-50/80 px-5 py-4 sm:px-8">
        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onBack}
            className={`${SECONDARY_BUTTON_CLASS} sm:w-auto`}
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Anterior
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className={`${PRIMARY_BUTTON_CLASS} sm:w-auto`}
          >
            {isSubmitting ? "Registrando..." : "Registrarse"}
          </button>
        </div>
      </div>
    </form>
  );
}
