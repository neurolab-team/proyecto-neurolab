import { Router } from "express";
import { wrap } from "../middleware/async";
import container from "../container/index";
import { AssignmentScoreService } from "../services/assignmentScore/assignmentScoreService";
import { ok } from "../utils/jsonResponse";
import { created } from "../utils/jsonResponse";
import { auth, AuthedRequest } from "../middleware/auth";
import { CommonDtos } from "../shared/validators";
import { NotFound, Forbidden } from "../utils/httpError";
import { AssignmentService } from "../services/assignment/assignmentService";
import { IAssignmentRepo } from "../contracts/assignment/IassignmentRepo";
import { IUserRepo } from "../contracts/user/IuserRepo";

export const AssignmentScoreController = Router();

AssignmentScoreController.use(auth);

const assignmentScoreService = container.resolve<AssignmentScoreService>(
  "AssignmentScoreService",
);
const assignmentService =
  container.resolve<AssignmentService>("AssignmentService");
const assignmentRepo = container.resolve<IAssignmentRepo>("AssignmentRepo");
const userRepo = container.resolve<IUserRepo>("UserRepo");

AssignmentScoreController.get(
  "/:id/results",
  wrap(async (req: AuthedRequest, res) => {
    const assignmentId = CommonDtos.IdParam.parse(req.params).id;
    const user = req.user!;

    const assignment = await assignmentRepo.getAssignmentForId(assignmentId);
    if (!assignment) throw NotFound("Asignación no encontrada");

    const isOwner = assignment.assignedToId === user.userId;
    const isPsychologist = user.role === "psychologist" || user.role === "admin";

    if (!isOwner && !isPsychologist) throw Forbidden();

    // Psicólogo solo ve resultados de sus estudiantes asignados
    if (isPsychologist && !isOwner) {
      const student = await userRepo.findById(assignment.assignedToId);
      if (student?.assignedPsychologistId !== user.userId && user.role !== "admin") {
        throw Forbidden("No tienes acceso a los resultados de este estudiante");
      }
    }

    const score = await assignmentScoreService.getAssignmentScoreByAssignmentId(assignmentId);
    if (!score) throw NotFound("Resultados no disponibles");

    const testCode = await assignmentRepo.getTestCodeByAssignmentId(assignmentId);
    const isSensitiveTest = testCode === "DASS-21" || testCode === "HAD";
    const isRestrictedForUser =
      user.role === "user" && score.attentionLevel === "high";
    const detailedAnswersRestricted = user.role === "user" && isSensitiveTest;

    const result = isPsychologist
      ? score
      : {
          assignmentId: score.assignmentId,
          interpretation: isRestrictedForUser ? null : score.interpretation,
          interpretationRestricted: isRestrictedForUser,
          detailedAnswersRestricted,
        };

    return ok(res, result, "Resultados de la asignación");
  }),
);

AssignmentScoreController.get(
  "/:id",
  wrap(async (req, res) => {
    const assignmentId = CommonDtos.IdParam.parse(req.params).id;

    const assignmentScore =
      await assignmentScoreService.getAssignmentScoreByAssignmentId(
        assignmentId,
      );
    if (!assignmentScore) {
      throw NotFound("AssignmentScore not found");
    }
    return ok(res, assignmentScore, "Detalle de la asignación");
  }),
);
AssignmentScoreController.post(
  "/create",
  wrap(async (req, res) => {
    const assignmentId = CommonDtos.IdParam.parse(req.body).id;
    const assignmentScore =
      await assignmentScoreService.createAssignmentScore(assignmentId);
    await assignmentService.markAssignmentAsCompleted(assignmentId);
    return created(res, assignmentScore, "Puntaje de la asignación creado");
  }),
);
