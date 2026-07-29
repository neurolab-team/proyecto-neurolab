/**
 * Edad mínima de registro y utilidades de cálculo de edad.
 *
 * Vive en un paquete compartido a propósito: esta regla se validaba en tres
 * sitios con tres copias distintas del mismo código (el esquema Zod del
 * registro, el servicio de registro del backend y la validación del formulario
 * del frontend). Cambiar el número en uno solo dejaba el sistema incoherente:
 * el formulario aceptaba al usuario y el backend lo rechazaba después.
 *
 * Cualquier ajuste del límite de edad se hace aquí y solo aquí.
 */

export const MINIMUM_REGISTRATION_AGE = 16;

/**
 * Calcula la edad en años completos. Devuelve null si no hay fecha o si es
 * inválida, para que quien llame decida cómo tratar el caso.
 */
export function calculateAge(
  birthDate?: Date | string | null,
): number | null {
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

export function isOfLegalAge(
  birthDate?: Date | string | null,
  minimumAge: number = MINIMUM_REGISTRATION_AGE,
): boolean {
  const age = calculateAge(birthDate);
  return age !== null && age >= minimumAge;
}
