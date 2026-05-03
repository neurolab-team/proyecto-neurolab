import { TestConfig } from './config/testConfig.types';

type TestNavigationProps = {
  onBack: () => void;
  onNext: () => void;
  isFirst: boolean;
  isLast: boolean;
  isAnswered: boolean;
  testConfig: TestConfig;
};

export const TestNavigation = ({
  onBack,
  onNext,
  isFirst,
  isLast,
  isAnswered,
  testConfig,
}: TestNavigationProps) => {
  const { colors } = testConfig;

  return (
    <div className="flex justify-between mt-10">
      <button
        onClick={onBack}
        disabled={isFirst}
        className="px-6 py-3 rounded-lg font-semibold bg-white border-2 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-150 shadow-sm"
        style={{ borderColor: colors.primaryDark, color: colors.primaryDark }}
      >
        Anterior
      </button>
      <button
        onClick={onNext}
        disabled={!isAnswered}
        className="px-6 py-3 rounded-lg font-semibold text-white hover:shadow-lg disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-150 shadow-md"
        style={{ background: `linear-gradient(to bottom right, ${colors.primaryDark}, ${colors.primaryLight})` }}
      >
        {isLast ? "Finalizar Test" : "Siguiente"}
      </button>
    </div>
  );
};
