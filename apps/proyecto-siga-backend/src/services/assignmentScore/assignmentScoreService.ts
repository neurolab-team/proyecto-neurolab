import { inject, injectable } from "tsyringe";
import { IAssignmentScoreService } from "../../contracts/assignmentScore/IassignmentScoreService";
import {
  AssignmentScore,
  SectionScore,
} from "@packages/common-types/assignmentScore.types";
import { IAssignmentScoreRepo } from "../../contracts/assignmentScore/IassignmentScoreRepo";
import { IAnswerRepo } from "../../contracts/answer/IanswerRepo";
import { Prisma } from "@prisma/client";
import { BadRequest } from "../../utils/httpError";
import { InterpretationFactory } from "../interpretation/InterpretationFactory";
import { IAssignmentRepo } from "../../contracts/assignment/IassignmentRepo";

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
    const { sectionScores, totalScore } =
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
      interpretation: overallInterpretation,
      details: details,
    });

    return assignmentScore;
  }

  async getAssignmentScoreByAssignmentId(
    assignmentId: string,
  ): Promise<AssignmentScore | null> {
    return this.assignmentScoreRepo.findByAssignmentId(assignmentId);
  }
  private async calculateAssignmentScore(assignmentId: string): Promise<{
    sectionScores: SectionScore[];
    totalScore: number;
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

    // Agrupar por sección y sumar scoreValue
    const sectionScoresMap = answers.reduce(
      (acc, answer) => {
        const sectionName = answer.question?.section?.name || "Sin sección";
        const scoreValue = answer.option?.scoreValue?.toNumber() || 0;

        if (!acc[sectionName]) {
          acc[sectionName] = {
            sectionName,
            totalScore: 0,
            interpretation: "",
          };
        }

        acc[sectionName].totalScore += scoreValue;

        return acc;
      },
      {} as Record<string, SectionScore>,
    );

    const sectionScores = Object.values(sectionScoresMap).map((section) => ({
      ...section,
      interpretation: interpreter.interpretSection(
        section.sectionName,
        section.totalScore,
      ),
    }));

    const totalScore = sectionScores.reduce(
      (sum, section) => sum + section.totalScore,
      0,
    );
    return {
      sectionScores,
      totalScore,
    };
  }
}
