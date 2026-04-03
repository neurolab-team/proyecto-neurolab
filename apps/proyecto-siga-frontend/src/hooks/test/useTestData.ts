import { useState, useEffect } from "react";
import { testService } from "../../services/test/test";
import { Question } from "@packages/common-types/question.types";

export const useTestData = (assignmentId: string) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [title, setTitle] = useState("");
  const [testCode, setTestCode] = useState("");
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
        setTestCode(data.testCode ?? "");
      })
      .catch((err) => {
        const message =
          err?.response?.data?.message ?? "No se pudo cargar el test.";
        setError(message);
      })
      .finally(() => setIsLoading(false));
  }, [assignmentId]);

  return { questions, title, testCode, isLoading, error };
};
