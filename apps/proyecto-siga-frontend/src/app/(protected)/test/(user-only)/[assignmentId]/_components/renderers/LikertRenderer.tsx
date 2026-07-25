import { QuestionRendererProps } from './rendererProps.types';
import { QuestionNotice } from './QuestionNotice';

export const LikertRenderer = ({
  question,
  current,
  selectedValue,
  onOptionSelect,
  testConfig,
}: QuestionRendererProps) => {
  const { colors } = testConfig;

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8">
      <QuestionNotice notice={question.metadata?.notice} />
      <h3 className="text-xl sm:text-2xl font-bold mb-6" style={{ color: colors.primaryDark }}>
        <span style={{ color: colors.primaryLight }} className="mr-2">{current}.</span>
        {question.prompt}
      </h3>

      <div className="flex flex-wrap gap-3 justify-center">
        {question.questionOption
          .filter((option) => option.value !== null)
          .map((option) => {
            const isSelected = selectedValue === option.questionOptionId;

            return (
              <button
                key={option.questionOptionId}
                type="button"
                onClick={() => onOptionSelect(question.questionId, option.questionOptionId)}
                className="flex-1 min-w-[120px] p-4 rounded-xl border-2 text-center text-sm font-medium transition-all duration-150 cursor-pointer"
                style={{
                  backgroundColor: isSelected ? colors.selectedBg : '#ffffff',
                  borderColor: isSelected ? colors.selectedBorder : '#e5e7eb',
                  color: isSelected ? colors.selectedText : '#374151',
                }}
              >
                {option.label}
              </button>
            );
          })}
      </div>
    </div>
  );
};
