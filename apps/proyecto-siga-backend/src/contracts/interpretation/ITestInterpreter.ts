import { AttentionLevel, SectionScore } from "@packages/common-types/assignmentScore.types";
import { AnswerWithDetails } from "../answer/answer.types";

/**
 * Controls what the evaluated user sees as their own interpretation.
 * - "full" (default): the user sees the section-based interpretation text.
 * - "scoreOnly": the user only sees the numeric score; the descriptive
 *   interpretation is reserved for the psychologist (clinical interpretation).
 */
export type UserInterpretationMode = "full" | "scoreOnly";

/**
 * Simple interpreter: scores are pre-summed by section (e.g. DASS-21, HAD).
 */
export interface ISectionInterpreter {
  readonly testCode?: string;
  /** Optional: how much of the interpretation the evaluated user may see. Defaults to "full". */
  readonly userInterpretationMode?: UserInterpretationMode;
  interpretSection(sectionName: string, score: number): { interpretation: string; attentionLevel: AttentionLevel };
  /**
   * Optional clinical interpretation for psychologists.
   * Receives the already-scored sections and returns a general clinical text
   * specific to this test. If not implemented, the service falls back to the
   * user-facing interpretation.
   */
  buildClinicalInterpretation?(
    sectionScores: SectionScore[],
    totalScore: number,
    attentionLevel: AttentionLevel,
  ): string;
}

/**
 * Complex interpreter: receives raw answers and calculates everything (e.g. PSQI).
 */
export interface IRawAnswerInterpreter {
  readonly testCode?: string;
  /** Optional: how much of the interpretation the evaluated user may see. Defaults to "full". */
  readonly userInterpretationMode?: UserInterpretationMode;
  calculateFromAnswers(answers: AnswerWithDetails[]): {
    sectionScores: SectionScore[];
    totalScore: number;
    attentionLevel: AttentionLevel;
    /**
     * Optional clinical interpretation for psychologists, specific to this test.
     * If omitted, the service falls back to the user-facing interpretation.
     */
    clinicalInterpretation?: string;
  };
}

export type ITestInterpreter = ISectionInterpreter | IRawAnswerInterpreter;

export function isRawAnswerInterpreter(i: ITestInterpreter): i is IRawAnswerInterpreter {
  return 'calculateFromAnswers' in i;
}

export function hasClinicalInterpretation(
  i: ITestInterpreter,
): i is ISectionInterpreter & Required<Pick<ISectionInterpreter, "buildClinicalInterpretation">> {
  return typeof (i as ISectionInterpreter).buildClinicalInterpretation === "function";
}
