import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { usersService } from "../../../services/users/users";
import { notify } from "../../../libs/toastService";
import { UserRole, UserType } from "@packages/common-types/user.types";
import ModalShell from "../core/ModalShell";
import FormErrorBanner from "../../FormErrorBanner";
import { getApiErrorMessage } from "../../../libs/getApiErrorMessage";

type RegisterFormData = {
  userType: UserType;
  name: string;
  email: string;
  userNumber: string;
  gender?: string;
  birthDate: string;
  password?: string;
  role?: UserRole;
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
    formState: { errors },
  } = useForm<RegisterFormData>({
    defaultValues: {
      userType: "external",
    },
  });

  const userType = watch("userType", "external");

  const signupMutation = useMutation({
    mutationFn: async (data: RegisterFormData) => {
      if (isAdminMode) {
        const userData = {
          ...data,
          role: (data.role || "user") as UserRole,
        };
        return usersService.create(userData);
      } else {
        const { ...publicUserData } = data;
        return usersService.register(publicUserData);
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
      backdropClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      panelClassName="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto relative"
      closeButtonClassName="absolute top-4 right-4 text-white hover:text-gray-200 z-10"
    >
      <div className="bg-gradient-to-r from-[#102D69] to-[#00A0B7] text-white p-8 text-center relative">
        <div className="w-20 h-20 bg-white rounded-full mx-auto mb-4 flex items-center justify-center">
          <svg
            className="w-12 h-12 text-[#102D69]"
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
        <h1 className="text-3xl font-bold mb-2">Registro de Usuario</h1>
        <p className="text-blue-100">Sistema de Evaluación Psicológica - ITM</p>
      </div>

      <div className="p-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Tipo de usuario *
            </label>
            <select
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#00A0B7] focus:border-[#00A0B7] transition-all appearance-none bg-white cursor-pointer text-gray-700 font-medium"
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
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#00A0B7] focus:border-[#00A0B7] transition-all appearance-none bg-white cursor-pointer text-gray-700 font-medium"
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
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#00A0B7] focus:border-[#00A0B7] transition-all"
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
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#00A0B7] focus:border-[#00A0B7] transition-all"
              placeholder="Ingresa tu nombre completo"
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Número de identificación *
              </label>
              <input
                type="text"
                {...register("userNumber", {
                  required: "Este campo es obligatorio",
                })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#00A0B7] focus:border-[#00A0B7] transition-all"
                placeholder="123456789"
              />
              {errors.userNumber && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.userNumber.message}
                </p>
              )}
            </div>

            {!isAdminMode && (
              <>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Contraseña
                  </label>
                  {/* Agregar que se pueda mostrar la contraseña */}
                  <input
                    type="password"
                    {...register("password", {
                      required: !isAdminMode
                        ? "Este campo es obligatorio"
                        : false,
                    })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#00A0B7] focus:border-[#00A0B7] transition-all"
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
                    className={`block text-sm font-semibold text-gray-700 ${isAdminMode ? "mb-4" : "mb-2"}`}
                  >
                    Fecha de nacimiento *
                  </label>
                  <input
                    type="date"
                    {...register("birthDate", {
                      required: "Este campo es obligatorio",
                    })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#00A0B7] focus:border-[#00A0B7] transition-all"
                  />
                  {errors.birthDate && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.birthDate.message}
                    </p>
                  )}
                </div>
              </>
            )}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Género
              </label>
              <select
                {...register("gender", {
                  required: "Este campo es obligatorio",
                })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#00A0B7] focus:border-[#00A0B7] transition-all appearance-none bg-white cursor-pointer text-gray-700 font-medium"
              >
                <option value="">Seleccionar</option>
                <option value="M">Masculino</option>
                <option value="F">Femenino</option>
                <option value="O">Otro</option>
              </select>
            </div>
          </div>

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

          <FormErrorBanner message={signupMutation.isError ? getApiErrorMessage(signupMutation.error, 'No fue posible completar el registro.') : null} />

          <button
            type="submit"
            disabled={signupMutation.isPending}
            className="w-full bg-gradient-to-r from-[#102D69] to-[#00A0B7] text-white py-4 rounded-xl font-bold text-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center space-x-2"
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
