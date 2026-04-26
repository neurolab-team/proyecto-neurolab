import { inject, injectable } from "tsyringe";
import { assignment, Prisma } from "@prisma/client";
import { TestDataResponse } from "@packages/common-schemas/test.schemas";
import {
  AssignmentWithTestsDataResponse,
  BulkAssignPsychologistTestInput,
  BulkAssignPsychologistTestResult,
  PsychologistAssignableTest,
} from "@packages/common-types/assignment.types";
import { PrismaQuestion } from "@packages/common-types/test.types";
import { IAssignmentService } from "../../contracts/assignment/IassignmentService";
import { IAssignmentRepo } from "../../contracts/assignment/IassignmentRepo";
import { ITestRepo } from "../../contracts/test/ItestRepo";
import { BadRequest, NotFound } from "../../utils/httpError";
import prisma from "@packages/libs/prisma";

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

  async getPsychologistAssignableTests(): Promise<PsychologistAssignableTest[]> {
    return prisma.test.findMany({
      select: {
        testId: true,
        title: true,
      },
      where: {
        isPublished: true,
      },
      orderBy: {
        title: "asc",
      },
    });
  }

  async bulkAssignByPsychologist(
    psychologistId: string,
    input: BulkAssignPsychologistTestInput,
  ): Promise<BulkAssignPsychologistTestResult> {
    const uniqueStudentIds = [...new Set(input.studentIds)];

    if (uniqueStudentIds.length === 0) {
      throw BadRequest("Debes seleccionar al menos un estudiante");
    }

    const testExists = await prisma.test.findUnique({
      where: { testId: input.testId },
      select: { testId: true },
    });

    if (!testExists) {
      throw NotFound("Prueba no encontrada");
    }

    const assignedStudents = await prisma.user.findMany({
      where: {
        userId: { in: uniqueStudentIds },
        role: "user",
        isActive: true,
        assignedPsychologistId: psychologistId,
      },
      select: { userId: true },
    });

    const authorizedStudentIds = assignedStudents.map((student) => student.userId);
    const authorizedSet = new Set(authorizedStudentIds);
    const unauthorizedStudentIds = uniqueStudentIds.filter(
      (studentId) => !authorizedSet.has(studentId),
    );

    if (authorizedStudentIds.length === 0) {
      return {
        totalRequested: uniqueStudentIds.length,
        createdCount: 0,
        duplicateCount: 0,
        unauthorizedCount: unauthorizedStudentIds.length,
        createdStudentIds: [],
        duplicateStudentIds: [],
        unauthorizedStudentIds,
      };
    }

    const existingActiveAssignments = await prisma.assignment.findMany({
      where: {
        assignedToId: { in: authorizedStudentIds },
        testId: input.testId,
        status: {
          in: ["assigned", "in_progress"],
        },
      },
      select: {
        assignedToId: true,
      },
    });

    const duplicateSet = new Set(
      existingActiveAssignments.map((assignment) => assignment.assignedToId),
    );

    const duplicateStudentIds = authorizedStudentIds.filter((studentId) =>
      duplicateSet.has(studentId),
    );
    const toCreateStudentIds = authorizedStudentIds.filter(
      (studentId) => !duplicateSet.has(studentId),
    );

    if (toCreateStudentIds.length > 0) {
      await prisma.assignment.createMany({
        data: toCreateStudentIds.map((studentId) => ({
          assignedById: psychologistId,
          assignedToId: studentId,
          testId: input.testId,
          status: "assigned",
          dueAt: input.dueAt ? new Date(input.dueAt) : null,
        })),
      });
    }

    return {
      totalRequested: uniqueStudentIds.length,
      createdCount: toCreateStudentIds.length,
      duplicateCount: duplicateStudentIds.length,
      unauthorizedCount: unauthorizedStudentIds.length,
      createdStudentIds: toCreateStudentIds,
      duplicateStudentIds,
      unauthorizedStudentIds,
    };
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
