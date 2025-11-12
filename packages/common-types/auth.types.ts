import { User } from "./user.types"

export interface UserAuth extends User {
  password: string
  tokenVersion: number
}


export interface UserProfile {
  userId: string
  userNumber: string
  email: string
  name: string
  role: string
  gender?: string | ''
  createdAt: Date
}

export interface LoginResult {
  token: string
  user: User
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface ChangePasswordData {
  currentPassword: string
  newPassword: string
  accessToken: string
}