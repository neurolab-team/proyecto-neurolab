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
  gender?: string | '' 
  birthDate?: Date | string
  lastLogin?: Date | string
  verifiedEmail: boolean
  isActive: boolean
  mustChangePassword: boolean
  passwordChangedAt?: Date | string | null
  assignedPsychologistId?: string | null
  assignedPsychologist?: BasicUserReference | null
  assignedPsychologistAt?: Date | string | null
  followUpAt?: Date | string | null
}

export interface CreateUserInput {
  email: string
  name?: string
  userNumber: string
  gender?: string | '' 
  birthDate?: string
  role: UserRole
  userType: UserType
  password?: string
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
};
