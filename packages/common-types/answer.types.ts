import { Decimal } from "@prisma/client/runtime/library"

export interface Answer {
  answerId:string,      
  assignmentId: string, 
  questionId:string,
  questionOptionId:string,
}
export interface AnswerWithDetails {
  question: {
    section: {
      name: string;
    };
  };
  option: {
    scoreValue: Decimal;
  } | null;
}

export interface AnswerWithDetailsArray {
  answers: AnswerWithDetails[];

}


export interface CreateAnswerInput {
  assignmentId: string, 
  questionId:string,
  questionOptionId:string,
}

export interface UpdateAnswerInput {
  questionOptionId?:string,
  score?: Decimal
}

export interface CreateAnswer{
  questionId:string,
  questionOptionId:string,
}

export interface CreateManyAnswersInput {
  assignmentId: string,
  answers: CreateAnswer[]
}