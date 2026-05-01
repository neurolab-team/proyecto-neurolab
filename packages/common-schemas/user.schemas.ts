import { z } from "zod";

const userTypes = ["itmStudent", "itmEmployee", "external"] as const;
const staffRoles = ["psychologist", "admin"] as const;
const appRoles = ["admin", "psychologist", "user"] as const;
const psychologistPriorityFilters = ["all", "high", "medium", "low"] as const;
const psychologistCaseStatusFilters = [
  "all",
  "new",
  "in_progress",
  "pending_review",
  "critical",
  "stable",
  "follow_up",
] as const;
const psychologistResultsStatusFilters = [
  "all",
  "assigned",
  "in_progress",
  "completed",
  "expired",
  "pending_review",
] as const;
const psychologistResultsDetailLevels = ["assignment", "question"] as const;

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
  userNumber: z.string().min(1).trim(),
  userType: z.enum(userTypes),
  birthDate: z.string().optional(),
  gender: z.string().optional(),
  password: z.string().min(6).optional(),
});

export const ResendVerificationDto = z.object({
  email: z
    .string()
    .min(3)
    .trim()
    .transform((s) => s.toLowerCase()),
});

export const UpdateUserRoleDto = z.object({
  role: z.enum(appRoles),
});

export const AssignPsychologistDto = z.object({
  psychologistId: z.uuid().nullable(),
});

export const PsychologistStudentResultsFiltersDto = z.object({
  search: z.string().trim().optional(),
  testId: z.string().trim().optional(),
  status: z.enum(psychologistResultsStatusFilters).optional().default("completed"),
  priority: z.enum(psychologistPriorityFilters).optional().default("all"),
  caseStatus: z.enum(psychologistCaseStatusFilters).optional().default("all"),
  detailLevel: z
    .enum(psychologistResultsDetailLevels)
    .optional()
    .default("assignment"),
  fromDate: z
    .string()
    .trim()
    .optional()
    .refine((value) => !value || !Number.isNaN(Date.parse(value)), {
      message: "fromDate inválida",
    }),
  toDate: z
    .string()
    .trim()
    .optional()
    .refine((value) => !value || !Number.isNaN(Date.parse(value)), {
      message: "toDate inválida",
    }),
  onlyWithInterpretation: z.coerce.boolean().optional().default(false),
  limit: z.coerce.number().int().min(1).max(5000).optional().default(5000),
});
