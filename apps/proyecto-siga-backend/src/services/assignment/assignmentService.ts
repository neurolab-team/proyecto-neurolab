import { inject, injectable } from "tsyringe";
import { assignment, Prisma } from "@packages/libs/prisma";
import { TestDataResponse } from "@packages/common-schemas/test.schemas";
import {
  AssignmentWithTestsDataResponse,
  BulkAssignPsychologistTestInput,
  BulkAssignPsychologistTestResult,
  PsychologistAssignableTest,
} from "@packages/common-types/assignment.types";
import { PrismaQuestion } from "@packages/common-types/test.types";
import {
  getStudyCodeForTest,
  StudyConsentDecision,
} from "@packages/common-types/consent.types";
import { AssignmentConsentInput } from "@packages/common-schemas/assignment.schemas";
import { USABILITY_SURVEY_TRIGGER_TEST_CODES } from "@packages/common-types/usabilitySurvey.types";
import { IAssignmentService } from "../../contracts/assignment/IassignmentService";
import { IAssignmentRepo } from "../../contracts/assignment/IassignmentRepo";
import { ITestRepo } from "../../contracts/test/ItestRepo";
import { IUserRepo } from "../../contracts/user/IuserRepo";
import { IUsabilitySurveyEmailService } from "../../contracts/mail/IusabilitySurveyEmailService";
import { IStudyConsentService } from "../../contracts/studyConsent/IstudyConsentService";
import { BadRequest, NotFound } from "../../utils/httpError";
import { logger } from "../../utils/logger";
import { TransactionManager } from "../transaction/transactionManager";

const questionCodeCollator = new Intl.Collator("es", {
  numeric: true,
  sensitivity: "base",
});

/**
 * Tests que se asignan automaticamente al registrar un usuario.
 * Los ids deben coincidir con los definidos en prisma/seeds/definitions.
 */
const INITIAL_TEST_IDS: ReadonlyArray<{ testCode: string; testId: string }> = [
  //{ testCode: "DASS-21", testId: "6996e58f-58e0-4edd-92b4-f1725bf1877d" },
  { testCode: "EPWORTH", testId: "9296e58f-68e0-5edd-92b4-f1725bf1877a" },
  { testCode: "PSQI", testId: "a1b2c3d4-e5f6-7890-abcd-ef1234567890" },
  { testCode: "MUNICH", testId: "c1e2d3d4-a5f6-1890-aecd-ef1234567890" },
];

@injectable()
export class AssignmentService implements IAssignmentService {
  constructor(
    @inject("AssignmentRepo")
    private readonly assignmentRepo: IAssignmentRepo,
    @inject("TestRepo")
    private readonly testRepo: ITestRepo,
    @inject("UserRepo")
    private readonly userRepo: IUserRepo,
    @inject("TransactionManager")
    private readonly txManager: TransactionManager,
    @inject("UsabilitySurveyEmailService")
    private readonly usabilitySurveyEmailService: IUsabilitySurveyEmailService,
    @inject("StudyConsentService")
    private readonly studyConsentService: IStudyConsentService,
  ) {}

  markAssignmentAsCompleted(assignmentId: string): Promise<assignment | null> {
    const updatedData: Prisma.assignmentUpdateInput = {
      status: "completed",
    };

    return this.assignmentRepo.updateAssignmentStatus(assignmentId, updatedData);
  }

  /**
   * Al completar una prueba, revisa si con esa ya están las 3 pruebas de
   * sueño (EPWORTH, PSQI, MUNICH) completadas para el usuario. Si es así y
   * todavía no se le había disparado, marca el flag (para que el frontend
   * muestre el modal en cada sesión hasta que haga clic) y manda el correo
   * de respaldo con el link a la encuesta externa.
   *
   * Es "fire and forget" respecto al flujo principal: un fallo aquí no debe
   * tumbar la creación del puntaje ni el cierre de la prueba que el usuario
   * sí completó.
   */
  async checkAndTriggerUsabilitySurvey(userId: string): Promise<void> {
    try {
      const user = await this.userRepo.findById(userId);
      if (!user || user.usabilitySurveyPromptedAt) {
        return;
      }

      const assignments = await this.assignmentRepo.getAssignmentsWithTestsByUserId(userId);
      const completedTestCodes = new Set(
        (assignments ?? [])
          .filter((a) => a.status === "completed")
          .map((a) => a.test.testCode?.toUpperCase())
          .filter((code): code is string => !!code),
      );

      const allTriggerTestsCompleted = USABILITY_SURVEY_TRIGGER_TEST_CODES.every(
        (code) => completedTestCodes.has(code),
      );

      if (!allTriggerTestsCompleted) {
        return;
      }

      await this.userRepo.update(userId, { usabilitySurveyPromptedAt: new Date() });
      await this.usabilitySurveyEmailService.sendUsabilitySurveyEmail(
        user.email,
        user.name || user.email,
      );
    } catch (error) {
      logger.error(
        "[AssignmentService] fallo disparando la encuesta de usabilidad",
        { userId, error },
      );
    }
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

  /**
   * Registra la decisión de consentimiento del estudio al que pertenece la
   * prueba de la asignación. Aplica a todas las pruebas del estudio, no solo
   * a esta asignación.
   */
  async submitConsent(
    assignmentId: string,
    userId: string,
    input: AssignmentConsentInput,
  ): Promise<StudyConsentDecision> {
    const testCode = await this.assignmentRepo.getTestCodeByAssignmentId(assignmentId);
    const studyCode = getStudyCodeForTest(testCode);

    if (!studyCode) {
      throw BadRequest("Esta prueba no requiere consentimiento informado");
    }

    return this.studyConsentService.submit(userId, studyCode, input, {
      assignmentId,
      testCode,
    });
  }

  async requireAcceptedConsent(assignmentId: string, userId: string): Promise<void> {
    const testCode = await this.assignmentRepo.getTestCodeByAssignmentId(assignmentId);
    await this.studyConsentService.requireAcceptedForTest(userId, testCode);
  }

  async assignInitialTestsToUser(
    userId: string,
    tx?: Prisma.TransactionClient,
  ): Promise<void> {
    const adminId = await this.userRepo.findFirstAdminId(tx);

    if (!adminId) {
      logger.warn(
        "No existe ningun administrador; las pruebas iniciales quedaran autoasignadas",
        { userId },
      );
    }

    const assignedById = adminId ?? userId;

    for (const { testCode, testId } of INITIAL_TEST_IDS) {
      const assignment: Prisma.assignmentCreateInput = {
        assignedBy: {
          connect: { userId: assignedById },
        },
        assignedTo: {
          connect: { userId: userId },
        },
        test: {
          connect: { testId },
        },
        status: "assigned",
      };

      const response = await this.assignmentRepo.assignInitialTestsToUser(
        assignment,
        tx,
      );

      if (!response) {
        throw new Error(
          `Error al asignar el test inicial ${testCode} al usuario`,
        );
      }
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
    return this.testRepo.getPsychologistAssignableTests();
  }

  async bulkAssignByPsychologist(
    psychologistId: string,
    input: BulkAssignPsychologistTestInput,
  ): Promise<BulkAssignPsychologistTestResult> {
    const uniqueStudentIds = [...new Set(input.studentIds)];

    if (uniqueStudentIds.length === 0) {
      throw BadRequest("Debes seleccionar al menos un estudiante");
    }

    const testExists = await this.testRepo.existsById(input.testId);
    if (!testExists) {
      throw NotFound("Prueba no encontrada");
    }

    return this.txManager.run(
      async (tx) => {
        const authorizedStudentIds =
          await this.assignmentRepo.findAuthorizedStudentIdsForPsychologist(
            psychologistId,
            uniqueStudentIds,
            tx,
          );
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

        const existingStudentIds = await this.assignmentRepo.findExistingAssignmentStudentIds(
          input.testId,
          authorizedStudentIds,
          tx,
        );
        const duplicateSet = new Set(existingStudentIds);

        const duplicateStudentIds = authorizedStudentIds.filter((studentId) =>
          duplicateSet.has(studentId),
        );
        const toCreateStudentIds = authorizedStudentIds.filter(
          (studentId) => !duplicateSet.has(studentId),
        );

        await this.assignmentRepo.createManyPsychologistAssignments(
          psychologistId,
          input.testId,
          toCreateStudentIds,
          input.dueAt,
          tx,
        );

        return {
          totalRequested: uniqueStudentIds.length,
          createdCount: toCreateStudentIds.length,
          duplicateCount: duplicateStudentIds.length,
          unauthorizedCount: unauthorizedStudentIds.length,
          createdStudentIds: toCreateStudentIds,
          duplicateStudentIds,
          unauthorizedStudentIds,
        };
      },
      {
        isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
      },
    );
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

    const consent = await this.studyConsentService.getConsentStateForTest(
      assignment.assignedToId,
      test.testCode ?? null,
    );

    const formattedData: TestDataResponse = {
      testCode: test.testCode ?? "UNKNOWN",
      title: test.title,
      description: test.description ?? null,
      requiresConsent: consent.requiresConsent,
      consentStatus: consent.decision?.status ?? null,
      question: orderedQuestions.map((q) => ({
        questionId: q.questionId,
        code: q.code ?? null,
        prompt: q.prompt ?? "",
        questionType: q.type ?? "single_choice",
        required: q.required,
        condition: q.condition ? JSON.parse(q.condition) : null,
        metadata: q.metadata ? JSON.parse(q.metadata) : null,
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
