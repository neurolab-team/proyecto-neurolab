import { Question } from "@packages/common-types/question.types";

type QuestionCardProps = {
  question: Question;
  current: number;
  selectedValue: string | null;
  onOptionSelect: (questionId: string, value: string) => void;
};

export const QuestionCard = ({
  question,
  current,
  selectedValue,
  onOptionSelect,
}: QuestionCardProps) => {
  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8">
      <div className="flex flex-col space-y-6">
        <h3 className="text-xl sm:text-2xl font-bold text-primary-dark">
          <span className="text-primary-light mr-2">{current}.</span>
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
                  className={`
                    flex items-center space-x-4 p-4 rounded-lg border-2 
                    cursor-pointer transition-all duration-150
                    ${
                      isSelected
                        ? 'bg-primary-dark border-primary-dark text-white' 
                        : 'bg-white border-gray-200 text-gray-700 hover:border-primary-light' 
                    }
                  `}
                >
                  <input
                    type="radio"
                    name={question.questionId}
                    value={option.questionOptionId!}
                    checked={isSelected}
                    onChange={() =>
                      onOptionSelect(question.questionId, option.questionOptionId!)
                    }
                    className={`
                      form-radio h-5 w-5 focus:ring-primary-light
                      ${isSelected ? 'text-white' : 'text-primary-dark'}
                    `}
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
