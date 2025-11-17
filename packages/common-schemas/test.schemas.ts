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
  questionOption: z.array(testOptionDtoSchema),
});

export const testDataDtoSchema = z.object({
  title: z.string(),
  question: z.array(testQuestionDtoSchema),
});

export type  TestOptionDto = z.infer<typeof testOptionDtoSchema>;
export type  TestQuestionDto = z.infer<typeof testQuestionDtoSchema>;
export type  TestDataResponse = z.infer<typeof testDataDtoSchema>;