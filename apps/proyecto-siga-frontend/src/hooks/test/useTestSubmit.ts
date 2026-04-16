import { useState, useCallback } from "react";
import { useRouter } from "next/router";
import { testService } from "../../services/test/test";
import { assignmentScoreService } from "../../services/assignmentScore/assignmentScore";
import { Question } from "@packages/common-types/question.types";

export const useTestSubmit = (assignmentId: string) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const router = useRouter();

  const submitTest = useCallback(
    async (answers: Record<string, string>, questions: Question[]) => {
      setIsSubmitting(true);
      setSubmitError(null);

      try {
        await testService.submitTestAnswers(assignmentId, answers, questions);
        await assignmentScoreService.submitAssignmentScore(assignmentId);
        router.push("/test/completed");
      } catch (err: any) {
        const message =
          err?.response?.data?.message ??
          "Hubo un error al enviar tus respuestas. Por favor, intenta de nuevo.";
        setSubmitError(message);
      } finally {
        setIsSubmitting(false);
      }
    },
    [assignmentId, router]
  );

  return { submitTest, isSubmitting, submitError };
};
