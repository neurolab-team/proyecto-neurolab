import { useState, useCallback } from "react";

export const useTestAnswers = () => {
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const selectAnswer = useCallback(
    (questionId: string, value: string) => {
      setAnswers((prev) => ({ ...prev, [questionId]: value }));
    },
    []
  );

  const getSelectedValue = useCallback(
    (questionId: string) => answers[questionId] ?? null,
    [answers]
  );

  return { answers, selectAnswer, getSelectedValue };
};
