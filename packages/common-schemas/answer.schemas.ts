import { z } from "zod";


export const CreateAnswerDto = z.object({
    assignmentId: z.uuid(),
    questionId: z.uuid(),
    questionOptionId: z.uuid(),
    numericAnswer: z.number().nullable().optional()
});

// export const CreateManyAnswersDto = z.object({
//   assignmentId: z.uuid(),
//   answers: z.array(z.object({
//     questionId: z.uuid(),
//     questionOptionId: z.uuid(),
//     numericAnswer: z.number().nullable().optional()
//   }))
// });


export const CreateManyAnswersDto = z.object({
  assignmentId: z.uuid(),
  answers: z.array(
    z.object({
      questionId: z.uuid(),
      questionOptionId:z.uuid(),
      numericAnswer: z.number().nullable().optional()
    })
  ),
});