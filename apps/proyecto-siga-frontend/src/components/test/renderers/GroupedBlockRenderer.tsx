import { Question, isTextBasedAnswer } from '@packages/common-types/question.types';
import { TestConfig } from '../config/testConfig.types';

interface GroupedBlockRendererProps {
  questions: Question[];
  groupHeader: string;
  current: number;
  getSelectedValue: (questionId: string) => string | null;
  onOptionSelect: (questionId: string, value: string) => void;
  testConfig: TestConfig;
}

export const GroupedBlockRenderer = ({
  questions,
  groupHeader,
  current,
  getSelectedValue,
  onOptionSelect,
  testConfig,
}: GroupedBlockRendererProps) => {
  const { colors } = testConfig;

  const choiceQuestions = questions.filter((q) => !isTextBasedAnswer(q.questionType));
  const textQuestions = questions.filter((q) => isTextBasedAnswer(q.questionType));

  // Use options from the first choice question as the shared scale
  const scaleOptions = choiceQuestions[0]?.questionOption ?? [];
  const scaleOrder = new Map(scaleOptions.map((opt, idx) => [opt.label.trim().toLowerCase(), idx]));

  const getOrderedOptions = (question: Question) => {
    return [...question.questionOption].sort((a, b) => {
      const idxA = scaleOrder.get(a.label.trim().toLowerCase()) ?? Number.MAX_SAFE_INTEGER;
      const idxB = scaleOrder.get(b.label.trim().toLowerCase()) ?? Number.MAX_SAFE_INTEGER;
      return idxA - idxB;
    });
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8">
      <h3 className="text-xl sm:text-2xl font-bold mb-6" style={{ color: colors.primaryDark }}>
        <span style={{ color: colors.primaryLight }} className="mr-2">{current}.</span>
        {groupHeader}
      </h3>

      {/* Scale header */}
      <div className="hidden sm:grid sm:gap-2 mb-3" style={{ gridTemplateColumns: `1fr repeat(${scaleOptions.length}, minmax(0, 1fr))` }}>
        <div />
        {scaleOptions.map((opt) => (
          <div key={opt.questionOptionId} className="text-center text-xs font-medium text-gray-500 px-1">
            {opt.label}
          </div>
        ))}
      </div>

      {/* Rows */}
      <div className="flex flex-col divide-y divide-gray-100">
        {choiceQuestions.map((q) => {
          const selected = getSelectedValue(q.questionId);
          const orderedOptions = getOrderedOptions(q);

          return (
            <div key={q.questionId} className="py-3">
              {/* Desktop: grid row */}
              <div className="hidden sm:grid sm:gap-2 sm:items-center" style={{ gridTemplateColumns: `1fr repeat(${scaleOptions.length}, minmax(0, 1fr))` }}>
                <span className="text-sm text-gray-700">{q.prompt}</span>
                {orderedOptions.map((opt) => (
                  <label key={opt.questionOptionId} htmlFor={`desktop-${q.questionId}-${opt.questionOptionId}`} className="flex justify-center cursor-pointer">
                    <input
                      id={`desktop-${q.questionId}-${opt.questionOptionId}`}
                      type="radio"
                      name={`desktop-${q.questionId}`}
                      value={opt.questionOptionId}
                      checked={selected === opt.questionOptionId}
                      onChange={() => onOptionSelect(q.questionId, opt.questionOptionId)}
                      className="h-4 w-4"
                      style={{ accentColor: colors.primary }}
                    />
                  </label>
                ))}
              </div>

              {/* Mobile: stacked */}
              <div className="sm:hidden">
                <p className="text-sm font-medium text-gray-700 mb-2">{q.prompt}</p>
                <div className="flex flex-col space-y-1">
                  {orderedOptions.map((opt) => {
                    const isSelected = selected === opt.questionOptionId;
                    return (
                      <label
                        key={opt.questionOptionId}
                        htmlFor={`mobile-${q.questionId}-${opt.questionOptionId}`}
                        className="flex items-center space-x-3 p-2 rounded-lg border cursor-pointer transition-all text-sm"
                        style={{
                          backgroundColor: isSelected ? colors.selectedBg : '#ffffff',
                          borderColor: isSelected ? colors.selectedBorder : '#e5e7eb',
                          color: isSelected ? colors.selectedText : '#374151',
                        }}
                      >
                        <input
                          id={`mobile-${q.questionId}-${opt.questionOptionId}`}
                          type="radio"
                          name={`mobile-${q.questionId}`}
                          value={opt.questionOptionId}
                          checked={isSelected}
                          onChange={() => onOptionSelect(q.questionId, opt.questionOptionId)}
                          className="h-4 w-4"
                        />
                        <span>{opt.label}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Open text questions at the bottom of the block */}
      {textQuestions.map((q) => (
        <div key={q.questionId} className="mt-4">
          <label className="text-sm font-medium text-gray-700 mb-1 block">{q.prompt}</label>
          <textarea
            rows={3}
            value={getSelectedValue(q.questionId) ?? ''}
            onChange={(e) => onOptionSelect(q.questionId, e.target.value)}
            placeholder="Escribe aquí..."
            className="w-full p-3 border-2 border-gray-200 rounded-xl focus:outline-none transition-all resize-none text-sm"
          />
        </div>
      ))}
    </div>
  );
};
