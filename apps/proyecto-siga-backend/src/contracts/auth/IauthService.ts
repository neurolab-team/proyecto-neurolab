import { LoginResult, UserProfile } from "@packages/common-types/auth.types";
export interface IAuthService {
  login(email: string, password: string): Promise<LoginResult>;
  getUserProfile(userId: string): Promise<UserProfile>;
  changePassword(
    userId: string,
    currentPassword: string,
    newPassword: string,
  ): Promise<void>;
  validateToken(userId: string, tokenVersion: number): Promise<boolean>;
<<<<<<< HEAD
}
=======
}
>>>>>>> remotes/origin/jhonzabala/refactoringWeb
