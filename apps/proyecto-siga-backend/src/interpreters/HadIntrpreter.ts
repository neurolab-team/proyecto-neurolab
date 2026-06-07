import { AttentionLevel } from "@packages/common-types/assignmentScore.types";
import { ISectionInterpreter } from "../contracts/interpretation/ITestInterpreter";

export class HadInterpreter implements ISectionInterpreter {
  readonly testCode = "HAD";

  interpretSection(sectionName: string, score: number): { interpretation: string; attentionLevel: AttentionLevel } {
    if (score <= 7) return { interpretation: "Normal", attentionLevel: "none" };
    if (score <= 9) return { interpretation: "Sospecha o límite", attentionLevel: "medium" };
    return { interpretation: "Probable caso clínico", attentionLevel: "high" };
  }
}
