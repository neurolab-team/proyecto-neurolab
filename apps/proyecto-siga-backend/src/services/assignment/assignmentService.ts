import { IAssignmentService } from "../../contracts/assignment/IassignmentService";
import { inject, injectable } from "tsyringe";
import { IAssignmentRepo } from "../../contracts/assignment/IassignmentRepo";
import { ITestRepo } from "../../contracts/test/ItestRepo";
import { TestDataResponse } from "@packages/common-schemas/test.schemas";
import { NotFound } from "../../utils/httpError";
import { AssignmentWithTestsDataResponse } from "@packages/common-types/assignment.types";
import { QuestionOption } from "@packages/common-types/questionsOptions.types";
import { Question } from "@packages/common-types/question.types";
import { assignment, Prisma } from "@prisma/client";

@injectable()
export class AssignmentService implements IAssignmentService {
  constructor(
    @inject("AssignmentRepo")
    private readonly assignmentRepo: IAssignmentRepo,
    @inject("TestRepo")
    private readonly testRepo: ITestRepo,
  ) {}
  markAssignmentAsCompleted(assignmentId: string): Promise<assignment | null> {
    const updatedData: Prisma.assignmentUpdateInput = {
      status: "completed",
    };

    const updated = this.assignmentRepo.updateAssignmentStatus(assignmentId, updatedData);
    return updated;
  }

  async assignInitialTestsToUser(
    userId: string,
    tx?: Prisma.TransactionClient,
  ): Promise<void> {
    const assignment: Prisma.assignmentCreateInput = {
      assignedBy: {
        connect: { userId: userId }, 
      },
      assignedTo: {
        connect: { userId: userId },
      },
      test: {
        connect: { testId: "6996e58f-58e0-4edd-92b4-f1725bf1877d" },
      },
      status: "assigned",
    };
    const response = await this.assignmentRepo.assignInitialTestsToUser(
      assignment,
      tx,
    );
    if (!response) {
      throw new Error("Error al asignar el test inicial al usuario");
    }
  }
  async getAssignmentsWithTestsByUserId(
    userId: string,
  ): Promise<AssignmentWithTestsDataResponse[] | null> {
    const assignments =
      await this.assignmentRepo.getAssignmentsWithTestsByUserId(userId);
    if (!assignments) {
      throw NotFound("No se encontraron asignaciones para el usuario");
    }
    return assignments;
  }

  async getAssignmentById(
    assignmentId: string,
  ): Promise<TestDataResponse | null> {
    try {
      const assignment =
        await this.assignmentRepo.getAssignmentForId(assignmentId);
      if (!assignment) {
        throw NotFound("Asignacion no encontrada");
      }
      if (assignment.status === "completed") {
        throw NotFound("La asignacion ya fue completada");
      }
      const test = await this.testRepo.getTestWithQuestionsById(
        assignment.testId,
      );

      if (!test) {
        throw NotFound("Test no encontrado para la asignacion");
      }
      if (!test.questions) {
        throw NotFound("El test no tiene preguntas asociadas");
      }
      const formattedData: TestDataResponse = {
        title: test.title,
        question: test.questions.map((q: Question) => ({
          questionId: q.questionId,
          code: q.code ?? null,
          prompt: q.prompt ?? "",
          questionOption: q.questionOption.map((opt: QuestionOption) => ({
            questionOptionId: opt.questionOptionId,
            label: opt.label,
            value: opt.value ?? null,
          })),
        })),
      };
      return formattedData;
    } catch (error) {
      throw error;
    }
  }
}
