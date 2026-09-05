import { inject, injectable } from "tsyringe";
import { IAssignmentScoreService } from "../../contracts/assignmentScore/IassignmentScoreService";
import {
  AttentionLevel,
  AssignmentScore,
  SectionScore,
} from "@packages/common-types/assignmentScore.types";
import { IAssignmentScoreRepo } from "../../contracts/assignmentScore/IassignmentScoreRepo";
import { IAnswerRepo } from "../../contracts/answer/IanswerRepo";
import { Prisma } from "@packages/libs/prisma";
import { BadRequest } from "../../utils/httpError";
import { InterpretationFactory } from "../interpretation/InterpretationFactory";
import { isRawAnswerInterpreter, hasClinicalInterpretation, UserInterpretationMode } from "../../contracts/interpretation/ITestInterpreter";
import { IAssignmentRepo } from "../../contracts/assignment/IassignmentRepo";

const ATTENTION_LEVEL_WEIGHT: Record<AttentionLevel, number> = {
  critic: 4,
  high: 3,
  medium: 2,
  low: 1,
  none: 0,
};

@injectable()
export class AssignmentScoreService implements IAssignmentScoreService {
  constructor(
    @inject("AssignmentScoreRepo")
    private readonly assignmentScoreRepo: IAssignmentScoreRepo,
    @inject("AnswerRepo")
    private readonly answerRepo: IAnswerRepo,
    @inject("AssignmentRepo")
    private readonly assignmentRepo: IAssignmentRepo,
    @inject("InterpretationFactory")
    private readonly interpretationFactory: InterpretationFactory,
  ) {}

  private async checkScoreNotExists(assignmentId: string): Promise<boolean> {
    const assignmentScore =
      await this.assignmentScoreRepo.findByAssignmentId(assignmentId);
    if (!assignmentScore) return true;
    return false;
  }

  async createAssignmentScore(assignmentId: string): Promise<AssignmentScore> {
    const assignmentScoreAvailable =
      await this.checkScoreNotExists(assignmentId);
    if (!assignmentScoreAvailable) {
      throw BadRequest("Assignment score already exists for this assignment");
    }
    //Calculate score before creating assignment score record
    const { sectionScores, totalScore, attentionLevel, clinicalInterpretation, userInterpretationMode } =
      await this.calculateAssignmentScore(assignmentId);
    //Create general interpretation (section-based descriptive text)
    const overallInterpretation = sectionScores
      .map((s) => `${s.sectionName}: ${s.interpretation}`)
      .join("; ");

    // Decide what the user sees vs. what the psychologist sees.
    // - "scoreOnly": the user only gets the numeric score; the descriptive
    //   general interpretation is reserved for the psychologist.
    // - "full" (default): the user gets the general interpretation, and the
    //   clinical text (if any) or the general text goes to the psychologist.
    let userInterpretation: string;
    let clinicalText: string;
    if (userInterpretationMode === "scoreOnly") {
      userInterpretation = `Puntaje total: ${totalScore}`;
      clinicalText = clinicalInterpretation ?? overallInterpretation;
    } else {
      userInterpretation = overallInterpretation;
      clinicalText = clinicalInterpretation ?? overallInterpretation;
    }

    //create details JSON with section scores
    const details = JSON.stringify({ sections: sectionScores });

    const assignmentScore = await this.assignmentScoreRepo.create({
      assignment: { connect: { assignmentId: assignmentId } },
      totalScore: new Prisma.Decimal(totalScore),
      percentile: null,
      attentionLevel,
      interpretation: userInterpretation,
      clinicalInterpretation: clinicalText,
      details: details,
    });

    return this.toAssignmentScoreDto(assignmentScore);
  }

  async getAssignmentScoreByAssignmentId(
    assignmentId: string,
  ): Promise<AssignmentScore | null> {
    const assignmentScore =
      await this.assignmentScoreRepo.findByAssignmentId(assignmentId);

    return assignmentScore ? this.toAssignmentScoreDto(assignmentScore) : null;
  }
  private async calculateAssignmentScore(assignmentId: string): Promise<{
    sectionScores: SectionScore[];
    totalScore: number;
    attentionLevel: AttentionLevel;
    clinicalInterpretation?: string;
    userInterpretationMode: UserInterpretationMode;
  }> {
    const testCode =
      await this.assignmentRepo.getTestCodeByAssignmentId(assignmentId);
    if (!testCode)
      throw BadRequest(
        "No se encontró el código del test para esta asignación",
      );
    const interpreter = this.interpretationFactory.getInterpreter(testCode);

    if (!interpreter) {
      throw BadRequest(
        `No se encontró interpretador para el test: ${testCode}`,
      );
    }

    const userInterpretationMode: UserInterpretationMode =
      interpreter.userInterpretationMode ?? "full";

    const answers =
      await this.answerRepo.findByAssignmentTestWithDetails(assignmentId);

    // If the interpreter handles its own scoring (e.g. PSQI), delegate entirely.
    // It may also return its own clinical interpretation.
    if (isRawAnswerInterpreter(interpreter)) {
      return { ...interpreter.calculateFromAnswers(answers), userInterpretationMode };
    }

    // Default: sum scoreValues grouped by section
    const sectionScoresMap = answers.reduce(
      (acc, answer) => {
        const sectionName = answer.question?.section?.name || "Sin sección";
        const scoreValue = answer.option?.scoreValue?.toNumber() || 0;

        if (!acc[sectionName]) {
          acc[sectionName] = {
            sectionName,
            totalScore: 0,
            interpretation: "",
            attentionLevel: "none",
          };
        }

        acc[sectionName].totalScore += scoreValue;

        return acc;
      },
      {} as Record<string, SectionScore>,
    );

   const sectionScores = Object.values(sectionScoresMap).map((section) => {
  const { interpretation, attentionLevel } = interpreter.interpretSection(
    section.sectionName,
    section.totalScore,
  );
  return { ...section, interpretation, attentionLevel };
});

    const totalScore = sectionScores.reduce(
      (sum, section) => sum + section.totalScore,
      0,
    );
    const attentionLevel = sectionScores.reduce<AttentionLevel>(
      (highest, section) =>
        ATTENTION_LEVEL_WEIGHT[section.attentionLevel] >
        ATTENTION_LEVEL_WEIGHT[highest]
          ? section.attentionLevel
          : highest,
      "none",
    );

    // Optional test-specific clinical interpretation for psychologists.
    const clinicalInterpretation = hasClinicalInterpretation(interpreter)
      ? interpreter.buildClinicalInterpretation(
          sectionScores,
          totalScore,
          attentionLevel,
        )
      : undefined;

    return {
      sectionScores,
      totalScore,
      attentionLevel,
      clinicalInterpretation,
      userInterpretationMode,
    };
  }
    private toAssignmentScoreDto(assignmentScore: {
    assignmentId: string;
    totalScore: { toNumber(): number };
    percentile?: { toNumber(): number } | null;
    attentionLevel: string;
    interpretation?: string | null;
    clinicalInterpretation?: string | null;
    details?: string | null;
  }): AssignmentScore {
    return {
      assignmentId: assignmentScore.assignmentId,
      totalScore: assignmentScore.totalScore.toNumber(),
      percentile: assignmentScore.percentile?.toNumber() ?? null,
      attentionLevel: assignmentScore.attentionLevel as AttentionLevel,
      interpretation: assignmentScore.interpretation ?? null,
      clinicalInterpretation: assignmentScore.clinicalInterpretation ?? null,
      details: assignmentScore.details ? JSON.parse(assignmentScore.details) : undefined,
    };
  }
}
