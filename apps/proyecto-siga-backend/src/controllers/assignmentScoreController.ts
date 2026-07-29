import { Router } from "express";
import { wrap } from "../middleware/async";
import container from "../container/index";
import { AssignmentScoreService } from "../services/assignmentScore/assignmentScoreService";
import { ok } from "../utils/jsonResponse";
import { created } from "../utils/jsonResponse";
import { auth, AuthedRequest } from "../middleware/auth";
import { CommonDtos } from "../shared/validators";
import { NotFound } from "../utils/httpError";
import { AssignmentService } from "../services/assignment/assignmentService";
import {
  AssignmentAccess,
  assignmentAccessGuard,
  isSensitiveTestCode,
} from "../middleware/assignmentAccess";

export const AssignmentScoreController = Router();

AssignmentScoreController.use(auth);

const assignmentScoreService = container.resolve<AssignmentScoreService>(
  "AssignmentScoreService",
);
const assignmentService =
  container.resolve<AssignmentService>("AssignmentService");

/**
 * Devuelve el puntaje con el nivel de detalle que corresponde a quien consulta.
 * El personal clínico ve el puntaje completo. Al propio evaluado se le oculta la
 * interpretación cuando el resultado requiere atención (para que la reciba de su
 * psicólogo y no de una pantalla), y se le marca si las respuestas detalladas
 * están restringidas por ser una prueba sensible.
 */
const buildScoreResponse = async (
  assignmentId: string,
  access: AssignmentAccess,
) => {
  const score =
    await assignmentScoreService.getAssignmentScoreByAssignmentId(assignmentId);

  if (!score) throw NotFound("Resultados no disponibles");

  if (access.isClinician) {
    return score;
  }

  const testCode = await assignmentAccessGuard().getTestCode(assignmentId);
  const isRestrictedForUser = score.attentionLevel === "high";

  return {
    assignmentId: score.assignmentId,
    interpretation: isRestrictedForUser ? null : score.interpretation,
    interpretationRestricted: isRestrictedForUser,
    detailedAnswersRestricted: isSensitiveTestCode(testCode),
  };
};

AssignmentScoreController.get(
  "/:id/results",
  wrap(async (req: AuthedRequest, res) => {
    const assignmentId = CommonDtos.IdParam.parse(req.params).id;

    const access = await assignmentAccessGuard().requireReadAccess(
      req.user!,
      assignmentId,
    );

    const result = await buildScoreResponse(assignmentId, access);
    return ok(res, result, "Resultados de la asignación");
  }),
);

AssignmentScoreController.get(
  "/:id",
  wrap(async (req: AuthedRequest, res) => {
    const assignmentId = CommonDtos.IdParam.parse(req.params).id;

    const access = await assignmentAccessGuard().requireReadAccess(
      req.user!,
      assignmentId,
    );

    const result = await buildScoreResponse(assignmentId, access);
    return ok(res, result, "Detalle de la asignación");
  }),
);

AssignmentScoreController.post(
  "/create",
  wrap(async (req: AuthedRequest, res) => {
    const assignmentId = CommonDtos.IdParam.parse(req.body).id;

    // Calcular el puntaje cierra la asignación: solo puede hacerlo el evaluado
    // al terminar su propia prueba.
    await assignmentAccessGuard().requireOwnership(req.user!, assignmentId);

    const assignmentScore =
      await assignmentScoreService.createAssignmentScore(assignmentId);
    await assignmentService.markAssignmentAsCompleted(assignmentId);
    return created(res, assignmentScore, "Puntaje de la asignación creado");
  }),
);
