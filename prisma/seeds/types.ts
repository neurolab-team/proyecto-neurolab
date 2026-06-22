export type QuestionType =
  | "likert"
  | "single_choice"
  | "multiple_choice"
  | "open_text"
  | "numeric"
  | "time_input";

export interface SeedOption {
  label: string;
  value: string;
  scoreValue: number | null;
}

export interface SeedQuestion {
  code: string;
  prompt: string;
  type: QuestionType;
  sectionCode: string;
  options: SeedOption[];
  required?: boolean;
  condition?: object;
  metadata?: object;
}

export interface SeedSection {
  code: string;
  name: string;
}

export interface TestSeedDefinition {
  testId: string;
  testCode: string;
  title: string;
  description: string;
  sections: SeedSection[];
  questions: SeedQuestion[];
}
