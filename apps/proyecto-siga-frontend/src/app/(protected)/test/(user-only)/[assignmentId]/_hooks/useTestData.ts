import { useState, useEffect } from "react";
import { testService } from "@/services/test/test";
import { Question } from "@packages/common-types/question.types";

type ConsentStatus = "accepted" | "declined" | null;

export const useTestData = (assignmentId: string) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState<string | null>(null);
  const [testCode, setTestCode] = useState("");
  const [consentStatus, setConsentStatus] = useState<ConsentStatus>(null);
  const [requiresConsent, setRequiresConsent] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!assignmentId) return;

    setIsLoading(true);
    setError(null);

    testService
      .getTestForAssignment(assignmentId)
      .then((data) => {
        setQuestions(data.question as Question[]);
        setTitle(data.title);
        setDescription(data.description ?? null);
        setTestCode(data.testCode ?? "");
        setConsentStatus(data.consentStatus ?? null);
        setRequiresConsent(data.requiresConsent ?? true);
      })
      .catch((err) => {
        const message =
          err?.response?.data?.message ?? "No se pudo cargar el test.";
        setError(message);
      })
      .finally(() => setIsLoading(false));
  }, [assignmentId]);

  return {
    questions,
    title,
    description,
    testCode,
    consentStatus,
    requiresConsent,
    isLoading,
    error,
  };
};
