import { z } from "zod";

export const AssignmentConsentDto = z.object({
  accepted: z.boolean(),
});

export const BulkAssignPsychologistTestDto = z.object({
  testId: z.uuid(),
  studentIds: z.array(z.uuid()).min(1).max(200),
  dueAt: z
    .string()
    .trim()
    .optional()
    .refine((value) => !value || !Number.isNaN(Date.parse(value)), {
      message: "dueAt inválida",
    }),
});
