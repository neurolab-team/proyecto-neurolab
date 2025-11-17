type TestNavigationProps = {
  onBack: () => void;
  onNext: () => void;
  isFirst: boolean;
  isLast: boolean;
  isAnswered: boolean;
};

export const TestNavigation = ({
  onBack,
  onNext,
  isFirst,
  isLast,
  isAnswered
}: TestNavigationProps) => {
  return (
    <div className="flex justify-between mt-10">
      <button
        onClick={onBack}
        disabled={isFirst}
        className="
          px-6 py-3 rounded-lg font-semibold 
          bg-white border-2 border-primary-dark text-primary-dark 
          hover:bg-gray-50 
          disabled:opacity-40 disabled:cursor-not-allowed
          transition-all duration-150 shadow-sm"
      >
        Anterior
      </button>
      <button
        onClick={onNext}
        disabled={!isAnswered}
        className="
          px-6 py-3 rounded-lg font-semibold text-white 
          bg-gradient-to-br from-primary-dark to-primary-light 
          hover:shadow-lg hover:from-primary-dark hover:to-primary-light/90
          disabled:opacity-40 disabled:cursor-not-allowed
          transition-all duration-150 shadow-md"
      >
        {isLast ? "Finalizar Test" : "Siguiente"}
      </button>
    </div>
  );
};
