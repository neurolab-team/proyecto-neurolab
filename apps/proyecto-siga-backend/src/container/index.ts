//inject repositories
import { container, instanceCachingFactory } from 'tsyringe'
import { IEmailProvider } from '../contracts/mail/IemailProvider'
import { createEmailProvider } from '../services/mail/providers/emailProviderFactory'
import { MailService } from '../services/mail/mailService'
import { AuthService } from '../services/auth/authService'
import { UserRepository } from '../repositories/userRepository'
import { UserService } from '../services/users/userService'
import { UserRegistrationService } from '../services/users/userRegistrationService'
import { UserVerificationService } from '../services/users/userVerificationService'
import { UserAccountService } from '../services/users/userAccountService'
import { PsychologistAssignmentService } from '../services/users/psychologistAssignmentService'
import { EmailVerificationService } from '../services/mail/emailVerificationService'
import { TokenCacheService } from '../services/token/tokenCacheService'
import { TokenCacheRepository } from '../repositories/tokenCacheRepository'
import { VerificationService } from '../services/verification/verificationService'
import { SessionService } from '../services/session/sessionService'
import { AssignmentRepository } from '../repositories/assignmentRepository'
import { AssignmentService } from '../services/assignment/assignmentService'
import { TestRepository } from '../repositories/testRepository'
import { PublicTestService } from '../services/test/publicTestService'
import { AnswerService } from '../services/answer/answerService'
import { AnswerRepository } from '../repositories/answerRepository'
import {AssignmentScoreService} from '../services/assignmentScore/assignmentScoreService'
import {AssignmentScoreRepository} from '../repositories/assignmentScoreRepository'
import { InterpretationFactory } from '../services/interpretation/InterpretationFactory'
import { PsychologistStudentsQueryService } from '../modules/psychologist/psychologistStudentsQuery'
import { PsychologistDashboardQueryService } from '../modules/psychologist/psychologistDashboardQuery'
import { TransactionManager } from '../services/transaction/transactionManager'
import { HealthService } from '../services/health/healthService'


//register dependencies - service
container.register("TokenCacheService", { useClass: TokenCacheService })
container.register("AuthService", { useClass: AuthService })
container.register("TransactionManager", { useClass: TransactionManager })
container.register("UserService",{useClass: UserService})
container.register("UserRegistrationService", { useClass: UserRegistrationService })
container.register("UserVerificationService", { useClass: UserVerificationService })
container.register("UserAccountService", { useClass: UserAccountService })
container.register("PsychologistAssignmentService", { useClass: PsychologistAssignmentService })
container.register("VerificationService",{useClass: VerificationService})
container.register("SessionService", { useClass: SessionService })
// El proveedor de correo se construye una sola vez y de forma perezosa: la
// factory lee el entorno en la primera resolución, no al importar el módulo.
// Cambiar de proveedor = variable EMAIL_PROVIDER (ver emailProviderFactory).
container.register<IEmailProvider>("EmailProvider", {
  useFactory: instanceCachingFactory(() => createEmailProvider(process.env)),
})
container.register("MailService", { useClass: MailService })
container.register("EmailVerificationService",{useClass: EmailVerificationService})
container.register("AssignmentService",{useClass:AssignmentService})
container.register("AnswerService",{useClass: AnswerService})
container.register("AssignmentScoreService",{useClass:AssignmentScoreService})
container.register("InterpretationFactory",{useClass: InterpretationFactory})
container.register("PsychologistStudentsQueryService",{useClass:PsychologistStudentsQueryService})
container.register("PsychologistDashboardQueryService",{useClass:PsychologistDashboardQueryService})
container.register("PublicTestService",{useClass: PublicTestService})
container.register("HealthService",{useClass: HealthService})
//register dependencies - repository
container.register("TokenCacheRepo",{useClass:TokenCacheRepository})
container.register("UserRepo", { useClass: UserRepository })
container.register("AssignmentRepo",{useClass:AssignmentRepository})
container.register("TestRepo",{useClass:TestRepository})
container.register("AnswerRepo",{useClass:AnswerRepository})
container.register("AssignmentScoreRepo",{useClass:AssignmentScoreRepository})

export default container
