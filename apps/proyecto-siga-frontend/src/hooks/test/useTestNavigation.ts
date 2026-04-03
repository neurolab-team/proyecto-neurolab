import { useState, useCallback, useMemo } from "react";
import { Question } from "@packages/common-types/question.types";

export const useTestNavigation = (questions: Question[]) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const totalQuestions = questions.length;
  const currentQuestion = questions[currentIndex] ?? null;
  const isFirstPage = currentIndex === 0;
  const isLastPage = currentIndex === totalQuestions - 1;

  const goToNext = useCallback(() => {
    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  }, [currentIndex, totalQuestions]);

  const goToBack = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  }, [currentIndex]);

  return useMemo(
    () => ({
      currentQuestion,
      currentQuestionNumber: currentIndex + 1,
      totalQuestions,
      isFirstPage,
      isLastPage,
      goToNext,
      goToBack,
    }),
    [currentQuestion, currentIndex, totalQuestions, isFirstPage, isLastPage, goToNext, goToBack]
  );
};
