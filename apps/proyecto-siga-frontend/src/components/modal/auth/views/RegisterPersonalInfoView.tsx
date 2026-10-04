import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import type { FieldErrors, UseFormRegister } from "react-hook-form";
import { UserType } from "@packages/common-types/user.types";
import { SEMESTER_OPTIONS } from "@packages/common-schemas/semester";
import SegmentedControl from "../../../SegmentedControl";
import {
  GENDER_OPTIONS,
  INPUT_CLASS,
  PRIMARY_BUTTON_CLASS,
  RegisterFormData,
  ROLE_OPTIONS,
  SECONDARY_BUTTON_CLASS,
  USER_TYPE_OPTIONS,
} from "../registerForm";
import { getMaxBirthDateForMinimumAge, validateMinimumAge } from "../../../../libs/authFormValidation";

interface RegisterPersonalInfoViewProps {
  register: UseFormRegister<RegisterFormData>;
  errors: FieldErrors<RegisterFormData>;
  /** Tipo de usuario elegido; el semestre solo se pide a estudiantes ITM. */
  userType: UserType;
  isAdminMode: boolean;
  /** Valida los campos del paso y avanza al paso 2. */
  onNext: () => void;
}

/**
 * Paso 1 del registro: datos personales. Las selecciones cortas (tipo de
 * usuario, rol y género) usan controles segmentados para elegir con un solo
 * clic, sin abrir desplegables.
 */
export default function RegisterPersonalInfoView({
  register,
  errors,
  userType,
  isAdminMode,
  onNext,
}: RegisterPersonalInfoViewProps) {
  const showSemester = !isAdminMode && userType === "itmStudent";

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        onNext();
      }}
      className="flex min-h-0 flex-1 flex-col"
    >
      <div className="flex-1 space-y-6 overflow-y-auto px-5 py-6 sm:px-8">
        <SegmentedControl
          legend="Tipo de usuario"
          hint="Define el correo institucional que debes usar."
          required
          options={USER_TYPE_OPTIONS}
          registration={register("userType", {
            required: "Selecciona el tipo de usuario",
          })}
          error={errors.userType?.message}
        />

        {isAdminMode && (
          <SegmentedControl
            legend="Rol del usuario"
            required
            columnsClassName="grid-cols-2"
            options={ROLE_OPTIONS}
            registration={register("role", {
              required: "Selecciona el rol del usuario",
            })}
            error={errors.role?.message}
          />
        )}

        <div>
          <label
            htmlFor="register-name"
            className="text-sm font-semibold text-gray-800"
          >
            Nombre Completo <span className="text-[#00A0B7]">*</span>
          </label>
          <p className="mt-0.5 text-xs text-gray-500">
            Escríbelo como aparece en tu documento de identidad.
          </p>
          <input
            id="register-name"
            type="text"
            autoComplete="name"
            className={`mt-2 ${INPUT_CLASS}`}
            placeholder="Ana María Restrepo Gómez"
            {...register("name", { required: "Este campo es obligatorio" })}
          />
          {errors.name && (
            <p role="alert" className="mt-1.5 text-sm text-red-500">
              {errors.name.message}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <label
              htmlFor="register-user-number"
              className="text-sm font-semibold text-gray-800"
            >
              Número de identificación <span className="text-[#00A0B7]">*</span>
            </label>
            <p className="mt-0.5 text-xs text-gray-500">
              Solo números, sin puntos ni espacios.
            </p>
            <input
              id="register-user-number"
              type="text"
              inputMode="numeric"
              autoComplete="off"
              className={`mt-2 ${INPUT_CLASS}`}
              placeholder="1023456789"
              {...register("userNumber", {
                required: "Este campo es obligatorio",
                pattern: {
                  value: /^\d+$/,
                  message: "Ingresa solo números",
                },
              })}
            />
            {errors.userNumber && (
              <p role="alert" className="mt-1.5 text-sm text-red-500">
                {errors.userNumber.message}
              </p>
            )}
          </div>

          {!isAdminMode && (
            <div>
              <label
                htmlFor="register-birth-date"
                className="text-sm font-semibold text-gray-800"
              >
                Fecha de nacimiento <span className="text-[#00A0B7]">*</span>
              </label>
              <p className="mt-0.5 text-xs text-gray-500">
                Se usa para interpretar tus resultados.
              </p>
              <input
                id="register-birth-date"
                type="date"
                max={getMaxBirthDateForMinimumAge()}
                className={`mt-2 ${INPUT_CLASS}`}
                {...register("birthDate", {
                  required: "Este campo es obligatorio",
                  validate: validateMinimumAge,
                })}
              />
              {errors.birthDate && (
                <p role="alert" className="mt-1.5 text-sm text-red-500">
                  {errors.birthDate.message}
                </p>
              )}
            </div>
          )}
        </div>

        {showSemester && (
          <div>
            <label
              htmlFor="register-semester"
              className="text-sm font-semibold text-gray-800"
            >
              Semestre actual <span className="text-[#00A0B7]">*</span>
            </label>
            <p className="mt-0.5 text-xs text-gray-500">
              El semestre que estás cursando en el ITM.
            </p>
            <select
              id="register-semester"
              className={`mt-2 ${INPUT_CLASS}`}
              defaultValue=""
              {...register("semester", {
                validate: (value, formValues) =>
                  formValues.userType !== "itmStudent" ||
                  !!value ||
                  "Selecciona tu semestre",
              })}
            >
              <option value="" disabled>
                Selecciona un semestre
              </option>
              {SEMESTER_OPTIONS.map((semester) => (
                <option key={semester} value={semester}>
                  {semester}.º semestre
                </option>
              ))}
            </select>
            {errors.semester && (
              <p role="alert" className="mt-1.5 text-sm text-red-500">
                {errors.semester.message}
              </p>
            )}
          </div>
        )}

        <SegmentedControl
          legend="Género"
          required
          options={GENDER_OPTIONS}
          registration={register("gender", {
            required: "Selecciona una opción",
          })}
          error={errors.gender?.message}
        />
      </div>

      <div className="border-t border-gray-100 bg-gray-50/80 px-5 py-4 sm:px-8">
        {!isAdminMode && (
          <div className="mb-4">
            <label className="flex cursor-pointer items-start gap-3">
              <input
                type="checkbox"
                className="mt-0.5 h-5 w-5 flex-shrink-0 cursor-pointer rounded border-2 border-gray-300 text-[#102D69] focus:ring-[#2a4d8f]"
                {...register("acceptedDataPolicy", {
                  required:
                    "Debes aceptar la política de tratamiento de datos personales",
                })}
              />
              <span className="text-xs leading-relaxed text-gray-600">
                He leído y acepto la{" "}
                <Link
                  href="/data-protection-policy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-[#102D69] underline hover:text-[#2a4d8f]"
                >
                  Política de Tratamiento de Datos Personales
                </Link>
                , y autorizo el tratamiento de mis datos, incluidos los
                resultados de las pruebas de autoevaluación, conforme a la Ley
                1581 de 2012. <span className="text-[#00A0B7]">*</span>
              </span>
            </label>
            {errors.acceptedDataPolicy && (
              <p role="alert" className="mt-1.5 text-sm text-red-500">
                {errors.acceptedDataPolicy.message}
              </p>
            )}
          </div>
        )}

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            disabled
            className={`${SECONDARY_BUTTON_CLASS} sm:w-auto`}
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Anterior
          </button>
          <button type="submit" className={`${PRIMARY_BUTTON_CLASS} sm:w-auto`}>
            Siguiente
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </div>
    </form>
  );
}
