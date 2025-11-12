import { useRouter } from 'next/router'; 

import { useTest } from '../../hooks/useTest';
import { QuestionCard } from '../../components/test/QuestionCard';
import { TestProgress } from '../../components/test/TestProgress';
import { TestNavigation } from '../../components/test/TestNavigation';

export default function TestPage() {
  
  const router = useRouter();
  
  const { assignmentId } = router.query;

  const {
    isLoading,
    error,
    currentQuestion, 
    selectedValue,
    currentQuestionNumber,
    totalQuestions,
    isFirstPage,
    isLastPage,
    actions, 
  } = useTest(assignmentId as string);

  if (!router.isReady || isLoading) {
    return <div>Cargando...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="container mx-auto max-w-2xl p-4 mt-10">
      
      <TestProgress 
        current={currentQuestionNumber} 
        total={totalQuestions} 
      />

      <div className="mt-8">
        <QuestionCard 
          question={currentQuestion}
          current={currentQuestionNumber} 
          selectedValue={selectedValue}
          onOptionSelect={actions.selectAnswer} 
        />
      </div>

      <TestNavigation 
        onBack={actions.goToBack}   
        onNext={actions.goToNext}   
        isFirst={isFirstPage}
        isLast={isLastPage}
      />

    </div>
  );
}
