"use client";

import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useTest } from "./_hooks/useTest";
import { QuestionRendererFactory } from "./_components/QuestionRendererFactory";
import { GroupedBlockRenderer } from "./_components/renderers/GroupedBlockRenderer";
import { FollowUpQuestion } from "./_components/renderers/FollowUpQuestion";
import { TestProgress } from "./_components/TestProgress";
import { TestNavigation } from "./_components/TestNavigation";
import { getTestConfig } from "./_components/config/testConfigRegistry";
import { fadeSlideUp } from "@/libs/animation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function TestPage() {
  const params = useParams<{ assignmentId: string }>();
  const assignmentId = params?.assignmentId;
  const safeAssignmentId = assignmentId ?? "";

  const {
    isLoading,
    error,
    testCode,
    currentPage,
    selectedValue,
    currentQuestionNumber,
    totalQuestions,
    isFirstPage,
    isLastPage,
    isPageAnswered,
    actions,
  } = useTest(safeAssignmentId);

  const testConfig = getTestConfig(testCode || "DEFAULT");

  if (isLoading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{
          background: `linear-gradient(to bottom right, ${testConfig.colors.gradientFrom}, ${testConfig.colors.gradientVia}, ${testConfig.colors.gradientTo})`,
        }}
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
        style={{
          background: `linear-gradient(to bottom right, ${testConfig.colors.gradientFrom}, ${testConfig.colors.gradientVia}, ${testConfig.colors.gradientTo})`,
        }}
      >
        <div className="container mx-auto max-w-2xl p-4">
          {!currentPage ? (
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
                    key={
                      currentPage.type === "single"
                        ? currentPage.question.questionId
                        : currentPage.questions[0].questionId
                    }
                    variants={fadeSlideUp}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                  >
                    {currentPage.type === "single" ? (
                      <>
                        <QuestionRendererFactory
                          question={currentPage.question}
                          current={currentQuestionNumber}
                          selectedValue={selectedValue}
                          onOptionSelect={actions.selectAnswer}
                          testConfig={testConfig}
                        />
                        {currentPage.followUps.map((followUp) => (
                          <FollowUpQuestion
                            key={followUp.questionId}
                            question={followUp}
                            selectedValue={actions.getSelectedValue(followUp.questionId)}
                            onOptionSelect={actions.selectAnswer}
                            testConfig={testConfig}
                          />
                        ))}
                      </>
                    ) : (
                      <GroupedBlockRenderer
                        questions={currentPage.questions}
                        groupHeader={currentPage.groupHeader}
                        current={currentQuestionNumber}
                        getSelectedValue={actions.getSelectedValue}
                        onOptionSelect={actions.selectAnswer}
                        testConfig={testConfig}
                      />
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>

              <TestNavigation
                onBack={actions.goToBack}
                onNext={actions.goToNext}
                isFirst={isFirstPage}
                isLast={isLastPage}
                isAnswered={isPageAnswered}
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
