const MINIMUM_REGISTRATION_AGE = 18;
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
};

export function getMaxBirthDateForMinimumAge(): string {
  const date = new Date();
  date.setFullYear(date.getFullYear() - MINIMUM_REGISTRATION_AGE);
  return date.toISOString().split("T")[0];
}
