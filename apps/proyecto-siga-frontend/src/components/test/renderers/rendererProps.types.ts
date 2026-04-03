import { TestConfig } from '../config/testConfig.types';

export interface QuestionRendererProps {
  question: {
    questionId: string;
    code?: string | null;
    prompt?: string;
    questionType?: string;
    questionOption: {
      questionOptionId: string;
      label: string;
      value?: string | null;
    }[];
  };
  current: number;
  selectedValue: string | null;
  onOptionSelect: (questionId: string, value: string) => void;
  testConfig: TestConfig;
}
