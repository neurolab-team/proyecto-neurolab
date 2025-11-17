import { Router } from "express";
import { wrap } from "../middleware/async";
import container from "../container/index";
import { AssignmentScoreService } from "../services/assignmentScore/assignmentScoreService";
import { ok } from "../utils/jsonResponse";
import { auth } from "../middleware/auth";
import { CommonDtos } from "../shared/validators";
import { NotFound } from "../utils/httpError";

export const AssignmentScoreController = Router();

AssignmentScoreController.use(auth);

const assignmentScoreService = container.resolve<AssignmentScoreService>(
  "AssignmentScoreService",
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
  "/create/:id",
  wrap(async (req, res) => {
    const assignmentId = CommonDtos.IdParam.parse(req.params).id;
    const assignmentScore =
      await assignmentScoreService.createAssignmentScore(assignmentId);
    return ok(res, assignmentScore, "Puntaje de la asignación creado");
  }),
);
