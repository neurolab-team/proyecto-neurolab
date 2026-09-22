import { Router } from "express";
import { wrap } from "../middleware/async";
import container from "../container/index";
import { AssignmentService } from "../services/assignment/assignmentService";
import { PsychologistDashboardQueryService } from "../modules/psychologist/psychologistDashboardQuery";
import { ok } from "../utils/jsonResponse";
import { asPsychologist, auth, AuthedRequest } from "../middleware/auth";
import { assignmentAccessGuard } from "../middleware/assignmentAccess";
import { CommonDtos } from "../shared/validators";
import { Forbidden } from "../utils/httpError";
import { IUserRepo } from "../contracts/user/IuserRepo";
import {
  AssignmentConsentDto,
  BulkAssignPsychologistTestDto,
} from "@packages/common-schemas/assignment.schemas";

export const AssignmentController = Router();

const assignmentService = container.resolve<AssignmentService>("AssignmentService");
const dashboardQueryService = container.resolve<PsychologistDashboardQueryService>("PsychologistDashboardQueryService");
const userRepo = container.resolve<IUserRepo>("UserRepo");

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
  "/psychologist/tests",
  auth,
  asPsychologist,
  wrap(async (_req: AuthedRequest, res) => {
    const tests = await assignmentService.getPsychologistAssignableTests();
    return ok(res, tests, "Listado de pruebas asignables");
  }),
);

AssignmentController.post(
  "/psychologist/bulk",
  auth,
  asPsychologist,
  wrap(async (req: AuthedRequest, res) => {
    const payload = BulkAssignPsychologistTestDto.parse(req.body);
    const result = await assignmentService.bulkAssignByPsychologist(
      req.user!.userId,
      payload,
    );
    return ok(res, result, "Asignaciones masivas procesadas");
  }),
);

AssignmentController.get(
  "/:assignmentId/test",
  auth,
  wrap(async (req: AuthedRequest, res) => {
    const { assignmentId } = CommonDtos.AssignmentIdParam.parse(req.params);

    await assignmentAccessGuard().requireReadAccess(req.user!, assignmentId);

    const assignment = await assignmentService.getAssignmentById(assignmentId);
    return ok(res, assignment, "Detalle de la asignación");
  }),
);

AssignmentController.patch(
  "/:assignmentId/consent",
  auth,
  wrap(async (req: AuthedRequest, res) => {
    const { assignmentId } = CommonDtos.AssignmentIdParam.parse(req.params);
    const { accepted } = AssignmentConsentDto.parse(req.body);

    // Solo el evaluado decide su propio consentimiento; ni un psicólogo ni
    // un admin pueden aceptar/rechazar en su nombre.
    await assignmentAccessGuard().requireOwnership(req.user!, assignmentId);

    const assignment = await assignmentService.submitConsent(assignmentId, accepted);
    return ok(res, assignment, "Consentimiento registrado");
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
  wrap(async (req: AuthedRequest, res) => {
    const { userId } = CommonDtos.UserIdParam.parse(req.params);
    const requester = req.user!;

    // El userId venía del path y nunca se comparaba con la sesión: cualquier
    // usuario podía listar las asignaciones de otro cambiando el id de la URL.
    if (userId !== requester.userId) {
      if (requester.role === "admin") {
        // Los admin pueden consultar cualquier usuario.
      } else if (requester.role === "psychologist") {
        const student = await userRepo.findById(userId);
        if (student?.assignedPsychologistId !== requester.userId) {
          throw Forbidden("No tienes acceso a las pruebas de este estudiante");
        }
      } else {
        throw Forbidden();
      }
    }

    const assignments =
      await assignmentService.getAssignmentsWithTestsByUserId(userId);
    return ok(res, assignments, "Listado de asignaciones con test");
  }),
);
