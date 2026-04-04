export interface AnswerWithDetails {
  question: {
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
