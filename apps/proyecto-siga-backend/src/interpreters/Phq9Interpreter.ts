import { AttentionLevel } from "@packages/common-types/assignmentScore.types";
import { ISectionInterpreter } from "../contracts/interpretation/ITestInterpreter";

export class Phq9Interpreter implements ISectionInterpreter {
  readonly testCode = "PHQ9";
  // El usuario solo ve su puntaje; la interpretación por secciones queda
  // reservada para el psicólogo (interpretación clínica).
  readonly userInterpretationMode = "scoreOnly" as const;

  interpretSection(sectionName: string, score: number): { interpretation: string; attentionLevel: AttentionLevel } {
    if (score <= 4) return { interpretation: "Sin depresion", attentionLevel: "none" };
    if (score <= 9) return { interpretation: "Depresion leve", attentionLevel: "low" };
    if (score <= 14) return { interpretation: "Depresion moderadamente", attentionLevel: "medium" };
    if (score <= 19) return { interpretation: "Depresion moderadamente grave", attentionLevel: "high" };
    return { interpretation: "Depresion grave", attentionLevel: "critic" };
  }
}
