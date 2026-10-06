import { Question, isTextBasedAnswer } from '@packages/common-types/question.types';
import { TestConfig } from '../config/testConfig.types';

interface FollowUpQuestionProps {
  question: Question;
  selectedValue: string | null;
  onOptionSelect: (questionId: string, value: string) => void;
  testConfig: TestConfig;
}

/**
 * Pregunta de seguimiento (metadata.followUpOf): se dibuja colgando de la
 * tarjeta de su pregunta padre, sin número propio y sin diseño en bloque.
 */
export const FollowUpQuestion = ({
  question,
  selectedValue,
  onOptionSelect,
  testConfig,
}: FollowUpQuestionProps) => {
  const { colors } = testConfig;
  const isText = isTextBasedAnswer(question.questionType);

  return (
    <div className="ml-6 sm:ml-10">
      {/* Conector visual con la tarjeta de la pregunta padre */}
      <div className="ml-4 h-4 w-0.5" style={{ backgroundColor: colors.primaryLight }} />

      <div
        className="bg-white rounded-2xl shadow-lg p-5 sm:p-6 border-l-4"
        style={{ borderLeftColor: colors.primaryLight }}
      >
        <p className="text-base sm:text-lg font-semibold mb-4" style={{ color: colors.primaryDark }}>
          {question.prompt}
        </p>

        {isText ? (
          <input
            type={question.questionType === 'numeric' ? 'number' : 'text'}
            value={selectedValue ?? ''}
            onChange={(e) => onOptionSelect(question.questionId, e.target.value)}
            placeholder={question.questionType === 'numeric' ? 'Ingresa un valor numérico' : 'Escribe aquí...'}
            className="w-full p-3 border-2 border-gray-200 rounded-xl focus:outline-none transition-all"
          />
        ) : (
          <div className="flex flex-col space-y-2">
            {question.questionOption
              .filter((option) => option.value !== null)
              .map((option) => {
                const isSelected = selectedValue === option.questionOptionId;
                return (
                  <label
                    key={option.questionOptionId}
                    className="flex items-center space-x-3 p-3 rounded-lg border-2 cursor-pointer transition-all text-sm"
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
                      className="h-4 w-4"
                    />
                    <span>{option.label}</span>
                  </label>
                );
              })}
          </div>
        )}
      </div>
    </div>
  );
};
