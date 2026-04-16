export interface Answer {
  answerId:string,      
  assignmentId: string, 
  questionId:string,
  questionOptionId:string,
}

export interface CreateAnswerInput {
  assignmentId: string, 
  questionId:string,
  questionOptionId?:string,
  textValue?:string,
}

export interface UpdateAnswerInput {
  questionOptionId?:string,
  score?: number
}

export interface CreateAnswer{
  questionId:string,
  questionOptionId?:string,
  textValue?:string,
}

export interface CreateManyAnswersInput {
  assignmentId: string,
  answers: CreateAnswer[]
}