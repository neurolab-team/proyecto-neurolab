import { useCallback, useMemo, useRef, useState } from "react";
import { Question } from "@packages/common-types/question.types";
import {
  CheckContext,
  ConsistencyCheck,
  ConsistencyIssue,
  IssueAction,
} from "../_components/config/consistency.types";

type Page =
  | { type: "single"; question: Question; followUps: Question[] }
  | { type: "group"; questions: Question[]; groupHeader: string };

export type ActiveIssue = ConsistencyIssue & { checkId: string };

interface Params {
  checks: ConsistencyCheck[] | undefined;
  questions: Question[];
  answers: Record<string, string>;
  currentPage: Page | null;
  selectAnswer: (questionId: string, value: string) => void;
  goToCode: (code: string) => void;
}

const pageCodes = (page: Page | null): string[] => {
  if (!page) return [];
  const qs = page.type === "single" ? [page.question, ...page.followUps] : page.questions;
  return qs.map((q) => q.code).filter((c): c is string => Boolean(c));
};

/**
 * Ejecuta los chequeos de consistencia de la prueba al intentar avanzar y
 * gestiona el aviso: corregir, aplicar la corrección sugerida o confirmar.
 * Las confirmaciones se recuerdan por valores (`signature`), de modo que si el
 * usuario cambia sus respuestas el chequeo se vuelve a evaluar.
 */
export const useConsistencyChecks = ({
  checks,
  questions,
  answers,
  currentPage,
  selectAnswer,
  goToCode,
}: Params) => {
  const [issue, setIssue] = useState<ActiveIssue | null>(null);
  const confirmed = useRef(new Set<string>());

  const byCode = useMemo(
    () => new Map(questions.filter((q) => q.code).map((q) => [q.code as string, q])),
    [questions],
  );

  const ctx: CheckContext = useMemo(
    () => ({
      text: (code) => {
        const q = byCode.get(code);
        const v = q ? answers[q.questionId] : undefined;
        return v && v.trim() !== "" ? v : null;
      },
      optionLabel: (code) => {
        const q = byCode.get(code);
        const id = q ? answers[q.questionId] : undefined;
        return q?.questionOption.find((o) => o.questionOptionId === id)?.label ?? null;
      },
      optionIdByLabel: (code, label) =>
        byCode.get(code)?.questionOption.find((o) => o.label === label)?.questionOptionId ?? null,
    }),
    [byCode, answers],
  );

  /** `true` si se puede avanzar; si no, deja abierto el primer aviso pendiente. */
  const runChecks = useCallback((): boolean => {
    if (!checks?.length) return true;
    const codes = new Set(pageCodes(currentPage));

    for (const check of checks) {
      if (!check.runOn.some((c) => codes.has(c))) continue;
      const result = check.check(ctx);
      if (!result) continue;
      if (confirmed.current.has(`${check.id}:${result.signature}`)) continue;
      setIssue({ ...result, checkId: check.id });
      return false;
    }
    return true;
  }, [checks, currentPage, ctx]);

  /** El usuario confirma que su respuesta es correcta. */
  const confirm = useCallback(() => {
    if (issue) confirmed.current.add(`${issue.checkId}:${issue.signature}`);
    setIssue(null);
  }, [issue]);

  /** Cierra el aviso y, si la acción lo indica, lleva a la pregunta a corregir. */
  const correct = useCallback(
    (action: IssueAction) => {
      setIssue(null);
      if (action.goToCode) goToCode(action.goToCode);
    },
    [goToCode],
  );

  /** Aplica la corrección sugerida; el usuario revisa y vuelve a pulsar "Siguiente". */
  const applyQuickFix = useCallback(() => {
    if (!issue?.quickFix) return;
    for (const [code, value] of Object.entries(issue.quickFix.answers)) {
      const q = byCode.get(code);
      if (q) selectAnswer(q.questionId, value);
    }
    setIssue(null);
  }, [issue, byCode, selectAnswer]);

  return { issue, runChecks, confirm, correct, applyQuickFix };
};
