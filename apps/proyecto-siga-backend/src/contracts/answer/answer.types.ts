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

export interface DetailedAnswer {
  textValue?: string | null;
  question: {
    prompt: string;
    code?: string | null;
    section: { name: string | null } | null;
  } | null;
  option: {
    label: string;
  } | null;
}
