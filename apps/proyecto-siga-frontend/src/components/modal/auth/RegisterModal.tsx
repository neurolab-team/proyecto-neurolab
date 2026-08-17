import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import Link from "next/link";
import { usersService } from "../../../services/users/users";
import { notify } from "../../../libs/toastService";
import { UserRole, UserType } from "@packages/common-types/user.types";
import ModalShell from "../core/ModalShell";
import FormErrorBanner from "../../FormErrorBanner";
import PasswordInput from "../../PasswordInput";
import { getApiErrorMessage } from "../../../libs/getApiErrorMessage";
import {
  getMaxBirthDateForMinimumAge,
  passwordRequirements,
  validateMinimumAge,
  validatePasswordStrength,
} from "../../../libs/authFormValidation";

type RegisterFormData = {
  userType: UserType;
  name: string;
  email: string;
  userNumber: string;
  gender?: string;
  birthDate: string;
  password?: string;
  /** Solo para validación en el formulario; no se envía al backend. */
  confirmPassword?: string;
  role?: UserRole;
  acceptedDataPolicy?: boolean;
};

interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  isAdminMode?: boolean;
  onSuccess?: () => void;
}

export default function RegisterModal({
  isOpen,
  onClose,
  isAdminMode = false,
  onSuccess,
}: RegisterModalProps) {

  const validateEmail = (email: string, type: UserType | null) => {
    if (!type) return "";
    if (type === "itmStudent" && !email.endsWith("@correo.itm.edu.co")) {
      return "Los estudiantes deben usar correo @correo.itm.edu.co";
    }
    if (type === "itmEmployee" && !email.endsWith("@itm.edu.co")) {
      return "Los empleados deben usar correo @itm.edu.co";
    }
    return "";
  };
  const {
    register,
    handleSubmit,
    watch,
    getValues,
    formState: { errors },
  } = useForm<RegisterFormData>({
    defaultValues: {
      userType: "external",
    },
  });

  const userType = watch("userType", "external");

  const signupMutation = useMutation({
    mutationFn: async (data: RegisterFormData) => {
      // confirmPassword solo valida el formulario: nunca viaja al backend.
      const { confirmPassword: _confirmPassword, ...payload } = data;

      if (isAdminMode) {
        const userData = {
          ...payload,
          role: (payload.role || "user") as UserRole,
        };
        return usersService.create(userData);
      } else {
        return usersService.register(payload);
      }
    },

    onSuccess: () => {
      notify.success(
        isAdminMode
          ? "Usuario creado. Se envio una contrasena temporal al correo."
          : "Registro completado correctamente.",
      );
      onSuccess?.();
      onClose();
    },
  });

  const onSubmit = (data: RegisterFormData) => {
    signupMutation.mutate(data);
  };

  if (!isOpen) return null;

  return (
    <ModalShell
      isOpen={isOpen}
      onClose={onClose}
      backdropClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 sm:p-4 z-50"
      panelClassName="bg-white rounded-2xl sm:rounded-3xl shadow-2xl w-full max-w-2xl max-h-[95vh] sm:max-h-[90vh] overflow-y-auto relative"
      closeButtonClassName="absolute top-3 right-3 sm:top-4 sm:right-4 text-white hover:text-gray-200 z-10"
    >
      <div className="bg-gradient-to-r from-[#001d4e] via-[#102D69] to-[#2a4d8f] text-white p-6 sm:p-8 text-center relative">
        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white rounded-full mx-auto mb-3 sm:mb-4 flex items-center justify-center">
          <svg
            className="w-10 h-10 sm:w-12 sm:h-12 text-[#102D69]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">
          Registro de Usuario
        </h1>
        <p className="text-sm sm:text-base text-blue-100">
          Sistema de Autoevaluación - ITM
        </p>
      </div>

      <div className="p-4 sm:p-6 lg:p-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Tipo de usuario *
            </label>
            <select
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-opacity-50 focus:ring-[#2a4d8f] focus:border-[#2a4d8f] transition-all appearance-none bg-white cursor-pointer text-gray-700 font-medium"
              {...register("userType", {
                required: "Este campo es obligatorio",
              })}
            >
              <option value="itmStudent">
                Estudiante ITM (@correo.itm.edu.co)
              </option>
              <option value="itmEmployee">Empleado ITM (@itm.edu.co)</option>
              <option value="external">Usuario Externo</option>
            </select>
          </div>

          {isAdminMode && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Rol del usuario *
              </label>
              <select
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-opacity-50 focus:ring-[#2a4d8f] focus:border-[#2a4d8f] transition-all appearance-none bg-white cursor-pointer text-gray-700 font-medium"
                {...register("role", {
                  required: isAdminMode ? "Este campo es obligatorio" : false,
                })}
              >
                <option value="psychologist">Psicólogo</option>
                <option value="admin">Administrador</option>
              </select>
              {errors.role && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.role.message}
                </p>
              )}
            </div>
          )}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Correo electrónico *
              {userType === "itmStudent" && (
                <span className="text-[#00A0B7]"> (@correo.itm.edu.co)</span>
              )}
              {userType === "itmEmployee" && (
                <span className="text-[#00A0B7]"> (@itm.edu.co)</span>
              )}
            </label>
            <input
              type="email"
              {...register("email", {
                required: "Este campo es obligatorio",
                validate: (value) => {
                  const emailError = validateEmail(value, userType);
                  return emailError || true;
                },
              })}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-opacity-50 focus:ring-[#2a4d8f] focus:border-[#2a4d8f] transition-all"
              placeholder={`correo@${userType === "itmStudent" ?
                 "correo.itm.edu.co" : userType === "itmEmployee"
                 ? "itm.edu.co" : "ejemplo.com"}`}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Nombre completo *
            </label>
            <input
              type="text"
              {...register("name", {
                required: "Este campo es obligatorio",
              })}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-opacity-50 focus:ring-[#2a4d8f] focus:border-[#2a4d8f] transition-all"
              placeholder="Ingresa tu nombre completo"
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Número de identificación *
              </label>
              <input
                type="text"
                inputMode="numeric"
                autoComplete="off"
                {...register("userNumber", {
                  required: "Este campo es obligatorio",
                })}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-opacity-50 focus:ring-[#2a4d8f] focus:border-[#2a4d8f] transition-all"
                placeholder="123456789"
              />
              {errors.userNumber && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.userNumber.message}
                </p>
              )}
            </div>

            {!isAdminMode && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Fecha de nacimiento *
                </label>
                <input
                  type="date"
                  max={getMaxBirthDateForMinimumAge()}
                  {...register("birthDate", {
                    required: "Este campo es obligatorio",
                    validate: validateMinimumAge,
                  })}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-opacity-50 focus:ring-[#2a4d8f] focus:border-[#2a4d8f] transition-all"
                />
                {errors.birthDate && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.birthDate.message}
                  </p>
                )}
              </div>
            )}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Género
              </label>
              <select
                {...register("gender", {
                  required: "Este campo es obligatorio",
                })}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-opacity-50 focus:ring-[#2a4d8f] focus:border-[#2a4d8f] transition-all appearance-none bg-white cursor-pointer text-gray-700 font-medium"
              >
                <option value="">Seleccionar</option>
                <option value="M">Masculino</option>
                <option value="F">Femenino</option>
                <option value="O">Otro</option>
              </select>
            </div>
          </div>

          {!isAdminMode && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="register-password"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Contraseña *
                </label>
                <PasswordInput
                  id="register-password"
                  autoComplete="new-password"
                  aria-describedby="register-password-requirements"
                  {...register("password", {
                    required: "Este campo es obligatorio",
                    minLength: {
                      value: passwordRequirements.minLength,
                      message: passwordRequirements.minLengthMessage,
                    },
                    validate: validatePasswordStrength,
                    // Revalida la confirmación al editar la contraseña, para que
                    // no quede un "no coinciden" obsoleto tras corregir arriba.
                    deps: ["confirmPassword"],
                  })}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-opacity-50 focus:ring-[#2a4d8f] focus:border-[#2a4d8f] transition-all"
                  placeholder="********"
                />
                {errors.password && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="register-confirm-password"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Confirmar contraseña *
                </label>
                <PasswordInput
                  id="register-confirm-password"
                  autoComplete="new-password"
                  {...register("confirmPassword", {
                    required: "Confirma tu contraseña",
                    validate: (value) =>
                      value === getValues("password") ||
                      "Las contraseñas no coinciden",
                  })}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-opacity-50 focus:ring-[#2a4d8f] focus:border-[#2a4d8f] transition-all"
                  placeholder="********"
                />
                {errors.confirmPassword && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>

              <p
                id="register-password-requirements"
                className="sm:col-span-2 text-xs text-gray-500"
              >
                {passwordRequirements.helperText} Usa el ícono del ojo para
                verificar lo que escribiste.
              </p>
            </div>
          )}

          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border-2 border-blue-200 rounded-xl p-4">
            <div className="flex items-start space-x-3">
              <svg
                className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p className="text-sm text-blue-800">
                <strong>Nota:</strong>{" "}
                {isAdminMode
                  ? "Se generará una contraseña temporal "
                  : "Se generará un link de verificación "}
                que será enviada a tu correo electrónico.
              </p>
            </div>
          </div>

          {!isAdminMode && (
            <div>
              <label className="flex items-start space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  {...register("acceptedDataPolicy", {
                    required:
                      "Debes aceptar la política de tratamiento de datos personales",
                  })}
                  className="mt-1 h-5 w-5 rounded border-2 border-gray-300 text-[#102D69] focus:ring-[#2a4d8f] cursor-pointer"
                />
                <span className="text-sm text-gray-700">
                  He leído y acepto la{" "}
                  <Link
                    href="/data-protection-policy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-[#102D69] underline hover:text-[#2a4d8f]"
                  >
                    Política de Tratamiento de Datos Personales
                  </Link>
                  , y autorizo el tratamiento de mis datos, incluyendo los
                  resultados de las pruebas de autoevaluación, conforme a la
                  Ley 1581 de 2012. *
                </span>
              </label>
              {errors.acceptedDataPolicy && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.acceptedDataPolicy.message}
                </p>
              )}
            </div>
          )}

          <FormErrorBanner message={signupMutation.isError ? getApiErrorMessage(signupMutation.error, 'No fue posible completar el registro.') : null} />

          <button
            type="submit"
            disabled={signupMutation.isPending}
            className="w-full bg-gradient-to-r from-[#001d4e] via-[#102D69] to-[#2a4d8f] text-white py-3.5 sm:py-4 rounded-xl font-bold text-base sm:text-lg hover:shadow-2xl transform hover:scale-[1.02] transition-all duration-300 flex items-center justify-center space-x-2"
          >
            <span>
              {signupMutation.isPending ? "Cargando..." : "Registrarse"}
            </span>
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </button>
        </form>
      </div>
    </ModalShell>
  );
}
