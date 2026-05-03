import {
  AssignPsychologistInput,
  CreateUserInput,
  UpdateUserRoleInput,
  User,
} from "@packages/common-types/user.types"
import {
  PsychologistStudentResultsFilters,
  PsychologistStudentResultsResponse,
  PsychologistStudentProfile,
  PsychologistStudentSummary,
} from "@packages/common-types/psychologist.types";

export interface IUserService {
  getUsers(): Promise<User[]>
  getUserById(id: string): Promise<User | null>
  createUser(input: CreateUserInput): Promise<User>
  createUserByAdmin(input: CreateUserInput): Promise<User>
  updateUserRole(id: string, input: UpdateUserRoleInput): Promise<User>
  assignPsychologistToUser(
    targetUserId: string,
    input: AssignPsychologistInput,
  ): Promise<User>
  getPsychologistStudents(psychologistId: string): Promise<PsychologistStudentSummary[]>
  getPsychologistStudentById(
    psychologistId: string,
    studentId: string,
  ): Promise<PsychologistStudentProfile | null>
  getPsychologistStudentResults(
    psychologistId: string,
    filters: PsychologistStudentResultsFilters,
  ): Promise<PsychologistStudentResultsResponse>
  deactivateUser(id: string): Promise<void>
  activateUser(id: string): Promise<void>
  checkEmailAvailable(email: string, excludeId?: string): Promise<boolean>
  verifyEmail(token: string): Promise<void>
  resendVerificationEmail(email: string): Promise<void>
  // requestPasswordReset(email: string): Promise<void>
  // resetPassword(token: string, newPassword: string): Promise<void>
  // resendActivation(email: string): Promise<void>
  checkUnverifiedAccount(email: string): Promise<boolean>
}
