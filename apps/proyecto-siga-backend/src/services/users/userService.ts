import { inject, injectable } from "tsyringe";
import {
  AssignPsychologistInput,
  CreateUserInput,
  UpdateUserRoleInput,
  User,
} from "@packages/common-types/user.types";
import {
  PsychologistStudentResultsFilters,
  PsychologistStudentResultsResponse,
  PsychologistStudentProfile,
  PsychologistStudentSummary,
} from "@packages/common-types/psychologist.types";
import { IUserService } from "../../contracts/user/IuserService";
import { PsychologistStudentsQueryService } from "../../modules/psychologist/psychologistStudentsQuery";
import { UserRegistrationService } from "./userRegistrationService";
import { UserVerificationService } from "./userVerificationService";
import { UserAccountService } from "./userAccountService";
import { PsychologistAssignmentService } from "./psychologistAssignmentService";

@injectable()
export class UserService implements IUserService {
  constructor(
    @inject("UserRegistrationService")
    private readonly userRegistrationService: UserRegistrationService,
    @inject("UserVerificationService")
    private readonly userVerificationService: UserVerificationService,
    @inject("UserAccountService")
    private readonly userAccountService: UserAccountService,
    @inject("PsychologistAssignmentService")
    private readonly psychologistAssignmentService: PsychologistAssignmentService,
    @inject("PsychologistStudentsQueryService")
    private readonly psychologistStudentsQueryService: PsychologistStudentsQueryService,
  ) {}

  getUsers(): Promise<User[]> {
    return this.userAccountService.getUsers();
  }

  getUserById(id: string): Promise<User | null> {
    return this.userAccountService.getUserById(id);
  }

  createUser(input: CreateUserInput): Promise<User> {
    return this.userRegistrationService.registerPublicUser(input);
  }

  createUserByAdmin(input: CreateUserInput): Promise<User> {
    return this.userRegistrationService.registerStaffUser(input);
  }

  updateUserRole(id: string, input: UpdateUserRoleInput): Promise<User> {
    return this.userAccountService.updateUserRole(id, input);
  }

  assignPsychologistToUser(
    targetUserId: string,
    input: AssignPsychologistInput,
  ): Promise<User> {
    return this.psychologistAssignmentService.assignPsychologistToUser(
      targetUserId,
      input,
    );
  }

  getPsychologistStudents(psychologistId: string): Promise<PsychologistStudentSummary[]> {
    return this.psychologistStudentsQueryService.getPsychologistStudents(psychologistId);
  }

  getPsychologistStudentById(
    psychologistId: string,
    studentId: string,
  ): Promise<PsychologistStudentProfile | null> {
    return this.psychologistStudentsQueryService.getPsychologistStudentById(
      psychologistId,
      studentId,
    );
  }

  getPsychologistStudentResults(
    psychologistId: string,
    filters: PsychologistStudentResultsFilters,
  ): Promise<PsychologistStudentResultsResponse> {
    return this.psychologistStudentsQueryService.getPsychologistStudentResults(
      psychologistId,
      filters,
    );
  }

  deactivateUser(id: string): Promise<void> {
    return this.userAccountService.deactivateUser(id);
  }

  activateUser(id: string): Promise<void> {
    return this.userAccountService.activateUser(id);
  }

  checkEmailAvailable(email: string, excludeId?: string): Promise<boolean> {
    return this.userAccountService.checkEmailAvailable(email, excludeId);
  }

  verifyEmail(token: string): Promise<void> {
    return this.userVerificationService.verifyEmail(token);
  }

  resendVerificationEmail(email: string): Promise<void> {
    return this.userVerificationService.resendVerificationEmail(email);
  }

  checkUnverifiedAccount(email: string): Promise<boolean> {
    return this.userVerificationService.checkUnverifiedAccount(email);
  }
}
