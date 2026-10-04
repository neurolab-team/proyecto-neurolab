export type UserRole = 'admin' | 'psychologist' | 'user'
export type UserType = 'itmStudent' | 'itmEmployee' | 'external'

export interface BasicUserReference {
  userId: string
  name: string
  email: string
}

export interface User {
  userId: string
  userNumber: string
  email: string
  name: string 
  role: UserRole
  userType: UserType
  /** "1".."10" para estudiantes ITM; "N/A" para el resto. */
  semester: string
  gender?: string | '' 
  birthDate?: Date | string
  lastLogin?: Date | string
  verifiedEmail: boolean
  isActive: boolean
  mustChangePassword: boolean
  passwordChangedAt?: Date | string | null
  dataPolicyAcceptedAt?: Date | string | null
  assignedPsychologistId?: string | null
  assignedPsychologist?: BasicUserReference | null
  assignedPsychologistAt?: Date | string | null
  followUpAt?: Date | string | null
  /**
   * true mientras haya que mostrarle el modal de la encuesta externa de
   * usabilidad (ya completó las 3 pruebas de sueño y no ha hecho clic en el
   * link todavía). false si no aplica o ya la abrió.
   */
  usabilitySurveyPending?: boolean
}

export interface CreateUserInput {
  email: string
  name?: string
  userNumber: string
  gender?: string | '' 
  birthDate?: string
  role: UserRole
  userType: UserType
  /** Solo para estudiantes ITM; en otro caso se guarda "N/A". */
  semester?: string
  password?: string
  acceptedDataPolicy?: boolean
}

export interface UpdateUserInput {
  email?: string
  name?: string
  role?: UserRole
}

export interface UpdateUserRoleInput {
  role: UserRole
}

export interface AssignPsychologistInput {
  psychologistId: string | null
}

export type userResponse = {
  userId?: string;
  userNumber: string;
  email: string;
  name: string;
  role: string;
  isActive: boolean;
  gender: string;
  assignedPsychologistId?: string | null;
  assignedPsychologist?: BasicUserReference | null;
  assignedPsychologistAt?: Date | string | null;
  mustChangePassword?: boolean;
  mustChangePasswordReason?: string | null;
};
