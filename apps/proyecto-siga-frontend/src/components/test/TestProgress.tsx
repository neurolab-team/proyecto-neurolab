type TestProgressProps = {
  current: number;
  total: number;
};

export const TestProgress = ({ current, total }: TestProgressProps) => {
  const percentage = (current / total) * 100;
  return (
    <div className="w-full space-y-3 px-2">
      <div className="flex justify-between text-sm font-medium text-primary-dark">
        <span className="font-bold text-lg">Test DASS-21</span>
        <span className="text-gray-600">
          Pregunta{" "}
          <span className="font-bold text-primary-dark">{current}</span> de{" "}
          <span className="font-bold text-primary-dark">{total}</span>
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div
          className="bg-primary-light h-2.5 rounded-full shadow-md" 
          style={{
            width: `${percentage}%`,
            transition: "width 0.4s ease-in-out",
          }}
        ></div>
      </div>
    </div>
  );
};
