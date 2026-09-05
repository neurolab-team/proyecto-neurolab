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

  // Variante múltiple: se muestra si en CUALQUIERA de las preguntas de `anyOf`
  // la opción marcada tiene un `value` numérico >= `showWhenValueAtLeast`.
  if ("anyOf" in cond) {
    return cond.anyOf.some((depCode) => {
      const depQuestion = questions.find((q) => q.code === depCode);
      if (!depQuestion) return false;

      const selectedOptionId = answers[depQuestion.questionId];
      if (!selectedOptionId) return false;

      const selectedOption = depQuestion.questionOption.find(
        (o) => o.questionOptionId === selectedOptionId,
      );
      const value = Number(selectedOption?.value);
      return Number.isFinite(value) && value >= cond.showWhenValueAtLeast;
    });
  }

  // Variante clásica: se muestra salvo que la opción elegida en `dependsOn`
  // tenga la etiqueta `showWhenNot`.
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
    const cond = q.condition;
    if (!cond) continue;
    if ("anyOf" in cond) {
      for (const c of cond.anyOf) codes.add(c);
    } else if (cond.dependsOn) {
      codes.add(cond.dependsOn);
    }
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
