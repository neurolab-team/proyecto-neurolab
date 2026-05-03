import { QuestionRendererProps } from './rendererProps.types';

export const SingleChoiceRenderer = ({
  question,
  current,
  selectedValue,
  onOptionSelect,
  testConfig,
}: QuestionRendererProps) => {
  const { colors } = testConfig;

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8">
      <div className="flex flex-col space-y-6">
        <h3 className="text-xl sm:text-2xl font-bold" style={{ color: colors.primaryDark }}>
          <span style={{ color: colors.primaryLight }} className="mr-2">{current}.</span>
          {question.prompt}
        </h3>

        <div className="flex flex-col space-y-3">
          {question.questionOption
            .filter((option) => option.value !== null)
            .map((option) => {
              const isSelected = selectedValue === option.questionOptionId;

              return (
                <label
                  key={option.questionOptionId}
                  className="flex items-center space-x-4 p-4 rounded-lg border-2 cursor-pointer transition-all duration-150"
                  style={{
                    backgroundColor: isSelected ? colors.selectedBg : '#ffffff',
                    borderColor: isSelected ? colors.selectedBorder : '#e5e7eb',
                    color: isSelected ? colors.selectedText : '#374151',
                  }}
                >
                  <input
                    type="radio"
                    name={question.questionId}
                    value={option.questionOptionId}
                    checked={isSelected}
                    onChange={() => onOptionSelect(question.questionId, option.questionOptionId)}
                    className="form-radio h-5 w-5"
                  />
                  <span className="text-base">{option.label}</span>
                </label>
              );
            })}
        </div>
      </div>
    </div>
  );
};
