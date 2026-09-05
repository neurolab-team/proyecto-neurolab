import { AttentionLevel, SectionScore } from "@packages/common-types/assignmentScore.types";
import { IRawAnswerInterpreter } from "../contracts/interpretation/ITestInterpreter";
import { AnswerWithDetails } from "../contracts/answer/answer.types";

/**
 * GAD-7 (Trastorno de Ansiedad Generalizada).
 *
 * Cálculo: suma de los valores marcados en todos los ítems con puntaje. El
 * ítem de texto abierto (fecha de inicio de síntomas) no aporta puntaje.
 *
 * Visualización:
 * - El usuario ve su puntaje total.
 * - El psicólogo ve la clasificación según los puntos de corte:
 *   ≤4 Ansiedad Mínima; ≤9 Ansiedad Media; ≤14 Ansiedad Moderada;
 *   >14 Ansiedad Moderada Severa.
 */
export class Gad7Interpreter implements IRawAnswerInterpreter {
  readonly testCode = "GAD7";
  // El usuario solo ve su puntaje; la clasificación clínica queda para el psicólogo.
  readonly userInterpretationMode = "scoreOnly" as const;

  calculateFromAnswers(answers: AnswerWithDetails[]): {
    sectionScores: SectionScore[];
    totalScore: number;
    attentionLevel: AttentionLevel;
    clinicalInterpretation?: string;
  } {
    const totalScore = answers.reduce(
      (sum, a) => sum + (a.option?.scoreValue?.toNumber() ?? 0),
      0,
    );

    const { interpretation, attentionLevel } = this.interpretTotal(totalScore);

    const sectionScores: SectionScore[] = [
      {
        sectionName: "Ansiedad (GAD-7)",
        totalScore,
        interpretation: `Puntaje total: ${totalScore}`,
        attentionLevel,
      },
    ];

    const clinicalInterpretation = `Evaluación GAD-7. Puntaje total: ${totalScore} — ${interpretation}.`;

    return { sectionScores, totalScore, attentionLevel, clinicalInterpretation };
  }

  /** Clasificación del GAD-7 según puntos de corte. */
  protected interpretTotal(total: number): {
    interpretation: string;
    attentionLevel: AttentionLevel;
  } {
    if (total <= 4) return { interpretation: "Ansiedad Mínima", attentionLevel: "none" };
    if (total <= 9) return { interpretation: "Ansiedad Media", attentionLevel: "low" };
    if (total <= 14) return { interpretation: "Ansiedad Moderada", attentionLevel: "medium" };
    return { interpretation: "Ansiedad Moderada Severa", attentionLevel: "high" };
  }
}
