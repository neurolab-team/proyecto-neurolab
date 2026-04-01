import { AttentionLevel } from "@packages/common-types/assignmentScore.types";
import { ITestInterpreter } from "../contracts/interpretation/ITestInterpreter";

export class Dass21Interpreter implements ITestInterpreter {
  readonly testCode = "DASS-21";

  private normalize(sectionName: string): string {
    return sectionName.toLowerCase();
  }

  interpretSection(sectionName: string, score: number): { interpretation: string; attentionLevel: AttentionLevel } {
    const s = this.normalize(sectionName);

    if (s.includes("depresion")) {
      if (score < 5)  return { interpretation: "Normal", attentionLevel: "none" };
      if (score <= 6) return { interpretation: "Depresion leve", attentionLevel: "low" };
      if (score <= 10) return { interpretation: "Depresion moderada", attentionLevel: "medium" };
      if (score <= 13) return { interpretation: "Depresion severa", attentionLevel: "high" };
      return { interpretation: "Depresion extremadamente severa", attentionLevel: "high" };
    }

    if (s.includes("ansiedad")) {
      if (score < 4)  return { interpretation: "Normal", attentionLevel: "none" };
      if (score === 4) return { interpretation: "Ansiedad leve", attentionLevel: "low" };
      if (score <= 7) return { interpretation: "Ansiedad moderada", attentionLevel: "medium" };
      if (score <= 9) return { interpretation: "Ansiedad severa", attentionLevel: "high" };
      return { interpretation: "Ansiedad extremadamente severa", attentionLevel: "high" };
    }

    if (s.includes("estres")) {
      if (score < 8)  return { interpretation: "Normal", attentionLevel: "none" };
      if (score <= 9) return { interpretation: "Estrés leve", attentionLevel: "low" };
      if (score <= 12) return { interpretation: "Estrés moderado", attentionLevel: "medium" };
      if (score <= 16) return { interpretation: "Estrés severo", attentionLevel: "high" };
      return { interpretation: "Estrés extremadamente severo", attentionLevel: "high" };
    }

    return { interpretation: "No interpretado", attentionLevel: "none" };
  }
}