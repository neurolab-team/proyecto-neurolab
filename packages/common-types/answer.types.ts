import { Decimal } from "@prisma/client/runtime/library"

export interface Answer {
  answerId:string,      
  assignmentId: string, 
  questionId:string,
  questionOptionId:string,
  numericAnswer: Decimal,
  score: Decimal
}


export interface CreateAnswerInput {
  assignmentId: string, 
  questionId:string,
  questionOptionId:string,
  numericAnswer: Decimal | null
}

export interface UpdateAnswerInput {
  questionOptionId?:string,
  numericAnswer?: Decimal | null,
  score?: Decimal
}

export interface CreateAnswer{
  questionId:string,
  questionOptionId:string,
  numericAnswer: Decimal | null
}

export interface CreateManyAnswersInput {
  assignmentId: string,
  answers: CreateAnswer[]
}