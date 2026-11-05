import { useCallback, useMemo, useRef } from "react";
import { useTestData } from "./useTestData";
import { useTestAnswers } from "./useTestAnswers";
import { useTestNavigation } from "./useTestNavigation";
import { useTestSubmit } from "./useTestSubmit";
import { useConsistencyChecks } from "./useConsistencyChecks";
import { getTestConfig } from "../_components/config/testConfigRegistry";
import { createLocalStorageProgress } from "@/libs/testProgressStorage";

export const useTest = (assignmentId: string) => {
  const storage = useMemo(
    () => assignmentId ? createLocalStorageProgress(assignmentId) : null,
    [assignmentId],
  );

  const saved = useMemo(() => storage?.load() ?? null, [storage]);
  const currentIndexRef = useRef(saved?.currentIndex ?? 0);

  const { questions, title, description, testCode, isLoading, error } =
    useTestData(assignmentId);

  const { answers, selectAnswer, getSelectedValue } = useTestAnswers(
    saved?.answers ?? {},
    (next) => storage?.save({ answers: next, currentIndex: currentIndexRef.current }),
  );

  const navigation = useTestNavigation(
    questions,
    answers,
    saved?.currentIndex ?? 0,
    (index) => {
      currentIndexRef.current = index;
      storage?.save({ answers, currentIndex: index });
    },
  );

  const { currentPage } = navigation;

  const isPageAnswered = (() => {
    if (!currentPage) return false;
    const pageQuestions =
      currentPage.type === "single"
        ? [currentPage.question, ...currentPage.followUps]
        : currentPage.questions;
    return pageQuestions
      .filter((q) => q.required !== false)
      .every((q) => {
        const val = getSelectedValue(q.questionId);
        return val !== null && val.trim() !== '';
      });
  })();

  const selectedValue = navigation.currentQuestion
    ? getSelectedValue(navigation.currentQuestion.questionId)
    : null;

  const { submitTest, isSubmitting, submitError } = useTestSubmit(
    assignmentId,
    () => storage?.clear(),
  );

  const consistency = useConsistencyChecks({
    checks: getTestConfig(testCode || "DEFAULT").consistencyChecks,
    questions,
    answers,
    currentPage,
    selectAnswer,
    goToCode: navigation.goToCode,
  });

  const proceed = useCallback(() => {
    if (navigation.isLastPage) {
      submitTest(answers, questions);
    } else {
      navigation.goToNext();
    }
  }, [navigation, submitTest, answers, questions]);

  const handleNext = useCallback(() => {
    if (!isPageAnswered) return;
    if (!consistency.runChecks()) return;
    proceed();
  }, [isPageAnswered, consistency, proceed]);

  // Tras confirmar un aviso se vuelven a evaluar los demás chequeos de la página.
  const confirmIssue = useCallback(() => {
    consistency.confirm();
    if (consistency.runChecks()) proceed();
  }, [consistency, proceed]);

  return {
    isLoading: isLoading || isSubmitting,
    error: error ?? submitError,
    title,
    description,
    testCode,
    currentPage,
    currentQuestion: navigation.currentQuestion,
    selectedValue,
    currentQuestionNumber: navigation.currentQuestionNumber,
    totalQuestions: navigation.totalQuestions,
    isFirstPage: navigation.isFirstPage,
    isLastPage: navigation.isLastPage,
    isPageAnswered,
    consistencyIssue: consistency.issue,
    actions: {
      selectAnswer,
      getSelectedValue,
      goToNext: handleNext,
      goToBack: navigation.goToBack,
      confirmIssue,
      correctIssue: consistency.correct,
      applyIssueFix: consistency.applyQuickFix,
    },
  };
};
