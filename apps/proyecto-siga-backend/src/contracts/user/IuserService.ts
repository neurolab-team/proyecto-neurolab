
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



export interface IUserService {
  getUsers(): Promise<User[]>
  getUserById(id: string): Promise<User | null>
  createUser(input: CreateUserInput): Promise<User>
  // updateUser(id: string, input: UpdateUserInput): Promise<User> //not implemented yet
  deactivateUser(id: string): Promise<void>
  activateUser(id: string): Promise<void>
  checkEmailAvailable(email: string, excludeId?: string): Promise<boolean>
  verifyEmail(token: string,email:string): Promise<void>
  // requestPasswordReset(email: string): Promise<void>
  // resetPassword(token: string, newPassword: string): Promise<void>
  // resendActivation(email: string): Promise<void>
  checkUnverifiedAccount(email: string): Promise<boolean>
}