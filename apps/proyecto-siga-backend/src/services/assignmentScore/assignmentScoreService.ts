import { inject, injectable } from "tsyringe";
import { IAssignmentScoreService } from "../../contracts/assignmentScore/IassignmentScoreService";
import {
  AssignmentScore,
  SectionScore,
} from "@packages/common-types/assignmentScore.types";
//import prisma from "@packages/libs/prisma";
//import { BadRequest, NotFound } from "../../utils/httpError";
import { IAssignmentScoreRepo } from "../../contracts/assignmentScore/IassignmentScoreRepo";
import { IAnswerRepo } from "../../contracts/answer/IanswerRepo";
import { Prisma } from "@prisma/client";
import { BadRequest } from "../../utils/httpError";

@injectable()
export class AssignmentScoreService implements IAssignmentScoreService {
  constructor(
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
    const { sectionScores, totalScore } =
      await this.caculateAssignmentScore(assignmentId);
    //Create general interpretation
    const overallInterpretation = sectionScores
      .map((s) => `${s.sectionName}: ${s.interpretation}`)
      .join("; ");
    //create details JSON with section scores
    const details = JSON.parse(
      JSON.stringify({
        sections: sectionScores,
        calculatedAt: new Date().toISOString(),
      }),
    ) as Prisma.InputJsonValue;

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
    assigmentId: string,
  ): Promise<AssignmentScore | null> {
    return this.assignmentScoreRepo.findByAssignmentId(assigmentId);
  }
  async caculateAssignmentScore(assignmentId: string): Promise<{
    sectionScores: SectionScore[];
    totalScore: number;
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
          };
        }

        acc[sectionName].totalScore += scoreValue;

        return acc;
      },
      {} as Record<string, SectionScore>,
    );

    // Convertir a array e interpretar cada sección
    const sectionScores = Object.values(sectionScoresMap).map((section) => ({
      ...section,
      interpretation: this.interpretScore(
        section.sectionName,
        section.totalScore,
      ),
    }));

    // Calcular el puntaje total general
    const totalScore = sectionScores.reduce(
      (sum, section) => sum + section.totalScore,
      0,
    );

    return {
      sectionScores,
      totalScore,
    };
  }
  private interpretScore(sectionName: string, score: number): string {
    const normalizedSection = sectionName.toLowerCase();

    // Interpretación para Depresión
    if (
      normalizedSection.includes("depresión") ||
      normalizedSection.includes("depresion")
    ) {
      if (score < 5) return "Normal";
      if (score >= 5 && score <= 6) return "Depresión leve";
      if (score >= 7 && score <= 10) return "Depresión moderada";
      if (score >= 11 && score <= 13) return "Depresión severa";
      return "Depresión extremadamente severa";
    }

    // Interpretación para Ansiedad
    if (normalizedSection.includes("ansiedad")) {
      if (score < 4) return "Normal";
      if (score === 4) return "Ansiedad leve";
      if (score >= 5 && score <= 7) return "Ansiedad moderada";
      if (score >= 8 && score <= 9) return "Ansiedad severa";
      return "Ansiedad extremadamente severa";
    }

    // Interpretación para Estrés
    if (
      normalizedSection.includes("estrés") ||
      normalizedSection.includes("estres")
    ) {
      if (score < 8) return "Normal";
      if (score >= 8 && score <= 9) return "Estrés leve";
      if (score >= 10 && score <= 12) return "Estrés moderado";
      if (score >= 13 && score <= 16) return "Estrés severo";
      return "Estrés extremadamente severo";
    }

    return "No interpretado";
  }
}
