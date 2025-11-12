import { z } from 'zod';

export const testOptionDtoSchema = z.object({
  id: z.uuid(),
  label: z.string(),
  value: z.string().nullable(),
});

export const testQuestionDtoSchema = z.object({
  id: z.uuid(),
  code: z.string().nullable(),
  prompt: z.string(),
  options: z.array(testOptionDtoSchema),
});

export const testDataDtoSchema = z.object({
  title: z.string(),
  questions: z.array(testQuestionDtoSchema),
});

export type  TestOptionDto = z.infer<typeof testOptionDtoSchema>;
export type  TestQuestionDto = z.infer<typeof testQuestionDtoSchema>;
export type  TestDataResponse = z.infer<typeof testDataDtoSchema>;