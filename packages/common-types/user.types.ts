export type UserRole = 'admin' | 'psychologist' | 'user'
export type UserType = 'itmStudent' | 'itmEmployee' | 'external'

export interface User {
  userId: string
  userNumber: string
  email: string
  name: string 
  role: UserRole
  userType: UserType
  gender?: string | '' 
  birthDate?: Date
  lastLogin?: Date
  verifiedEmail: boolean
  isActive: boolean
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