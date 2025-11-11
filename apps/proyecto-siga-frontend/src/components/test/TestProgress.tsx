type TestProgressProps = {
  current: number;
  total: number;
};

export const TestProgress = ({ current, total }: TestProgressProps) => {
  const percentage = (current / total) * 100;
  return (
    <div className="w-full space-y-2">
      <div className="flex justify-between text-sm text-muted-foreground">
        <span>Test DASS-21</span>
        <span>Pregunta <span className="font-bold">{current}</span> de <span className="font-bold">{total}</span></span>
      </div>
      <div className="w-full bg-muted rounded-full h-2.5">
        <div 
          className="bg-primary h-2.5 rounded-full" 
          style={{ width: `${percentage}%`, transition: 'width 0.3s' }}
        ></div>
      </div>
    </div>
  );
};