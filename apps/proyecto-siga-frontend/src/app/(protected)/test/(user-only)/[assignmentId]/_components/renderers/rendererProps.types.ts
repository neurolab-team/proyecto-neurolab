import { TestConfig } from '../config/testConfig.types';
import { QuestionType, QuestionMetadata } from '@packages/common-types/question.types';

export interface QuestionRendererProps {
  question: {
    questionId: string;
    code?: string | null;
    prompt?: string;
    questionType?: QuestionType;
    metadata?: QuestionMetadata | null;
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
