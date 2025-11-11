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
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
      <div className="flex flex-col space-y-4">
        <h3 className="text-lg font-semibold">
          <span className="text-muted-foreground mr-2">{current}.</span>
          {question.prompt}
        </h3>
        <div className="flex flex-col space-y-3">
          {question.options
            .filter((option) => option.value !== null)
            .map((option) => (
            <label
              key={option.id}
              className={`flex items-center space-x-3 p-3 rounded-md border cursor-pointer hover:bg-accent ${selectedValue === option.value ? "border-primary ring-2 ring-primary" : ""}`}
            >
              <input
                type="radio"
                name={question.id}
                value={option.value!}
                checked={selectedValue === option.value}
                onChange={() =>
                  onOptionSelect(question.id, option.value!)
                }
                className="form-radio h-5 w-5 text-primary"
              />
              <span>{option.label}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};
