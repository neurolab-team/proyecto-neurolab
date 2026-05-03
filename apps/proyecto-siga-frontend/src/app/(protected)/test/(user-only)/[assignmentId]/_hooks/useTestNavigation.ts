import { useState, useCallback, useMemo, useRef } from "react";
import { Question } from "@packages/common-types/question.types";

type NavPage = { type: "single"; question: Question } | { type: "group"; questions: Question[]; groupHeader: string };

function isConditionMet(
  question: Question,
  questions: Question[],
  answers: Record<string, string>,
): boolean {
  const cond = question.condition;
  if (!cond) return true;

  const depQuestion = questions.find((q) => q.code === cond.dependsOn);
  if (!depQuestion) return true;

  const selectedOptionId = answers[depQuestion.questionId];
  if (!selectedOptionId) return false;

  const selectedOption = depQuestion.questionOption.find(
    (o) => o.questionOptionId === selectedOptionId,
  );
  return selectedOption?.label !== cond.showWhenNot;
}

function buildPages(questions: Question[], answers: Record<string, string>): NavPage[] {
  const visible = questions.filter((q) => isConditionMet(q, questions, answers));
  const pages: NavPage[] = [];
  const grouped = new Set<string>();

  for (const q of visible) {
    const group = q.metadata?.group;
    if (group) {
      if (grouped.has(group)) continue;
      grouped.add(group);
      const groupQuestions = visible.filter((gq) => gq.metadata?.group === group);
      const headerQ = groupQuestions.find((gq) => gq.metadata?.groupHeader);
      pages.push({
        type: "group",
        questions: groupQuestions,
        groupHeader: headerQ?.metadata?.groupHeader ?? "",
      });
    } else {
      pages.push({ type: "single", question: q });
    }
  }
  return pages;
}

/**
 * Extract only the answer values that affect conditional visibility,
 * so pages don't recompute on every keystroke within a group.
 */
function getConditionKeys(questions: Question[]): string[] {
  const codes = new Set<string>();
  for (const q of questions) {
    if (q.condition?.dependsOn) codes.add(q.condition.dependsOn);
  }
  const ids: string[] = [];
  for (const q of questions) {
    if (q.code && codes.has(q.code)) ids.push(q.questionId);
  }
  return ids;
}

export const useTestNavigation = (
  questions: Question[],
  answers: Record<string, string> = {},
  initialIndex = 0,
  onIndexChange?: (index: number) => void,
) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const onIndexChangeRef = useRef(onIndexChange);
  onIndexChangeRef.current = onIndexChange;

  // Only recompute pages when condition-relevant answers change
  const conditionKeys = useMemo(() => getConditionKeys(questions), [questions]);
  const conditionSignature = conditionKeys.map((k) => answers[k] ?? "").join("|");

  const pages = useMemo(
    () => buildPages(questions, answers),
    [questions, conditionSignature],
  );

  const totalPages = pages.length;
  const currentPage = pages[currentIndex] ?? null;
  const isFirstPage = currentIndex === 0;
  const isLastPage = currentIndex === totalPages - 1;

  const goToNext = useCallback(() => {
    if (currentIndex < totalPages - 1) {
      setCurrentIndex((prev) => {
        const next = prev + 1;
        onIndexChangeRef.current?.(next);
        return next;
      });
    }
  }, [currentIndex, totalPages]);

  const goToBack = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => {
        const next = prev - 1;
        onIndexChangeRef.current?.(next);
        return next;
      });
    }
  }, [currentIndex]);

  const currentQuestion = currentPage?.type === "single" ? currentPage.question : null;

  return useMemo(
    () => ({
      currentPage,
      currentQuestion,
      currentQuestionNumber: currentIndex + 1,
      totalQuestions: totalPages,
      isFirstPage,
      isLastPage,
      goToNext,
      goToBack,
    }),
    [currentPage, currentQuestion, currentIndex, totalPages, isFirstPage, isLastPage, goToNext, goToBack],
  );
};
