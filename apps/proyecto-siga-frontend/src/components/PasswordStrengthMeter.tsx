import { Check, X } from "lucide-react";
import {
  evaluatePasswordCriteria,
  passwordRequirements,
} from "../libs/authFormValidation";

interface PasswordStrengthMeterProps {
  password: string;
  /** Se enlaza con `aria-describedby` del input de contraseña. */
  id?: string;
}

// Un nivel por cada puntaje posible (0 a 5 criterios cumplidos).
const STRENGTH_LEVELS = [
  { label: "Muy débil", bar: "bg-red-500", text: "text-red-600" },
  { label: "Muy débil", bar: "bg-red-500", text: "text-red-600" },
  { label: "Débil", bar: "bg-orange-500", text: "text-orange-600" },
  { label: "Aceptable", bar: "bg-yellow-500", text: "text-yellow-700" },
  { label: "Fuerte", bar: "bg-lime-500", text: "text-lime-700" },
  { label: "Muy fuerte", bar: "bg-green-600", text: "text-green-700" },
];

/**
 * Medidor de fuerza de contraseña con los criterios visibles y actualizados
 * en tiempo real. El puntaje es la cantidad de criterios cumplidos (0 a 5).
 */
export default function PasswordStrengthMeter({
  password,
  id,
}: PasswordStrengthMeterProps) {
  const criteria = evaluatePasswordCriteria(password);
  const score = criteria.filter((criterion) => criterion.met).length;
  const level = STRENGTH_LEVELS[score];
  const hasInput = password.length > 0;

  return (
    <div id={id} className="mt-3 rounded-xl bg-gray-50 p-3">
      <div className="flex items-center justify-between gap-3">
        <span className="text-xs font-semibold text-gray-600">
          Fuerza de la contraseña
        </span>
        <span
          aria-live="polite"
          className={`text-xs font-bold ${hasInput ? level.text : "text-gray-400"}`}
        >
          {hasInput ? level.label : "Sin evaluar"}
        </span>
      </div>

      <div
        className="mt-2 flex gap-1.5"
        role="progressbar"
        aria-label="Fuerza de la contraseña"
        aria-valuemin={0}
        aria-valuemax={criteria.length}
        aria-valuenow={score}
        aria-valuetext={hasInput ? level.label : "Sin evaluar"}
      >
        {criteria.map((criterion, index) => (
          <span
            key={criterion.id}
            className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${
              hasInput && index < score ? level.bar : "bg-gray-200"
            }`}
          />
        ))}
      </div>

      <ul className="mt-3 grid grid-cols-1 gap-1.5 sm:grid-cols-2">
        {criteria.map((criterion) => (
          <li
            key={criterion.id}
            className={`flex items-center gap-1.5 text-xs transition-colors ${
              criterion.met ? "text-green-700" : "text-gray-500"
            }`}
          >
            {criterion.met ? (
              <Check className="h-3.5 w-3.5 flex-shrink-0" aria-hidden="true" />
            ) : (
              <X className="h-3.5 w-3.5 flex-shrink-0" aria-hidden="true" />
            )}
            <span>{criterion.label}</span>
            <span className="sr-only">
              {criterion.met ? "(cumplido)" : "(pendiente)"}
            </span>
          </li>
        ))}
      </ul>

      <p className="mt-2 text-[11px] text-gray-500">
        Necesitas la longitud mínima y al menos{" "}
        {passwordRequirements.minCharacterClasses} de los otros criterios.
      </p>
    </div>
  );
}
