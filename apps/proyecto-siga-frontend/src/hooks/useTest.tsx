import { useCallback } from "react";
import { useTestData } from "./test/useTestData";
import { useTestAnswers } from "./test/useTestAnswers";
import { useTestNavigation } from "./test/useTestNavigation";
import { useTestSubmit } from "./test/useTestSubmit";

export const useTest = (assignmentId: string) => {
  const { questions, title, testCode, isLoading, error } =
    useTestData(assignmentId);

  const { answers, selectAnswer, getSelectedValue } = useTestAnswers();
  const navigation = useTestNavigation(questions, answers);

  const { currentPage } = navigation;

  // For single pages, check if answered. For groups, check all required answered.
  const isPageAnswered = (() => {
    if (!currentPage) return false;
    if (currentPage.type === "single") {
      const val = getSelectedValue(currentPage.question.questionId);
      return val !== null && val.trim() !== '';
    }
    return currentPage.questions
      .filter((q) => q.required !== false)
      .every((q) => {
        const val = getSelectedValue(q.questionId);
        return val !== null && val.trim() !== '';
      });
  })();

  const selectedValue = navigation.currentQuestion
    ? getSelectedValue(navigation.currentQuestion.questionId)
    : null;

  const { submitTest, isSubmitting, submitError } =
    useTestSubmit(assignmentId);

  const handleNext = useCallback(() => {
    if (!isPageAnswered) return;
    if (navigation.isLastPage) {
      submitTest(answers, questions);
    } else {
      navigation.goToNext();
    }
  }, [navigation, submitTest, answers, questions, isPageAnswered]);

  return {
    isLoading: isLoading || isSubmitting,
    error: error ?? submitError,
    title,
    testCode,
    currentPage,
    currentQuestion: navigation.currentQuestion,
    selectedValue,
    currentQuestionNumber: navigation.currentQuestionNumber,
    totalQuestions: navigation.totalQuestions,
    isFirstPage: navigation.isFirstPage,
    isLastPage: navigation.isLastPage,
    isPageAnswered,
    actions: {
      selectAnswer,
      getSelectedValue,
      goToNext: handleNext,
      goToBack: navigation.goToBack,
    },
  };
};
