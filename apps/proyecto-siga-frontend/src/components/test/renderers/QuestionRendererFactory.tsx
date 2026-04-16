import { ComponentType } from 'react';
import { QuestionRendererProps } from './rendererProps.types';
import { SingleChoiceRenderer } from './SingleChoiceRenderer';
import { LikertRenderer } from './LikertRenderer';
import { OpenTextRenderer } from './OpenTextRenderer';
import { MultipleChoiceRenderer } from './MultipleChoiceRenderer';
import { NumericRenderer } from './NumericRenderer';
import { TimeInputRenderer } from './TimeInputRenderer';
import { QuestionType } from '@packages/common-types/question.types';

const rendererMap: Record<QuestionType, ComponentType<QuestionRendererProps>> = {
  single_choice: SingleChoiceRenderer,
  likert: LikertRenderer,
  open_text: OpenTextRenderer,
  multiple_choice: MultipleChoiceRenderer,
  numeric: NumericRenderer,
  time_input: TimeInputRenderer,
};

export const QuestionRendererFactory = (props: QuestionRendererProps) => {
  const Renderer = rendererMap[props.question.questionType ?? 'single_choice'] ?? SingleChoiceRenderer;
  return <Renderer {...props} />;
};
