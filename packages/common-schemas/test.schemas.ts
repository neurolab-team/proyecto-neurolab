import { z } from 'zod';

export const testOptionDtoSchema = z.object({
  questionOptionId: z.uuid(),
  label: z.string(),
  value: z.string().nullable(),
});

export const testQuestionDtoSchema = z.object({
  questionId: z.uuid(),
  code: z.string().nullable(),
  prompt: z.string(),
  questionType: z.enum(['single_choice', 'multiple_choice', 'likert', 'open_text', 'numeric', 'time_input']),
  required: z.boolean(),
  condition: z.any().nullable().optional(),
  metadata: z.any().nullable().optional(),
  questionOption: z.array(testOptionDtoSchema),
});

export const testDataDtoSchema = z.object({
  testCode: z.string(),
  title: z.string(),
  description: z.string().nullable().optional(),
  question: z.array(testQuestionDtoSchema),
  consentStatus: z.enum(['accepted', 'declined']).nullable().optional(),
});

export const publicTestCardSchema = z.object({
  testId: z.uuid(),
  testCode: z.string(),
  title: z.string(),
  description: z.string().nullable().optional(),
  audience: z.literal('user'),
});

export type  TestOptionDto = z.infer<typeof testOptionDtoSchema>;
export type  TestQuestionDto = z.infer<typeof testQuestionDtoSchema>;
export type  TestDataResponse = z.infer<typeof testDataDtoSchema>;
export type  PublicTestCard = z.infer<typeof publicTestCardSchema>;