import { AttentionLevel, SectionScore } from "@packages/common-types/assignmentScore.types";
import { AnswerWithDetails } from "../answer/answer.types";

/**
 * Simple interpreter: scores are pre-summed by section (e.g. DASS-21, HAD).
 */
export interface ISectionInterpreter {
  readonly testCode?: string;
  interpretSection(sectionName: string, score: number): { interpretation: string; attentionLevel: AttentionLevel };
}

/**
 * Complex interpreter: receives raw answers and calculates everything (e.g. PSQI).
 */
export interface IRawAnswerInterpreter {
  readonly testCode?: string;
  calculateFromAnswers(answers: AnswerWithDetails[]): {
    sectionScores: SectionScore[];
    totalScore: number;
    attentionLevel: AttentionLevel;
  };
}

export type ITestInterpreter = ISectionInterpreter | IRawAnswerInterpreter;

export function isRawAnswerInterpreter(i: ITestInterpreter): i is IRawAnswerInterpreter {
  return 'calculateFromAnswers' in i;
}