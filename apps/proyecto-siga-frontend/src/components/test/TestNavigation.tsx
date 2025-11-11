type TestNavigationProps = {
  onBack: () => void;
  onNext: () => void;
  isFirst: boolean;
  isLast: boolean;
};
export const TestNavigation = ({ onBack, onNext, isFirst, isLast }: TestNavigationProps) => {
  return (
    <div className="flex justify-between mt-8">
      <button 
        onClick={onBack} 
        disabled={isFirst}
        className="px-6 py-2 rounded-md border bg-muted hover:bg-muted/80 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Anterior
      </button>
      <button 
        onClick={onNext}
        className="px-6 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90"
      >
        {isLast ? 'Finalizar Test' : 'Siguiente'}
      </button>
    </div>
  );
};