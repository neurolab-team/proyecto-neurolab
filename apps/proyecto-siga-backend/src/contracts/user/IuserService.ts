import { User,CreateUserInput } from "@packages/common-types/user.types"
export interface IUserService {
  getUsers(): Promise<User[]>
  getUserById(id: string): Promise<User | null>
  createUser(input: CreateUserInput): Promise<User>
  createUserByAdmin(input: CreateUserInput): Promise<User>
  // updateUser(id: string, input: UpdateUserInput): Promise<User> //not implemented yet
  deactivateUser(id: string): Promise<void>
  activateUser(id: string): Promise<void>
  checkEmailAvailable(email: string, excludeId?: string): Promise<boolean>
  verifyEmail(token: string): Promise<void>
  // requestPasswordReset(email: string): Promise<void>
  // resetPassword(token: string, newPassword: string): Promise<void>
  // resendActivation(email: string): Promise<void>
  checkUnverifiedAccount(email: string): Promise<boolean>
}