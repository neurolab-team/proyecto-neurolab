import { AttentionLevel, SectionScore } from "@packages/common-types/assignmentScore.types";
import { IRawAnswerInterpreter } from "../contracts/interpretation/ITestInterpreter";
import { AnswerWithDetails } from "../contracts/answer/answer.types";

export class Who5Interpreter implements IRawAnswerInterpreter {
  readonly testCode = "WHO5";
  readonly userInterpretationMode = "scoreOnly" as const;

  calculateFromAnswers(answers: AnswerWithDetails[]): {
    sectionScores: SectionScore[];
    totalScore: number;
    attentionLevel: AttentionLevel;
    clinicalInterpretation?: string;
  } {
    // Suma de los valores marcados (crudo 0–25) y multiplicación por cuatro (0–100).
    const rawScore = answers.reduce(
      (sum, a) => sum + (a.option?.scoreValue?.toNumber() ?? 0),
      0,
    );
    const totalScore = rawScore * 4;

    const sectionScores: SectionScore[] = [
      {
        sectionName: "Índice de Bienestar (WHO-5)",
        totalScore,
        interpretation: `Puntaje total: ${totalScore}`,
        attentionLevel: "none",
      },
    ];

    const clinicalInterpretation =
      "Interpretación depende de la revisión de la prueba por el psicólogo.";

    return {
      sectionScores,
      totalScore,
      attentionLevel: "none",
      clinicalInterpretation,
    };
  }
}
