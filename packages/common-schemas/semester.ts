/**
 * Semestre académico del usuario.
 *
 * Solo aplica a estudiantes ITM (`userType = "itmStudent"`), que lo informan
 * en el registro con un valor entre MIN_SEMESTER y MAX_SEMESTER. Para
 * empleados, externos y cuentas de staff se guarda NOT_APPLICABLE_SEMESTER en
 * lugar de null, para distinguir "no aplica" de "dato faltante".
 *
 * Como `age.ts`, vive en el paquete compartido para que el esquema Zod, el
 * servicio de registro y el formulario usen la misma regla.
 */

export const NOT_APPLICABLE_SEMESTER = "N/A";
export const MIN_SEMESTER = 1;
export const MAX_SEMESTER = 10;

export const SEMESTER_OPTIONS: string[] = Array.from(
  { length: MAX_SEMESTER - MIN_SEMESTER + 1 },
  (_, index) => String(MIN_SEMESTER + index),
);

export function isValidStudentSemester(value?: string | null): boolean {
  return !!value && SEMESTER_OPTIONS.includes(value.trim());
}

/** Semestre a guardar: el informado si es estudiante ITM, "N/A" en otro caso. */
export function resolveSemester(userType: string, semester?: string | null): string {
  return userType === "itmStudent" && semester
    ? semester.trim()
    : NOT_APPLICABLE_SEMESTER;
}
