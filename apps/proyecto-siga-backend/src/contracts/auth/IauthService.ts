import { LoginResult, UserProfile } from "@packages/common-types/auth.types";
export interface IAuthService {
  login(email: string, password: string): Promise<LoginResult>;
  getUserProfile(userId: string): Promise<UserProfile>;
  updateLastLogin(userId: string, loginAt?: Date): Promise<UserProfile>;
  changePassword(
    userId: string,
    currentPassword: string,
    newPassword: string,
  ): Promise<void>;
  resetPassword(userId: string, newPassword: string): Promise<void>;
  markUsabilitySurveyClicked(userId: string): Promise<void>;
}
