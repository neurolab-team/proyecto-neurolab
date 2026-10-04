import { UserRole, UserType } from "@packages/common-types/user.types";
import type { SegmentedOption } from "../../SegmentedControl";

export type RegisterFormData = {
  userType: UserType;
  name: string;
  email: string;
  /** Solo para validación en el formulario; no se envía al backend. */
  confirmEmail?: string;
  userNumber: string;
  /** Solo se pide a estudiantes ITM; el backend guarda "N/A" para el resto. */
  semester?: string;
  gender?: string;
  birthDate: string;
  password?: string;
  /** Solo para validación en el formulario; no se envía al backend. */
  confirmPassword?: string;
  role?: UserRole;
  acceptedDataPolicy?: boolean;
};

export const INPUT_CLASS =
  "w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-3 text-gray-800 transition-all placeholder:text-gray-400 focus:border-[#2a4d8f] focus:outline-none focus:ring-2 focus:ring-[#2a4d8f]/30";

export const PRIMARY_BUTTON_CLASS =
  "inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#001d4e] via-[#102D69] to-[#2a4d8f] px-6 py-3 font-bold text-white shadow-lg transition-all hover:shadow-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2a4d8f] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50";

export const SECONDARY_BUTTON_CLASS =
  "inline-flex items-center justify-center gap-2 rounded-xl border-2 border-gray-300 bg-white px-6 py-3 font-semibold text-gray-600 transition-all hover:border-gray-400 hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2a4d8f] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-40";

export const USER_TYPE_OPTIONS: SegmentedOption[] = [
  {
    value: "itmStudent",
    label: "Estudiante ITM",
    helper: "@correo.itm.edu.co",
  },
  { value: "itmEmployee", label: "Empleado ITM", helper: "@itm.edu.co" },
  //{ value: "external", label: "Usuario externo", helper: "Cualquier correo" },
];

export const GENDER_OPTIONS: SegmentedOption[] = [
  { value: "M", label: "Masculino" },
  { value: "F", label: "Femenino" },
  { value: "O", label: "Otro" },
];

export const ROLE_OPTIONS: SegmentedOption[] = [
  { value: "psychologist", label: "Psicólogo" },
  { value: "admin", label: "Administrador" },
];

const EMAIL_DOMAIN_BY_USER_TYPE: Record<UserType, string | null> = {
  itmStudent: "@correo.itm.edu.co",
  itmEmployee: "@itm.edu.co",
  external: null,
};

export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function getEmailDomainForUserType(userType: UserType): string | null {
  return EMAIL_DOMAIN_BY_USER_TYPE[userType] ?? null;
}

/** Dominio institucional obligatorio según el tipo de usuario elegido. */
export function validateEmailForUserType(
  email: string | undefined,
  userType: UserType,
): string | true {
  const domain = getEmailDomainForUserType(userType);
  if (!email || !domain) return true;
  if (email.trim().toLowerCase().endsWith(domain)) return true;

  return userType === "itmStudent"
    ? `Los estudiantes deben usar correo ${domain}`
    : `Los empleados deben usar correo ${domain}`;
}

export function getEmailPlaceholderForUserType(userType: UserType): string {
  const domain = getEmailDomainForUserType(userType);
  return domain ? `nombre${domain}` : "nombre@ejemplo.com";
}
