import { QuestionRendererProps } from './rendererProps.types';
import { QuestionNotice } from './QuestionNotice';
import { DurationInput } from './DurationInput';

export const NumericRenderer = ({
  question,
  current,
  selectedValue,
  onOptionSelect,
  testConfig,
}: QuestionRendererProps) => {
  const { colors } = testConfig;
  const duration = question.metadata?.durationInput;

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8">
      <QuestionNotice notice={question.metadata?.notice} />
      <h3 className="text-xl sm:text-2xl font-bold mb-6" style={{ color: colors.primaryDark }}>
        <span style={{ color: colors.primaryLight }} className="mr-2">{current}.</span>
        {question.prompt}
      </h3>
      {duration ? (
        <DurationInput
          value={selectedValue}
          onChange={(v) => onOptionSelect(question.questionId, v)}
          maxHours={duration.maxHours}
          minuteStep={duration.minuteStep}
        />
      ) : (
        <input
          type="number"
          value={selectedValue ?? ''}
          onChange={(e) => onOptionSelect(question.questionId, e.target.value)}
          placeholder="Ingresa un valor numérico"
          className="w-full p-4 border-2 border-gray-200 rounded-xl focus:outline-none transition-all text-lg"
        />
      )}
    </div>
  );
};
