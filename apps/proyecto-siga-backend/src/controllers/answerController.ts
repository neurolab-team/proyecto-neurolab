import { auth, AuthedRequest } from "../middleware/auth";
import container from "../container/index";
import { CommonDtos } from "../shared/validators";
import { Router } from "express";
import { wrap } from "../middleware/async";
import { ok } from "../utils/jsonResponse";
import { IAnswerService } from "../contracts/answer/IanswerService";
import { Forbidden, NotFound } from "../utils/httpError";
import { created } from "../utils/jsonResponse";
import {
  CreateAnswerDto,
  CreateManyAnswersDto,
} from "@packages/common-schemas/answer.schemas";
import { IAssignmentRepo } from "../contracts/assignment/IassignmentRepo";
import { IUserRepo } from "../contracts/user/IuserRepo";


// Private Routes
export const AnswersController = Router();
const answerService = container.resolve<IAnswerService>("AnswerService");
const assignmentRepo = container.resolve<IAssignmentRepo>("AssignmentRepo");
const userRepo = container.resolve<IUserRepo>("UserRepo");

AnswersController.use(auth);

AnswersController.get(
  "/",
  wrap(async (req: any, res) => {
    const answers = await answerService.getAnswers();
    return ok(res, answers, "Listado de respuestas");
  }),
);

AnswersController.get(
  "/:id",
  wrap(async (req: any, res) => {
    const id = CommonDtos.IdParam.parse(req.params).id;
    const answer = await answerService.getAnswerById(id);

    if (!answer) {
      throw NotFound("Respuesta no encontrada");
    }

    return ok(res, answer, "Respuesta encontrada");
  }),
);

AnswersController.get(
  "/assignment/:id",
  wrap(async (req: any, res) => {
    const id = CommonDtos.IdParam.parse(req.params).id;
    const answers = await answerService.getAnswersByAssignmentTest(id);
    return ok(res, answers, "Listado de respuestas");
  }),
);

AnswersController.get(
  "/assignment/:id/detailed",
  wrap(async (req: AuthedRequest, res) => {
    const id = CommonDtos.IdParam.parse(req.params).id;
    const user = req.user!;

    const assignment = await assignmentRepo.getAssignmentForId(id);
    if (!assignment) throw NotFound("Asignación no encontrada");

    const isOwner = assignment.assignedToId === user.userId;
    const isPsychologist = user.role === "psychologist" || user.role === "admin";

    if (!isOwner && !isPsychologist) throw Forbidden();

    if (isPsychologist && !isOwner) {
      const student = await userRepo.findById(assignment.assignedToId);
      if (student?.assignedPsychologistId !== user.userId && user.role !== "admin") {
        throw Forbidden("No tienes acceso a los resultados de este estudiante");
      }
    }

    const testCode = await assignmentRepo.getTestCodeByAssignmentId(id);
    const isSensitiveTest = testCode === "DASS-21" || testCode === "HAD";
    if (user.role === "user" && isSensitiveTest) {
      return ok(
        res,
        [],
        "Respuestas detalladas restringidas para este tipo de prueba",
      );
    }

    const answers = await answerService.getDetailedAnswers(id);
    return ok(res, answers, "Respuestas detalladas");
  }),
);

AnswersController.get(
  "/assignmentDetails/:id",
  wrap(async (req: any, res) => {
    const id = CommonDtos.IdParam.parse(req.params).id;
    const answers =
      await answerService.getAnswersByAssignmentTestWithDetails(id);
    return ok(res, answers, "Listado de respuestas");
  }),
);

AnswersController.post(
  "/",
  wrap(async (req: any, res) => {
    const input = CreateAnswerDto.parse(req.body);
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
  wrap(async (req: any, res) => {
    const input = CreateManyAnswersDto.parse(req.body);
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
