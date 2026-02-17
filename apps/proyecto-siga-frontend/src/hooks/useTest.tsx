import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { testService } from "../services/test/test";
import { Question } from "@packages/common-types/question.types";
import { assignmentScoreService } from "../services/assignmentScore/assignmentScore";

export const useTest = (assigmentId: string) => {

  const [questions, setQuestions] = useState<Question[]>([]);
  const [title, setTitle] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const router = useRouter();
  useEffect(() => {
    if (assigmentId) {
      setIsLoading(true);
      testService
        .getTestForAssignment(assigmentId as string)
        .then((data) => {
          setQuestions(data.question);
          setTitle(data.title);
        })
        .catch((err) => setError("No se pudo cargar el test."))
        .finally(() => setIsLoading(false));    }
  }, [assigmentId]);

  const submitTest = async () => {
    setIsSubmitting(true);
    try {
      await testService.submitTestAnswers(assigmentId as string, answers);      
      await assignmentScoreService.submitAssignmentScore(assigmentId as string);      
      router.push("/test/completed");
      
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "Hubo un error al enviar tus respuestas. Por favor, intenta de nuevo.";
      // Mostrar el mensaje de error al usuario
      alert(errorMessage); //cambiarlo por un modal o toast      
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectAnswer = (questionId: string, value: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };

  const goToNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      submitTest();
    }
  };

  const goToBack = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };
  const currentQuestion = questions[currentQuestionIndex];
  const totalQuestions = questions.length;

  const selectedValue = currentQuestion
    ? answers[currentQuestion.questionId] || null
    : null;
  const isFirstPage = currentQuestionIndex === 0;
  const isLastPage = currentQuestionIndex === totalQuestions - 1;

  return {
    isLoading: isLoading || isSubmitting,
    error,
    title,
    currentQuestion,
    selectedValue,
    currentQuestionNumber: currentQuestionIndex + 1,
    totalQuestions,
    isFirstPage,
    isLastPage,
    actions: {
      selectAnswer,
      goToNext,
      goToBack,
    },
  };
};
