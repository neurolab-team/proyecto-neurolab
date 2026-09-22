import { AttentionLevel, SectionScore } from "@packages/common-types/assignmentScore.types";
import { IRawAnswerInterpreter } from "../contracts/interpretation/ITestInterpreter";
import { AnswerWithDetails } from "../contracts/answer/answer.types";

export class EpworthInterpreter implements IRawAnswerInterpreter {
  readonly testCode = "EPWORTH";

  private static readonly SECTION_NAME = "Puntuacion Escala de Somnolencia de Epworth (ESS)";

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
        sectionName: EpworthInterpreter.SECTION_NAME,
        totalScore,
        interpretation,
        attentionLevel,
      },
    ];

    const clinicalInterpretation = this.buildClinicalInterpretation(
      totalScore,
      interpretation,
      attentionLevel,
    );

    return { sectionScores, totalScore, attentionLevel, clinicalInterpretation };
  }

  protected interpretTotal(total: number): {
    interpretation: string;
    attentionLevel: AttentionLevel;
  } {
    if (total <= 6) return { interpretation: "Sueño Normal", attentionLevel: "none" };
    if (total <= 8) return { interpretation: "Somnolencia Media", attentionLevel: "medium" };
    return { interpretation: "Somnolencia Anormal", attentionLevel: "high" };
  }

  /**
   * Interpretación clínica para el psicólogo (Epworth), con el mismo estilo
   * narrativo que PSQI: puntuación total, clasificación y nivel de atención.
   */
  protected buildClinicalInterpretation(
    totalScore: number,
    interpretation: string,
    attentionLevel: AttentionLevel,
  ): string {
    return (
      `Evaluación ${EpworthInterpreter.SECTION_NAME} ` +
      `Puntuación total: ${totalScore}/24 — ${interpretation}. Nivel de atención: ${attentionLevel}.`
    );
  }
}
