//inject repositories
import { container } from 'tsyringe'
import { AuthService } from '../services/auth/authService'
import { UserRepository } from '../repositories/userRepository'
import { UserService } from '../services/users/userService'
import { EmailVerificationService } from '../services/mail/emailVerificationService'
import { TokenCacheService } from '../services/token/tokenCacheService'
import { TokenCacheRepository } from '../repositories/tokenCacheRepository'
import { VerificationService } from '../services/verification/verificationService'
import { SessionService } from '../services/session/sessionService'
import { AssignmentRepository } from '../repositories/assignmentRepository'
import { AssignmentService } from '../services/assignment/assignmentService'
import { TestRepository } from '../repositories/testRepository'
import { AnswerService } from '../services/answer/answerService'
import { AnswerRepository } from '../repositories/answerRepository'
import {AssignmentScoreService} from '../services/assignmentScore/assignmentScoreService'
import {AssignmentScoreRepository} from '../repositories/assignmentScoreRepository'
import { InterpretationFactory } from '../services/interpretation/InterpretationFactory'
import { PsychologistStudentsQueryService } from '../modules/psychologist/psychologistStudentsQuery'
import { PsychologistDashboardQueryService } from '../modules/psychologist/psychologistDashboardQuery'


//register dependencies - service
container.register("TokenCacheService", { useClass: TokenCacheService })
container.register("AuthService", { useClass: AuthService })
container.register("UserService",{useClass: UserService})
container.register("VerificationService",{useClass: VerificationService})
container.register("SessionService", { useClass: SessionService })
container.register("EmailVerificationService",{useClass: EmailVerificationService})
container.register("AssignmentService",{useClass:AssignmentService})
container.register("AnswerService",{useClass: AnswerService})
container.register("AssignmentScoreService",{useClass:AssignmentScoreService})
container.register("InterpretationFactory",{useClass: InterpretationFactory})
container.register("PsychologistStudentsQueryService",{useClass:PsychologistStudentsQueryService})
container.register("PsychologistDashboardQueryService",{useClass:PsychologistDashboardQueryService})
//register dependencies - repository
container.register("TokenCacheRepo",{useClass:TokenCacheRepository})
container.register("UserRepo", { useClass: UserRepository })
container.register("AssignmentRepo",{useClass:AssignmentRepository})
container.register("TestRepo",{useClass:TestRepository})
container.register("AnswerRepo",{useClass:AnswerRepository})
container.register("AssignmentScoreRepo",{useClass:AssignmentScoreRepository})

export default container
