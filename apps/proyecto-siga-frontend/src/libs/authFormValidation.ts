import { MINIMUM_REGISTRATION_AGE } from "@packages/common-schemas/age";

const MINIMUM_PASSWORD_LENGTH = 10;
const MINIMUM_PASSWORD_CHARACTER_CLASSES = 3;

function calculateAge(birthDate: Date): number {
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const hasNotHadBirthday =
    today.getMonth() < birthDate.getMonth() ||
    (today.getMonth() === birthDate.getMonth() &&
      today.getDate() < birthDate.getDate());

  if (hasNotHadBirthday) age -= 1;
  return age;
}

export function validateMinimumAge(value: string | undefined): string | true {
  if (!value) return true;

  const birthDate = new Date(value);
  if (Number.isNaN(birthDate.getTime())) {
    return "Fecha de nacimiento inválida";
  }

  return (
    calculateAge(birthDate) >= MINIMUM_REGISTRATION_AGE ||
    `Debes ser mayor de ${MINIMUM_REGISTRATION_AGE} años para registrarte`
  );
}

export function validatePasswordStrength(value: string | undefined): string | true {
  if (!value) return true;

  let classes = 0;
  if (/[A-Z]/.test(value)) classes++;
  if (/[a-z]/.test(value)) classes++;
  if (/\d/.test(value)) classes++;
  if (/[^A-Za-z0-9]/.test(value)) classes++;

  return (
    classes >= MINIMUM_PASSWORD_CHARACTER_CLASSES ||
    `Combina al menos ${MINIMUM_PASSWORD_CHARACTER_CLASSES} tipos: mayúsculas, minúsculas, números o símbolos`
  );
}

export const passwordRequirements = {
  minLength: MINIMUM_PASSWORD_LENGTH,
  minLengthMessage: `Debe tener al menos ${MINIMUM_PASSWORD_LENGTH} caracteres`,
  helperText: `Mínimo ${MINIMUM_PASSWORD_LENGTH} caracteres, combinando mayúsculas, minúsculas, números o símbolos.`,
  minCharacterClasses: MINIMUM_PASSWORD_CHARACTER_CLASSES,
};

export type PasswordCriterion = {
  id: "length" | "uppercase" | "lowercase" | "number" | "symbol";
  label: string;
  met: boolean;
};

/**
 * Estado de cada criterio de contraseña para mostrarlo en tiempo real.
 * Comparte las mismas reglas que `validatePasswordStrength` y `minLength`,
 * para que el medidor visual y la validación del formulario no se contradigan.
 */
export function evaluatePasswordCriteria(value: string): PasswordCriterion[] {
  return [
    {
      id: "length",
      label: `Al menos ${MINIMUM_PASSWORD_LENGTH} caracteres`,
      met: value.length >= MINIMUM_PASSWORD_LENGTH,
    },
    { id: "uppercase", label: "Una mayúscula", met: /[A-Z]/.test(value) },
    { id: "lowercase", label: "Una minúscula", met: /[a-z]/.test(value) },
    { id: "number", label: "Al menos un número", met: /\d/.test(value) },
    {
      id: "symbol",
      label: "Al menos un símbolo (!@#$…)",
      met: /[^A-Za-z0-9]/.test(value),
    },
  ];
}

export function getMaxBirthDateForMinimumAge(): string {
  const date = new Date();
  date.setFullYear(date.getFullYear() - MINIMUM_REGISTRATION_AGE);
  return date.toISOString().split("T")[0];
}
