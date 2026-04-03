import { TestConfig } from './config/testConfig.types';

type TestProgressProps = {
  current: number;
  total: number;
  testConfig: TestConfig;
};

export const TestProgress = ({ current, total, testConfig }: TestProgressProps) => {
  const percentage = (current / total) * 100;
  return (
    <div className="w-full space-y-3 px-2">
      <div className="flex justify-between text-sm font-medium" style={{ color: testConfig.colors.primaryDark }}>
        <span className="font-bold text-lg">{testConfig.displayName}</span>
        <span className="text-gray-600">
          Pregunta{" "}
          <span className="font-bold" style={{ color: testConfig.colors.primaryDark }}>{current}</span> de{" "}
          <span className="font-bold" style={{ color: testConfig.colors.primaryDark }}>{total}</span>
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div
          className="h-2.5 rounded-full shadow-md"
          style={{
            width: `${percentage}%`,
            backgroundColor: testConfig.colors.primaryLight,
            transition: "width 0.4s ease-in-out",
          }}
        ></div>
      </div>
    </div>
  );
};
