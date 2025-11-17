import { useRouter } from "next/router";
import { useTest } from "../../hooks/useTest";
import { QuestionCard } from "../../components/test/QuestionCard";
import { TestProgress } from "../../components/test/TestProgress";
import { TestNavigation } from "../../components/test/TestNavigation";
import { motion, AnimatePresence } from 'framer-motion';
import { fadeSlideUp } from '../../libs/animation'; 
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

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

  if (!router.isReady || isLoading) { // Estilizar esta pantalla de carga también
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gradient-from via-gradient-via to-gradient-to">
        <div className="text-primary-dark text-xl font-semibold">
          Cargando...
        </div>
      </div>
    );
  }

  if (error) {
    return <div>Error: {error}</div>; // Estilizar esta página de error también
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 bg-gradient-to-br from-gradient-from via-gradient-via to-gradient-to py-16 sm:py-24">
        <div className="container mx-auto max-w-2xl p-4">
          
          {!currentQuestion ? (
            <div className="text-center text-primary-dark text-xl font-semibold">
              No se encontraron preguntas para este test.
            </div>
          ) : (
            <>
              <TestProgress
                current={currentQuestionNumber}
                total={totalQuestions}
              />
            
              <div className="mt-8">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentQuestion.questionId}                    
                    variants={fadeSlideUp}  
                    initial="initial"
                    animate="animate"
                    exit="exit"
                  >
                    <QuestionCard
                      question={currentQuestion}
                      current={currentQuestionNumber}
                      selectedValue={selectedValue}
                      onOptionSelect={actions.selectAnswer}
                    />
                  </motion.div>
                </AnimatePresence>
              </div>

              <TestNavigation
                onBack={actions.goToBack}
                onNext={actions.goToNext}
                isFirst={isFirstPage}
                isLast={isLastPage}
                isAnswered={selectedValue !== null}
              />
            </>
          )}

        </div>
      </main>
      <Footer />
    </div>
  );
}