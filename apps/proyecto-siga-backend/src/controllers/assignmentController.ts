import { Router } from "express";
import { wrap } from "../middleware/async";
import container from "../container/index";
import { AssignmentService } from "../services/assigment/assignmentService";
import { ok } from "../utils/jsonResponse";
import { auth } from "../middleware/auth";

export const AssignmentController = Router();

const assignmentService =
  container.resolve<AssignmentService>("AssignmentService");

AssignmentController.get(
  "/:assignmentId/test",
  auth,
  wrap(async (req, res) => {
    const { assignmentId } = req.params;
    const assignment = await assignmentService.getAssignmentById(assignmentId);
    return ok(res, assignment, "Detalle de la asignación");
  }),
);
