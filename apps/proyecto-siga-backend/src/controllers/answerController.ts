import { asAdmin, auth, AuthedRequest } from "../middleware/auth";
import container from "../container/index";
import { CommonDtos } from "../shared/validators";
import { Router } from "express";
import { wrap } from "../middleware/async";
import { ok } from "../utils/jsonResponse";
import { IAnswerService } from "../contracts/answer/IanswerService";
import { IAssignmentService } from "../contracts/assignment/IassignmentService";
import { NotFound } from "../utils/httpError";
import { created } from "../utils/jsonResponse";
import {
  CreateAnswerDto,
  CreateManyAnswersDto,
} from "@packages/common-schemas/answer.schemas";
import {
  AssignmentAccess,
  assignmentAccessGuard,
} from "../middleware/assignmentAccess";

/**
 * Sin consentimiento informado aceptado no se guardan respuestas, sin
 * importar por dónde haya llegado la petición (UI o llamada directa a la
 * API). El gate real de "no puedes responder sin consentir" vive aquí, no
 * solo en el frontend.
 */
const requireAcceptedConsent = (access: AssignmentAccess) => {
  if (access.assignment.consentStatus !== "accepted") {
    throw Forbidden(
      "Debes aceptar el consentimiento informado antes de responder esta prueba",
    );
  }
};

// Private Routes
export const AnswersController = Router();
const answerService = container.resolve<IAnswerService>("AnswerService");
const assignmentService = container.resolve<IAssignmentService>("AssignmentService");

/**
 * Sin consentimiento informado aceptado no se guardan respuestas, sin
 * importar por dónde haya llegado la petición (UI o llamada directa a la
 * API). El gate real de "no puedes responder sin consentir" vive aquí, no
 * solo en el frontend. Solo aplica a pruebas que pertenecen a un estudio
 * (ver `STUDY_TEST_CODES`).
 */
const requireAcceptedConsent = (access: AssignmentAccess) =>
  assignmentService.requireAcceptedConsent(
    access.assignment.assignmentId,
    access.assignment.assignedToId,
  );

AnswersController.use(auth);

// Volcado completo de respuestas: solo admin. No lo consume el frontend, pero
// se mantiene para soporte. Sin este guard cualquier usuario autenticado podía
// descargar las respuestas de toda la institución.
AnswersController.get(
  "/",
  asAdmin,
  wrap(async (_req: AuthedRequest, res) => {
    const answers = await answerService.getAnswers();
    return ok(res, answers, "Listado de respuestas");
  }),
);

AnswersController.get(
  "/:id",
  wrap(async (req: AuthedRequest, res) => {
    const id = CommonDtos.IdParam.parse(req.params).id;
    const answer = await answerService.getAnswerById(id);

    if (!answer) {
      throw NotFound("Respuesta no encontrada");
    }

    // La autorización se resuelve sobre la asignación a la que pertenece la
    // respuesta, no sobre la respuesta en sí.
    await assignmentAccessGuard().requireReadAccess(
      req.user!,
      answer.assignmentId,
    );

    return ok(res, answer, "Respuesta encontrada");
  }),
);

AnswersController.get(
  "/assignment/:id",
  wrap(async (req: AuthedRequest, res) => {
    const id = CommonDtos.IdParam.parse(req.params).id;
    const guard = assignmentAccessGuard();

    await guard.requireReadAccess(req.user!, id);

    const answers = await answerService.getAnswersByAssignmentTest(id);
    return ok(res, answers, "Listado de respuestas");
  }),
);

AnswersController.get(
  "/assignment/:id/detailed",
  wrap(async (req: AuthedRequest, res) => {
    const id = CommonDtos.IdParam.parse(req.params).id;
    const guard = assignmentAccessGuard();

    await guard.requireReadAccess(req.user!, id);

    const answers = await answerService.getDetailedAnswers(id);
    return ok(res, answers, "Respuestas detalladas");
  }),
);

AnswersController.get(
  "/assignmentDetails/:id",
  wrap(async (req: AuthedRequest, res) => {
    const id = CommonDtos.IdParam.parse(req.params).id;
    const guard = assignmentAccessGuard();

    await guard.requireReadAccess(req.user!, id);

    const answers =
      await answerService.getAnswersByAssignmentTestWithDetails(id);
    return ok(res, answers, "Listado de respuestas");
  }),
);

AnswersController.post(
  "/",
  wrap(async (req: AuthedRequest, res) => {
    const input = CreateAnswerDto.parse(req.body);

    const access = await assignmentAccessGuard().requireOwnership(
      req.user!,
      input.assignmentId,
    );
    await requireAcceptedConsent(access);

    const answer = await answerService.createAnswer({
      assignmentId: input.assignmentId,
      questionId: input.questionId,
      questionOptionId: input.questionOptionId,
      textValue: input.textValue,
    });
    return created(res, answer, "Respuesta guardada correctamente");
  }),
);

AnswersController.post(
  "/many",
  wrap(async (req: AuthedRequest, res) => {
    const input = CreateManyAnswersDto.parse(req.body);

    const access = await assignmentAccessGuard().requireOwnership(
      req.user!,
      input.assignmentId,
    );
    await requireAcceptedConsent(access);

    const transformedInput = {
      assignmentId: input.assignmentId,
      answers: input.answers.map((answer) => ({
        questionId: answer.questionId,
        questionOptionId: answer.questionOptionId,
        textValue: answer.textValue,
      })),
    };

    const answers = await answerService.createManyAnswers(transformedInput);

    return created(res, answers, "Respuestas creadas exitosamente");
  }),
);
