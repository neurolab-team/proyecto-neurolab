import { AttentionLevel } from "@packages/common-types/assignmentScore.types";
import { ISectionInterpreter } from "../contracts/interpretation/ITestInterpreter";

export class HadInterpreter implements ISectionInterpreter {
  readonly testCode = "HAD";
  // El usuario solo ve su puntaje; la interpretación por secciones queda
  // reservada para el psicólogo (interpretación clínica).
  readonly userInterpretationMode = "scoreOnly" as const;

  interpretSection(sectionName: string, score: number): { interpretation: string; attentionLevel: AttentionLevel } {
    if (score <= 7) return { interpretation: "Normal", attentionLevel: "none" };
    if (score <= 9) return { interpretation: "Sospecha o límite", attentionLevel: "medium" };
    return { interpretation: "Probable caso clínico", attentionLevel: "high" };
  }
}
