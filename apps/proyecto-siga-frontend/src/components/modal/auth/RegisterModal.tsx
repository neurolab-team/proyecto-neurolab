import { useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { UserRole } from "@packages/common-types/user.types";
import { usersService } from "../../../services/users/users";
import ModalShell from "../core/ModalShell";
import { getApiErrorMessage } from "../../../libs/getApiErrorMessage";
import { RegisterFormData } from "./registerForm";
import RegisterPersonalInfoView from "./views/RegisterPersonalInfoView";
import RegisterAccessDataView from "./views/RegisterAccessDataView";
import RegisterSuccessView from "./views/RegisterSuccessView";

interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  isAdminMode?: boolean;
  onSuccess?: () => void;
}

type RegisterStep = "personal" | "access" | "success";

const STEP_HEADINGS: Record<"personal" | "access", string> = {
  personal: "Paso 1 de 2: Información Personal",
  access: "Paso 2 de 2: Datos de Acceso",
};

/**
 * Contenedor del registro. Orquesta un flujo progresivo de dos pasos
 * (información personal → datos de acceso) más un estado de éxito, y delega
 * cada pantalla a una vista presentacional en `./views`.
 *
 * El estado del formulario vive en un único `useForm`, así volver al paso
 * anterior no pierde lo ya escrito.
 */
export default function RegisterModal({
  isOpen,
  onClose,
  isAdminMode = false,
  onSuccess,
}: RegisterModalProps) {
  const [step, setStep] = useState<RegisterStep>("personal");
  const [registeredEmail, setRegisteredEmail] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    trigger,
    formState: { errors },
  } = useForm<RegisterFormData>({
    // Valida al salir del campo y luego en cada cambio: el usuario ve el error
    // sin que aparezca mientras aún está escribiendo por primera vez.
    mode: "onTouched",
    // Sin tipo de usuario por defecto: debe elegirlo explícitamente, para no
    // registrar a nadie con un tipo que no seleccionó.
    defaultValues: {
      role: isAdminMode ? "psychologist" : undefined,
    },
  });

  const personalStepFields: (keyof RegisterFormData)[] = isAdminMode
    ? ["userType", "role", "name", "userNumber", "gender"]
    : ["userType", "name", "userNumber", "semester", "birthDate", "gender", "acceptedDataPolicy"];

  const signupMutation = useMutation({
    mutationFn: async (data: RegisterFormData) => {
      // confirmPassword y confirmEmail solo validan el formulario: nunca viajan
      // al backend.
      const {
        confirmPassword: _confirmPassword,
        confirmEmail: _confirmEmail,
        ...payload
      } = data;
      // Si eligió estudiante, escribió el semestre y luego cambió de tipo, no
      // se envía: el backend guarda "N/A".
      if (payload.userType !== "itmStudent") delete payload.semester;

      if (isAdminMode) {
        return usersService.create({
          ...payload,
          role: (payload.role || "user") as UserRole,
        });
      }

      return usersService.register(payload);
    },
    onSuccess: (_response, variables) => {
      setRegisteredEmail(variables.email.trim());
      setStep("success");
      onSuccess?.();
    },
  });

  const handleNext = async () => {
    const isStepValid = await trigger(personalStepFields, {
      shouldFocus: true,
    });
    if (isStepValid) setStep("access");
  };

  const handleFinalSubmit = handleSubmit(
    (data) => {
      signupMutation.mutate(data);
    },
    (validationErrors) => {
      // Si algo del paso 1 quedó inválido (por ejemplo, tras editar y volver),
      // se regresa a ese paso para que el campo con error sea visible.
      const hasPersonalStepError = personalStepFields.some(
        (field) => validationErrors[field],
      );
      if (hasPersonalStepError) setStep("personal");
    },
  );

  if (!isOpen) return null;

  return (
    <ModalShell
      isOpen={isOpen}
      onClose={onClose}
      backdropClassName="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-2 sm:p-4"
      panelClassName="relative flex max-h-[95vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl sm:max-h-[90vh] sm:rounded-3xl"
      closeButtonClassName="absolute right-3 top-3 z-10 rounded-full p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 sm:right-4 sm:top-4"
    >
      {step !== "success" && (
        <div className="border-b border-gray-100 px-5 pb-4 pt-6 sm:px-8">
          <div className="flex flex-col gap-3 pr-8 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex items-center gap-3">
              <div>
                <h2 className="text-lg font-bold leading-tight text-[#102D69] sm:text-xl">
                  {isAdminMode
                    ? "Crear Cuenta de Usuario"
                    : "Registra tu cuenta"}
                </h2>
                <p className="text-xs text-gray-500">
                  Instituto Tecnológico Metropolitano
                </p>
              </div>
            </div>

            <p className="text-xs font-semibold text-[#2a4d8f] sm:whitespace-nowrap sm:text-right">
              {STEP_HEADINGS[step]}
            </p>
          </div>

          <div
            className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-gray-100"
            role="progressbar"
            aria-label="Progreso del registro"
            aria-valuemin={1}
            aria-valuemax={2}
            aria-valuenow={step === "personal" ? 1 : 2}
            aria-valuetext={STEP_HEADINGS[step]}
          >
            <span
              className="block h-full rounded-full bg-gradient-to-r from-[#102D69] to-[#00A0B7] transition-all duration-300"
              style={{ width: step === "personal" ? "50%" : "100%" }}
            />
          </div>
        </div>
      )}

      {step === "personal" && (
        <RegisterPersonalInfoView
          register={register}
          errors={errors}
          userType={watch("userType")}
          isAdminMode={isAdminMode}
          onNext={handleNext}
        />
      )}

      {step === "access" && (
        <RegisterAccessDataView
          register={register}
          errors={errors}
          watch={watch}
          isAdminMode={isAdminMode}
          onBack={() => setStep("personal")}
          onSubmit={handleFinalSubmit}
          isSubmitting={signupMutation.isPending}
          errorMessage={
            signupMutation.isError
              ? getApiErrorMessage(
                  signupMutation.error,
                  "No fue posible completar el registro.",
                )
              : null
          }
        />
      )}

      {step === "success" && (
        <RegisterSuccessView
          email={registeredEmail}
          isAdminMode={isAdminMode}
          onAcknowledge={onClose}
        />
      )}
    </ModalShell>
  );
}
