import { AttentionLevel } from "@packages/common-types/assignmentScore.types";
import { ISectionInterpreter } from "../contracts/interpretation/ITestInterpreter";

export class EpworthInterpreter implements ISectionInterpreter {
  readonly testCode = "EPWORTH";

  interpretSection(sectionName: string, score: number): { interpretation: string; attentionLevel: AttentionLevel } {
    if (score <= 6) return { interpretation: "Sueño Normal", attentionLevel: "none" };
    if (score <= 8) return { interpretation: "Somnolencia Media", attentionLevel: "medium" };
    return { interpretation: "Somnolencia Anormal", attentionLevel: "high" };
  }
}
