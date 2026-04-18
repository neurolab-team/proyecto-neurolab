export interface AnswerWithDetails {
  textValue?: string | null;
  question: {
    code?: string | null;
    section: {
      name: string | null;
    } | null;
  } | null;
  option: {
    scoreValue: {
      toNumber(): number;
    } | null;
  } | null;
}
