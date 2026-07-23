import { inject, injectable } from "tsyringe";
import bcrypt from "bcrypt";
import { CreateUserInput, User } from "@packages/common-types/user.types";
import { BadRequest } from "../../utils/httpError";
import { IEmailVerificationService } from "../../contracts/mail/IemailVerificationService";
import { IUserRepo } from "../../contracts/user/IuserRepo";
import { IVerificationService } from "../../contracts/verification/IverificationService";
import { IAssignmentService } from "../../contracts/assignment/IassignmentService";
import { mapUserRecordToUser } from "../../modules/users/user.mapper";
import { generateSecurePassword } from "../../utils/sendEmail";
import { TransactionManager } from "../transaction/transactionManager";
import { checkPassword } from "../../security/passwordPolicy";
import { isOfLegalAge, MINIMUM_REGISTRATION_AGE } from "../../utils/age";

@injectable()
export class UserRegistrationService {
  constructor(
    @inject("EmailVerificationService")
    private readonly emailVerificationService: IEmailVerificationService,
    @inject("UserRepo")
    private readonly userRepo: IUserRepo,
    @inject("VerificationService")
    private readonly verificationService: IVerificationService,
    @inject("AssignmentService")
    private readonly assignmentService: IAssignmentService,
    @inject("TransactionManager")
    private readonly txManager: TransactionManager,
  ) {}

  private async hashPassword(password: string): Promise<string> {
    const rounds = Number(process.env.BCRYPT_SALT_ROUNDS || 10);
    const saltRounds = Number.isFinite(rounds) && rounds > 0 ? rounds : 10;
    return bcrypt.hash(password, saltRounds);
  }

  private validateInstitutionalEmail(input: CreateUserInput, email: string): void {
    if (input.userType === "itmStudent" && !email.endsWith("@correo.itm.edu.co")) {
      throw BadRequest("Los estudiantes deben usar correo @correo.itm.edu.co");
    }

    if (input.userType === "itmEmployee" && !email.endsWith("@itm.edu.co")) {
      throw BadRequest("Los empleados deben usar correo @itm.edu.co");
    }
  }

  async registerPublicUser(input: CreateUserInput): Promise<User> {
    const email = input.email.toLowerCase();
    this.validateInstitutionalEmail(input, email);

    if (!input.acceptedDataPolicy) {
      throw BadRequest(
        "Debes aceptar la política de tratamiento de datos personales",
      );
    }

    if (!isOfLegalAge(input.birthDate)) {
      throw BadRequest(
        `Debes ser mayor de ${MINIMUM_REGISTRATION_AGE} años para registrarte`,
      );
    }

    const passwordErrors = await checkPassword(input.password ?? "", email);
    if (passwordErrors.length > 0) {
      throw BadRequest(passwordErrors.join(". "));
    }

    const hashedPassword = await this.hashPassword(input.password!);
    const verificationToken = await this.verificationService.createVerificationToken(email);

    const user = await this.txManager.run(async (tx) => {
      const createdUser = await this.userRepo.create(
        {
          userNumber: input.userNumber,
          email,
          name: input.name ?? "",
          role: input.role,
          userType: input.userType,
          gender: input.gender,
          birthDate: input.birthDate ? new Date(input.birthDate) : undefined,
          password: hashedPassword,
          isActive: false,
          verifiedEmail: false,
          mustChangePassword: false,
          passwordChangedAt: new Date(),
          dataPolicyAcceptedAt: new Date(),
          lastLogin: null,
        },
        tx,
      );

      await this.assignmentService.assignInitialTestsToUser(createdUser.userId, tx);
      return createdUser;
    });

    const verificationUrl = `${process.env.APP_FRONTEND_URL}/verify-email?token=${verificationToken}`;

    await this.emailVerificationService.sendVerificationEmailUser(
      user.email,
      user.name || "Usuario",
      verificationUrl,
    );

    return mapUserRecordToUser(user);
  }

  async registerStaffUser(input: CreateUserInput): Promise<User> {
    const temporaryPassword = await generateSecurePassword();
    const hashedPassword = await this.hashPassword(temporaryPassword);

    const user = await this.txManager.run(async (tx) => {
      return this.userRepo.create(
        {
          userNumber: input.userNumber,
          email: input.email.toLowerCase(),
          name: input.name ?? "",
          role: input.role,
          userType: input.userType,
          gender: input.gender,
          birthDate: input.birthDate ? new Date(input.birthDate) : undefined,
          password: hashedPassword,
          isActive: true,
          verifiedEmail: true,
          mustChangePassword: true,
          passwordChangedAt: null,
          lastLogin: null,
        },
        tx,
      );
    });

    await this.emailVerificationService.sendVerificationEmailStaff(
      user.email,
      user.name || (user.role === "admin" ? "Administrador" : "Psicólogo"),
      temporaryPassword,
      `${process.env.APP_FRONTEND_URL}`,
    );

    return mapUserRecordToUser(user);
  }
}
