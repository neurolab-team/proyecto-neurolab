//inject repositories
import { container } from 'tsyringe'
import { AuthService } from '../services/auth/authService'
import { UserRepository } from '../repositories/userRepository'
import {TokenService} from "../services/auth/tokenService"
import { UserService } from '../services/users/userService'
import { EmailVerificationService } from '../services/mail/emailVerificationService'
import { TokenCacheService } from '../services/token/tokenCacheService'
import { TokenCacheRepository } from '../repositories/tokenCacheRepository'
import { VerificationService } from '../services/verification/verificationService'
//register dependencies - service
container.register("TokenCacheService", { useClass: TokenCacheService })
container.register("TokenService",{useClass: TokenService})
container.register("AuthService", { useClass: AuthService })
container.register("UserRepo", { useClass: UserRepository })
container.register("UserService",{useClass: UserService})
container.register("VerificationService",{useClass: VerificationService})
container.register("EmailVerificationService",{useClass: EmailVerificationService})
//register dependencies - repository
container.register("TokenCacheRepo",{useClass:TokenCacheRepository})

export default container
