import { useRouter } from "next/router";
import { useTest } from "../../hooks/useTest";
import { QuestionRendererFactory } from "../../components/test/renderers/QuestionRendererFactory";
import { TestProgress } from "../../components/test/TestProgress";
import { TestNavigation } from "../../components/test/TestNavigation";
import { getTestConfig } from "../../components/test/config/testConfigRegistry";
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
    testCode,
    currentQuestion,
    selectedValue,
    currentQuestionNumber,
    totalQuestions,
    isFirstPage,
    isLastPage,
    actions,
  } = useTest(assignmentId as string);

  const testConfig = getTestConfig(testCode || 'DEFAULT');

  if (!router.isReady || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center"
        style={{ background: `linear-gradient(to bottom right, ${testConfig.colors.gradientFrom}, ${testConfig.colors.gradientVia}, ${testConfig.colors.gradientTo})` }}
      >
        <div className="text-xl font-semibold" style={{ color: testConfig.colors.primaryDark }}>
          Cargando...
        </div>
      </div>
    );
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main
        className="flex-1 py-16 sm:py-24"
        style={{ background: `linear-gradient(to bottom right, ${testConfig.colors.gradientFrom}, ${testConfig.colors.gradientVia}, ${testConfig.colors.gradientTo})` }}
      >
        <div className="container mx-auto max-w-2xl p-4">
          {!currentQuestion ? (
            <div className="text-center text-xl font-semibold" style={{ color: testConfig.colors.primaryDark }}>
              No se encontraron preguntas para este test.
            </div>
          ) : (
            <>
              <TestProgress
                current={currentQuestionNumber}
                total={totalQuestions}
                testConfig={testConfig}
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
                    <QuestionRendererFactory
                      question={currentQuestion}
                      current={currentQuestionNumber}
                      selectedValue={selectedValue}
                      onOptionSelect={actions.selectAnswer}
                      testConfig={testConfig}
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
                testConfig={testConfig}
              />
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
