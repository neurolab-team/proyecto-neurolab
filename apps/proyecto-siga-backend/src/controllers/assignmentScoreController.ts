import { Router } from "express";
import { wrap } from "../middleware/async";
import container from "../container/index";
import { AssignmentScoreService } from "../services/assignmentScore/assignmentScoreService";
import { ok } from "../utils/jsonResponse";
import { created } from "../utils/jsonResponse";
import { auth } from "../middleware/auth";
import { CommonDtos } from "../shared/validators";
import { NotFound } from "../utils/httpError";
import { AssignmentService } from "../services/assignment/assignmentService";

export const AssignmentScoreController = Router();

AssignmentScoreController.use(auth);

const assignmentScoreService = container.resolve<AssignmentScoreService>(
  "AssignmentScoreService",
);
const assignmentService =
  container.resolve<AssignmentService>("AssignmentService");

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
