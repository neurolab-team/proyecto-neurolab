import { TestQuestionDto } from "@packages/common-schemas/test.schemas";

type QuestionCardProps = {
  question: TestQuestionDto;
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
          {question.options
            .filter((option) => option.value !== null)
            .map((option) => {
              
              // Variable para saber si está seleccionada
              const isSelected = selectedValue === option.id;

              return (
                <label
                  key={option.id}
                  className={`
                    flex items-center space-x-4 p-4 rounded-lg border-2 
                    cursor-pointer transition-all duration-150
                    ${
                      isSelected
                        ? 'bg-primary-dark border-primary-dark text-white' // <-- ESTILO SELECCIONADO
                        : 'bg-white border-gray-200 text-gray-700 hover:border-primary-light' // <-- ESTILO NORMAL
                    }
                  `}
                >
                  <input
                    type="radio"
                    name={question.id}
                    value={option.id!}
                    checked={isSelected}
                    onChange={() =>
                      onOptionSelect(question.id, option.id!)
                    }
                    // El color del check cambia con el fondo
                    className={`
                      form-radio h-5 w-5 focus:ring-primary-light
                      ${isSelected ? 'text-white' : 'text-primary-dark'}
                    `}
                  />
                  {/* El span hereda el color (text-white or text-gray-700) desde la label */}
                  <span className="text-base">{option.label}</span>
                </label>
              );
            })}
        </div>
      </div>
    </div>
  );
};