import { AttentionLevel } from "@packages/common-types/assignmentScore.types";
export interface ITestInterpreter {
  readonly testCode?: string;
  interpretSection(sectionName: string, score: number): { interpretation: string; attentionLevel: AttentionLevel };
}