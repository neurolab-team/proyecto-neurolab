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
import { isRawAnswerInterpreter } from "../../contracts/interpretation/ITestInterpreter";
import { IAssignmentRepo } from "../../contracts/assignment/IassignmentRepo";

const ATTENTION_LEVEL_WEIGHT: Record<AttentionLevel, number> = {
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
    const { sectionScores, totalScore, attentionLevel } =
      await this.calculateAssignmentScore(assignmentId);
    //Create general interpretation
    const overallInterpretation = sectionScores
      .map((s) => `${s.sectionName}: ${s.interpretation}`)
      .join("; ");
    //create details JSON with section scores
    const details = {
      sections: sectionScores,
    } as unknown as Prisma.InputJsonValue;

    const assignmentScore = await this.assignmentScoreRepo.create({
      assignment: { connect: { assignmentId: assignmentId } },
      totalScore: new Prisma.Decimal(totalScore),
      percentile: null,
      attentionLevel,
      interpretation: overallInterpretation,
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

    const answers =
      await this.answerRepo.findByAssignmentTestWithDetails(assignmentId);

    // If the interpreter handles its own scoring (e.g. PSQI), delegate entirely
    if (isRawAnswerInterpreter(interpreter)) {
      return interpreter.calculateFromAnswers(answers);
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

    return {
      sectionScores,
      totalScore,
      attentionLevel,
    };
  }
    private toAssignmentScoreDto(assignmentScore: {
    assignmentId: string;
    totalScore: { toNumber(): number };
    percentile?: { toNumber(): number } | null;
    attentionLevel: AttentionLevel;
    interpretation?: string | null;
    details?: Prisma.JsonValue | null;
  }): AssignmentScore {
    return {
      assignmentId: assignmentScore.assignmentId,
      totalScore: assignmentScore.totalScore.toNumber(),
      percentile: assignmentScore.percentile?.toNumber() ?? null,
      attentionLevel: assignmentScore.attentionLevel,
      interpretation: assignmentScore.interpretation ?? null,
      details: assignmentScore.details ?? undefined,
    };
  }
}
