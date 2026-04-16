import { inject, injectable } from "tsyringe";
import { assignment, Prisma } from "@prisma/client";
import { TestDataResponse } from "@packages/common-schemas/test.schemas";
import { AssignmentWithTestsDataResponse } from "@packages/common-types/assignment.types";
import { PrismaQuestion } from "@packages/common-types/test.types";
import { IAssignmentService } from "../../contracts/assignment/IassignmentService";
import { IAssignmentRepo } from "../../contracts/assignment/IassignmentRepo";
import { ITestRepo } from "../../contracts/test/ItestRepo";
import { BadRequest, NotFound } from "../../utils/httpError";

const questionCodeCollator = new Intl.Collator("es", {
  numeric: true,
  sensitivity: "base",
});

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

    return this.assignmentRepo.updateAssignmentStatus(assignmentId, updatedData);
  }

  async markAssignmentAsReviewed(
    psychologistId: string,
    assignmentId: string,
  ): Promise<assignment | null> {
    const assignment = await this.assignmentRepo.getPsychologistAssignmentById(
      psychologistId,
      assignmentId,
    );

    if (!assignment) {
      throw NotFound("Asignacion no encontrada para este psicologo");
    }

    if (assignment.status !== "completed") {
      throw BadRequest("Solo puedes revisar pruebas completadas");
    }

    return this.assignmentRepo.markAssignmentAsReviewed(
      assignmentId,
      assignment.reviewedAt || new Date(),
    );
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
    const assignment = await this.assignmentRepo.getAssignmentForId(assignmentId);
    if (!assignment) {
      throw NotFound("Asignacion no encontrada");
    }

    if (assignment.status === "completed") {
      throw NotFound("La asignacion ya fue completada");
    }

    const test = await this.testRepo.getTestWithQuestionsById(assignment.testId);

    if (!test) {
      throw NotFound("Test no encontrado para la asignacion");
    }

    if (!test.questions) {
      throw NotFound("El test no tiene preguntas asociadas");
    }

    const orderedQuestions = [...test.questions].sort((a: PrismaQuestion, b: PrismaQuestion) => {
      const codeA = a.code?.trim();
      const codeB = b.code?.trim();

      if (!codeA && !codeB) return 0;
      if (!codeA) return 1;
      if (!codeB) return -1;

      return questionCodeCollator.compare(codeA, codeB);
    });

    const formattedData: TestDataResponse = {
      testCode: test.testCode ?? "UNKNOWN",
      title: test.title,
      question: orderedQuestions.map((q) => ({
        questionId: q.questionId,
        code: q.code ?? null,
        prompt: q.prompt ?? "",
        questionType: q.type ?? "single_choice",
        required: q.required,
        condition: q.condition ?? null,
        metadata: q.metadata ?? null,
        questionOption: q.questionOption.map((opt) => ({
          questionOptionId: opt.questionOptionId,
          label: opt.label,
          value: opt.value ?? null,
        })),
      })),
    };

    return formattedData;
  }
}
