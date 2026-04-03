import { useCallback } from "react";
import { useTestData } from "./test/useTestData";
import { useTestAnswers } from "./test/useTestAnswers";
import { useTestNavigation } from "./test/useTestNavigation";
import { useTestSubmit } from "./test/useTestSubmit";

export const useTest = (assignmentId: string) => {
  const { questions, title, testCode, isLoading, error } =
    useTestData(assignmentId);

  const { answers, selectAnswer, getSelectedValue } = useTestAnswers();
  const navigation = useTestNavigation(questions);

  const selectedValue = navigation.currentQuestion
    ? getSelectedValue(navigation.currentQuestion.questionId)
    : null;

  const { submitTest, isSubmitting, submitError } =
    useTestSubmit(assignmentId);

  const handleNext = useCallback(() => {
    if (selectedValue === null) return;
    if (navigation.isLastPage) {
      submitTest(answers);
    } else {
      navigation.goToNext();
    }
  }, [navigation, submitTest, answers, selectedValue]);

  return {
    isLoading: isLoading || isSubmitting,
    error: error ?? submitError,
    title,
    testCode,
    currentQuestion: navigation.currentQuestion,
    selectedValue,
    currentQuestionNumber: navigation.currentQuestionNumber,
    totalQuestions: navigation.totalQuestions,
    isFirstPage: navigation.isFirstPage,
    isLastPage: navigation.isLastPage,
    actions: {
      selectAnswer,
      goToNext: handleNext,
      goToBack: navigation.goToBack,
    },
  };
};
