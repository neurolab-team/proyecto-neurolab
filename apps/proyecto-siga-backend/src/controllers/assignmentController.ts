import { Router } from "express";
import { wrap } from "../middleware/async";
import container from "../container/index";
import { AssignmentService } from "../services/assignment/assignmentService";
import { PsychologistDashboardQueryService } from "../modules/psychologist/psychologistDashboardQuery";
import { ok } from "../utils/jsonResponse";
import { asPsychologist, asUser, auth, AuthedRequest } from "../middleware/auth";
import { CommonDtos } from "../shared/validators";

export const AssignmentController = Router();

const assignmentService = container.resolve<AssignmentService>("AssignmentService");
const dashboardQueryService = container.resolve<PsychologistDashboardQueryService>("PsychologistDashboardQueryService");

AssignmentController.get(
  "/psychologist/dashboard/stats",
  auth,
  asPsychologist,
  wrap(async (req: AuthedRequest, res) => {
    const stats = await dashboardQueryService.getDashboardStats(req.user!.userId);
    return ok(res, stats, "Estadisticas del dashboard");
  }),
);

AssignmentController.get(
  "/psychologist/dashboard/feed",
  auth,
  asPsychologist,
  wrap(async (req: AuthedRequest, res) => {
    const feed = await dashboardQueryService.getDashboardFeed(req.user!.userId);
    return ok(res, feed, "Feed del dashboard");
  }),
);

AssignmentController.get(
  "/:assignmentId/test",
  auth,
  wrap(async (req, res) => {
    const { assignmentId } = req.params;
    const assignment = await assignmentService.getAssignmentById(assignmentId);
    return ok(res, assignment, "Detalle de la asignación");
  }),
);

AssignmentController.patch(
  "/:id/review",
  auth,
  asPsychologist,
  wrap(async (req: AuthedRequest, res) => {
    const assignmentId = CommonDtos.IdParam.parse(req.params).id;
    const assignment = await assignmentService.markAssignmentAsReviewed(
      req.user!.userId,
      assignmentId,
    );
    return ok(res, assignment, "Asignacion revisada con exito");
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