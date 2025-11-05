import { z } from "zod";

const userTypes = ["itmStudent", "itmEmployee", "external"] as const;
const role = ["user"] as const;
const staffRoles = ["psychologist", "admin"] as const;

export const CreateUserDto = z.object({
  email: z
    .string()
    .min(3)
    .trim()
    .transform((s) => s.toLowerCase()),
  name: z.string().trim().optional().nullable(),
  role: z.enum(staffRoles),
  userNumber: z.string().min(1).trim(),
  userType: z.enum(userTypes),
  birthDate: z.string().optional(),
  gender: z.string(),
});

export const RegisterDto = z.object({
  email: z
    .string()
    .min(3)
    .trim()
    .transform((s) => s.toLowerCase()),
  name: z.string().min(1).trim(),
  role: z.enum(role),
  userNumber: z.string().min(1).trim(),
  userType: z.enum(userTypes),
  birthDate: z.string().optional(),
  gender: z.string().optional(),
  password: z.string().min(6).optional(),
});

export type userResponse = {
  userNumber: string;
  email: string;
  name: string;
  role: string;
  isActive: boolean;
  gender: string;
};