import { ComponentType } from 'react';
import { QuestionRendererProps } from './renderers/rendererProps.types';
import { SingleChoiceRenderer } from './renderers/SingleChoiceRenderer';
import { LikertRenderer } from './renderers/LikertRenderer';
import { OpenTextRenderer } from './renderers/OpenTextRenderer';
import { MultipleChoiceRenderer } from './renderers/MultipleChoiceRenderer';
import { NumericRenderer } from './renderers/NumericRenderer';
import { TimeInputRenderer } from './renderers/TimeInputRenderer';
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
