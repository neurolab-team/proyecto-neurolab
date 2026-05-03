import { useState, useCallback, useRef } from "react";

export const useTestAnswers = (
  initialAnswers: Record<string, string> = {},
  onAnswersChange?: (answers: Record<string, string>) => void,
) => {
  const [answers, setAnswers] = useState<Record<string, string>>(initialAnswers);
  const onChangeRef = useRef(onAnswersChange);
  onChangeRef.current = onAnswersChange;

  const selectAnswer = useCallback(
    (questionId: string, value: string) => {
      setAnswers((prev) => {
        const next = { ...prev, [questionId]: value };
        onChangeRef.current?.(next);
        return next;
      });
    },
    []
  );

  const getSelectedValue = useCallback(
    (questionId: string) => answers[questionId] ?? null,
    [answers]
  );

  return { answers, selectAnswer, getSelectedValue };
};
