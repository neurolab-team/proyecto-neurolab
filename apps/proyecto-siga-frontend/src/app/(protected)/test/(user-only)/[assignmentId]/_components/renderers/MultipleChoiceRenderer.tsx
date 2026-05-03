import { useState, useEffect } from 'react';
import { QuestionRendererProps } from './rendererProps.types';

export const MultipleChoiceRenderer = ({
  question,
  current,
  selectedValue,
  onOptionSelect,
  testConfig,
}: QuestionRendererProps) => {
  const { colors } = testConfig;
  const [selected, setSelected] = useState<string[]>(() =>
    selectedValue ? selectedValue.split(',') : []
  );

  useEffect(() => {
    setSelected(selectedValue ? selectedValue.split(',') : []);
  }, [selectedValue]);

  const toggle = (optionId: string) => {
    const next = selected.includes(optionId)
      ? selected.filter((id) => id !== optionId)
      : [...selected, optionId];
    setSelected(next);
    onOptionSelect(question.questionId, next.join(','));
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8">
      <h3 className="text-xl sm:text-2xl font-bold mb-2" style={{ color: colors.primaryDark }}>
        <span style={{ color: colors.primaryLight }} className="mr-2">{current}.</span>
        {question.prompt}
      </h3>
      <p className="text-sm text-gray-500 mb-6">Selecciona una o más opciones</p>

      <div className="flex flex-col space-y-3">
        {question.questionOption
          .filter((option) => option.value !== null)
          .map((option) => {
            const isSelected = selected.includes(option.questionOptionId);

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
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => toggle(option.questionOptionId)}
                  className="form-checkbox h-5 w-5"
                />
                <span className="text-base">{option.label}</span>
              </label>
            );
          })}
      </div>
    </div>
  );
};
