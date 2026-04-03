import { ComponentType } from 'react';
import { QuestionRendererProps } from './rendererProps.types';
import { SingleChoiceRenderer } from './SingleChoiceRenderer';
import { LikertRenderer } from './LikertRenderer';
import { OpenTextRenderer } from './OpenTextRenderer';
import { MultipleChoiceRenderer } from './MultipleChoiceRenderer';
import { NumericRenderer } from './NumericRenderer';

const rendererMap: Record<string, ComponentType<QuestionRendererProps>> = {
  single_choice: SingleChoiceRenderer,
  likert: LikertRenderer,
  open_text: OpenTextRenderer,
  multiple_choice: MultipleChoiceRenderer,
  numeric: NumericRenderer,
};

export const QuestionRendererFactory = (props: QuestionRendererProps) => {
  const Renderer = rendererMap[props.question.questionType ?? 'single_choice'] ?? SingleChoiceRenderer;
  return <Renderer {...props} />;
};
