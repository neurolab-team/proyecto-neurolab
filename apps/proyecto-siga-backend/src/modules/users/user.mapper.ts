import {
  BasicUserReference,
  User,
  UserRole,
} from "@packages/common-types/user.types";
import { UserWithAssignedPsychologistRecord } from "../../contracts/user/IuserRepo";

type UserRecordLike =
  | UserWithAssignedPsychologistRecord
  | {
      userId: string;
      userNumber: string;
      email: string;
      name: string;
      role: string;
      userType: string;
      gender: string | null;
      birthDate: Date | null;
      lastLogin: Date | null;
      passwordChangedAt?: Date | null;
      dataPolicyAcceptedAt?: Date | null;
      mustChangePassword: boolean;
      verifiedEmail: boolean;
      isActive: boolean;
      assignedPsychologistId?: string | null;
      assignedPsychologistAt?: Date | null;
      followUpAt?: Date | null;
      assignedPsychologist?:
        | {
            userId: string;
            name: string;
            email: string;
          }
        | null;
    };

export function mapBasicUserReference(
  user?:
    | {
        userId: string;
        name: string;
        email: string;
      }
    | null,
): BasicUserReference | null {
  if (!user) return null;

  return {
    userId: user.userId,
    name: user.name || user.email,
    email: user.email,
  };
}

export function mapUserRecordToUser(user: UserRecordLike): User {
  return {
    userId: user.userId,
    userNumber: user.userNumber,
    email: user.email,
    name: user.name || "",
    role: user.role as UserRole,
    userType: user.userType as User["userType"],
    gender: user.gender || "",
    birthDate: user.birthDate || undefined,
    lastLogin: user.lastLogin || undefined,
    passwordChangedAt: user.passwordChangedAt || null,
    dataPolicyAcceptedAt: user.dataPolicyAcceptedAt || null,
    mustChangePassword: Boolean(user.mustChangePassword),
    verifiedEmail: user.verifiedEmail,
    isActive: user.isActive,
    assignedPsychologistId: user.assignedPsychologistId ?? null,
    assignedPsychologistAt: user.assignedPsychologistAt || null,
    followUpAt: user.followUpAt || null,
    assignedPsychologist: mapBasicUserReference(
      "assignedPsychologist" in user ? user.assignedPsychologist : null,
    ),
  };
}
