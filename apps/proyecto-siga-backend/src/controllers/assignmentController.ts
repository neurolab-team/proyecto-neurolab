import { Router } from "express";
import { wrap } from "../middleware/async";
import container from "../container/index";
import { AssignmentService } from "../services/assignment/assignmentService";
import { ok } from "../utils/jsonResponse";
import { asUser, auth } from "../middleware/auth";

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

AssignmentController.get("/by-user/:userId/tests",
  auth,
  asUser,
  wrap(async (req, res) => {
    const { userId } = req.params;
    const assignments =
      await assignmentService.getAssignmentsWithTestsByUserId(userId);
    return ok(res, assignments, "Listado de asignaciones con test");
  }),
);