import { inject, injectable } from "tsyringe";
import { IAssignmentScoreService } from "../../contracts/assignmentScore/IassignmentScoreService";
import {
  AttentionLevel,
  AssignmentScore,
  SectionScore,
} from "@packages/common-types/assignmentScore.types";
import { IAssignmentScoreRepo } from "../../contracts/assignmentScore/IassignmentScoreRepo";
import { IAnswerRepo } from "../../contracts/answer/IanswerRepo";
import { Prisma } from "@prisma/client";
import { BadRequest } from "../../utils/httpError";
import { IAssignmentService } from "../../contracts/assignment/IassignmentService";

const ATTENTION_LEVEL_WEIGHT: Record<AttentionLevel, number> = {
  high: 3,
  medium: 2,
  low: 1,
  none: 0,
};

@injectable()
export class AssignmentScoreService implements IAssignmentScoreService {
  constructor(
    @inject("AssignmentService")
    private readonly assignmentService: IAssignmentService,
    @inject("AssignmentScoreRepo")
    private readonly assignmentScoreRepo: IAssignmentScoreRepo,
    @inject("AnswerRepo")
    private readonly answerRepo: IAnswerRepo,
  ) {}

  async checkAssignmentScore(assignmentId: string): Promise<boolean> {
    const assignmentScore =
      await this.assignmentScoreRepo.findByAssignmentId(assignmentId);
    if (!assignmentScore) return true;
    return false;
  }

  async createAssignmentScore(assignmentId: string): Promise<AssignmentScore> {
    const assignmentScoreAvailable =
      await this.checkAssignmentScore(assignmentId);
    if (!assignmentScoreAvailable) {
      throw BadRequest("Assignment score already exists for this assignment");
    }
    //Calculate score before creating assignment score record
    const { sectionScores, totalScore, attentionLevel } =
      await this.caculateAssignmentScore(assignmentId);
    //Create general interpretation
    const overallInterpretation = sectionScores
      .map((s) => `${s.sectionName}: ${s.interpretation}`)
      .join("; ");
    //create details JSON with section scores
    const details = JSON.parse(
      JSON.stringify({
        sections: sectionScores,
      }),
    ) as Prisma.InputJsonValue;

    const assignmentScore = await this.assignmentScoreRepo.create({
      assignment: { connect: { assignmentId: assignmentId } },
      totalScore: new Prisma.Decimal(totalScore),
      percentile: null,
      attentionLevel,
      interpretation: overallInterpretation,
      details: details,
    });

    const isCompleted =
      await this.assignmentService.markAssignmentAsCompleted(assignmentId);
    if (!isCompleted) {
      throw BadRequest(
        "Ha ocurrido un error al marcar la asignación como completada",
      );
    }
    return this.toAssignmentScoreDto(assignmentScore);
  }

  async getAssignmentScoreByAssignmentId(
    assignmentId: string,
  ): Promise<AssignmentScore | null> {
    const assignmentScore =
      await this.assignmentScoreRepo.findByAssignmentId(assignmentId);

    return assignmentScore ? this.toAssignmentScoreDto(assignmentScore) : null;
  }
  async caculateAssignmentScore(assignmentId: string): Promise<{
    sectionScores: SectionScore[];
    totalScore: number;
    attentionLevel: AttentionLevel;
  }> {
    // Obtener las respuestas con sus relaciones
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
            attentionLevel: "none",
          };
        }

        acc[sectionName].totalScore += scoreValue;

        return acc;
      },
      {} as Record<string, SectionScore>,
    );

    // Convertir a array e interpretar cada sección
    const sectionScores = Object.values(sectionScoresMap).map((section) => {
      const evaluation = this.evaluateSectionScore(
        section.sectionName,
        section.totalScore,
      );

      return {
        ...section,
        interpretation: evaluation.interpretation,
        attentionLevel: evaluation.attentionLevel,
      };
    });

    // Calcular el puntaje total general
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
  private normalizeSectionName(sectionName: string): string {
    return sectionName
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
  }

  private evaluateSectionScore(
    sectionName: string,
    score: number,
  ): { interpretation: string; attentionLevel: AttentionLevel } {
    const normalizedSection = this.normalizeSectionName(sectionName);

    // Interpretación para Depresión
    if (normalizedSection.includes("depresion")) {
      if (score < 5) {
        return { interpretation: "Normal", attentionLevel: "none" };
      }
      if (score >= 5 && score <= 6) {
        return {
          interpretation: "Depresion leve",
          attentionLevel: "low",
        };
      }
      if (score >= 7 && score <= 10) {
        return {
          interpretation: "Depresion moderada",
          attentionLevel: "medium",
        };
      }
      if (score >= 11 && score <= 13) {
        return {
          interpretation: "Depresion severa",
          attentionLevel: "high",
        };
      }
      return {
        interpretation: "Depresion extremadamente severa",
        attentionLevel: "high",
      };
    }

    // Interpretación para Ansiedad
    if (normalizedSection.includes("ansiedad")) {
      if (score < 4) {
        return { interpretation: "Normal", attentionLevel: "none" };
      }
      if (score === 4) {
        return {
          interpretation: "Ansiedad leve",
          attentionLevel: "low",
        };
      }
      if (score >= 5 && score <= 7) {
        return {
          interpretation: "Ansiedad moderada",
          attentionLevel: "medium",
        };
      }
      if (score >= 8 && score <= 9) {
        return {
          interpretation: "Ansiedad severa",
          attentionLevel: "high",
        };
      }
      return {
        interpretation: "Ansiedad extremadamente severa",
        attentionLevel: "high",
      };
    }

    // Interpretación para Estrés
    if (normalizedSection.includes("estres")) {
      if (score < 8) {
        return { interpretation: "Normal", attentionLevel: "none" };
      }
      if (score >= 8 && score <= 9) {
        return {
          interpretation: "Estrés leve",
          attentionLevel: "low",
        };
      }
      if (score >= 10 && score <= 12) {
        return {
          interpretation: "Estrés moderado",
          attentionLevel: "medium",
        };
      }
      if (score >= 13 && score <= 16) {
        return {
          interpretation: "Estrés severo",
          attentionLevel: "high",
        };
      }
      return {
        interpretation: "Estrés extremadamente severo",
        attentionLevel: "high",
      };
    }

    return {
      interpretation: "No interpretado",
      attentionLevel: "none",
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
