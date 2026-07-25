/**
 * Calcula la edad en años completos a partir de una fecha de nacimiento.
 * Retorna null si no hay fecha de nacimiento.
 */
export function calculateAge(birthDate?: Date | string | null): number | null {
  if (!birthDate) return null;

  const parsedBirthDate =
    typeof birthDate === "string" ? new Date(birthDate) : birthDate;

  if (Number.isNaN(parsedBirthDate.getTime())) return null;

  const today = new Date();
  let age = today.getFullYear() - parsedBirthDate.getFullYear();
  const hasNotHadBirthday =
    today.getMonth() < parsedBirthDate.getMonth() ||
    (today.getMonth() === parsedBirthDate.getMonth() &&
      today.getDate() < parsedBirthDate.getDate());

  if (hasNotHadBirthday) age -= 1;
  return age >= 0 ? age : null;
}

export const MINIMUM_REGISTRATION_AGE = 16;

export function isOfLegalAge(
  birthDate?: Date | string | null,
  minimumAge: number = MINIMUM_REGISTRATION_AGE,
): boolean {
  const age = calculateAge(birthDate);
  return age !== null && age >= minimumAge;
}
