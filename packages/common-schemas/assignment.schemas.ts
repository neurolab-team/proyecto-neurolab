import { z } from "zod";

export const AssignmentConsentDto = z
  .object({
    accepted: z.boolean(),
    allowsSleepTips: z.boolean().default(false),
    allowsStudyInvites: z.boolean().default(false),
  })
  // Las autorizaciones opcionales solo tienen sentido si acepta participar.
  .transform((dto) =>
    dto.accepted
      ? dto
      : { ...dto, allowsSleepTips: false, allowsStudyInvites: false },
  );

export type AssignmentConsentInput = z.infer<typeof AssignmentConsentDto>;

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
