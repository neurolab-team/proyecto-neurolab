import { Check, Mail } from "lucide-react";
import { PRIMARY_BUTTON_CLASS } from "../registerForm";

interface RegisterSuccessViewProps {
  /** Correo con el que quedó registrada la cuenta. */
  email: string;
  isAdminMode: boolean;
  onAcknowledge: () => void;
}

/**
 * Estado final del registro: sin campos de formulario. Confirma el envío del
 * correo y repite la dirección exacta a la que se envió.
 */
export default function RegisterSuccessView({
  email,
  isAdminMode,
  onAcknowledge,
}: RegisterSuccessViewProps) {
  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="flex-1 overflow-y-auto px-6 py-10 text-center sm:px-10">
        <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-green-100">
          <Check
            className="h-14 w-14 text-green-600"
            strokeWidth={3}
            aria-hidden="true"
          />
        </div>

        <h2 className="mt-6 text-2xl font-bold text-[#102D69] sm:text-3xl">
          ¡Registro Exitoso!
        </h2>

        <p className="mx-auto mt-3 max-w-md text-gray-600">
          {isAdminMode
            ? "La cuenta fue creada. Revisa el correo para obtener la contraseña temporal."
            : "Ya casi terminas. Revisa tu correo electrónico y abre el enlace de verificación para activar tu cuenta."}
        </p>

        <div className="mx-auto mt-6 flex max-w-md items-center gap-3 rounded-xl border border-blue-200 bg-blue-50 px-4 py-4 text-left">
          <Mail
            className="h-7 w-7 flex-shrink-0 text-[#102D69]"
            aria-hidden="true"
          />
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-blue-700">
              Correo enviado a
            </p>
            <p className="break-all font-bold text-[#102D69]">{email}</p>
          </div>
        </div>

        <p className="mx-auto mt-4 max-w-md text-xs text-gray-500">
          Si no lo encuentras en la bandeja de entrada, revisa la carpeta de
          spam o correo no deseado.
        </p>
      </div>

      <div className="border-t border-gray-100 bg-gray-50/80 px-5 py-4 sm:px-8">
        <div className="flex justify-center">
          <button
            type="button"
            onClick={onAcknowledge}
            className={PRIMARY_BUTTON_CLASS}
          >
            Entendido / Ir al Correo
          </button>
        </div>
      </div>
    </div>
  );
}
