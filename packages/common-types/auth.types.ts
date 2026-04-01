import { User } from "./user.types"

export type UserProfile = User

export interface LoginResult {
  user: User
}

export type LoginData = {
  sessionId: string;
  user: User;
};

export interface LoginCredentials {
  email: string
  password: string
}

export interface ChangePasswordData {
  currentPassword: string
  newPassword: string
}

export interface RegisterResponse {
  userId: string
  email: string
}
