import { Assignment } from "@packages/common-types/assignment.types";
import { Forbidden, NotFound } from "../utils/httpError";
import { IAssignmentRepo } from "../contracts/assignment/IassignmentRepo";
import { IUserRepo } from "../contracts/user/IuserRepo";
import container from "../container/index";
import { AuthedUser } from "./auth";

/**
 * Reglas de acceso a una asignación y a todo lo que cuelga de ella
 * (respuestas y puntajes), centralizadas en un único lugar.
 *
 * Antes cada endpoint decidía por su cuenta: los que la implementaban lo hacían
 * bien, pero varios se habían quedado solo con `auth`, lo que permitía leer y
 * escribir datos clínicos de cualquier usuario cambiando el id de la URL.
 *
 * Reglas:
 * - El dueño de la asignación (el evaluado) siempre tiene acceso.
 * - Un admin tiene acceso a cualquier asignación.
 * - Un psicólogo solo accede si el evaluado es uno de sus estudiantes asignados.
 * - Cualquier otro caso es 403.
 */

/** Pruebas cuyas respuestas crudas no se devuelven al propio evaluado. */
const SENSITIVE_TEST_CODES = new Set(["DASS-21", "HAD"]);

export type AssignmentAccess = {
  assignment: Assignment;
  /** El usuario autenticado es el evaluado. */
  isOwner: boolean;
  /** El usuario tiene rol clínico o administrativo sobre la asignación. */
  isClinician: boolean;
  isAdmin: boolean;
};

export interface AssignmentAccessDeps {
  assignmentRepo: Pick<IAssignmentRepo, "getAssignmentForId" | "getTestCodeByAssignmentId">;
  userRepo: Pick<IUserRepo, "findById">;
}

export const isSensitiveTestCode = (testCode: string | null): boolean =>
  testCode !== null && SENSITIVE_TEST_CODES.has(testCode);

/**
 * Determina si el evaluado debe ver las respuestas detalladas de la prueba.
 * Para las pruebas sensibles no se le devuelven al propio usuario; sí al
 * personal clínico.
 */
export const detailedAnswersAllowedFor = (
  access: AssignmentAccess,
  testCode: string | null,
): boolean => access.isClinician || !isSensitiveTestCode(testCode);

export const createAssignmentAccessGuard = (deps: AssignmentAccessDeps) => {
  const resolveAccess = async (
    user: AuthedUser,
    assignmentId: string,
  ): Promise<AssignmentAccess> => {
    const assignment = await deps.assignmentRepo.getAssignmentForId(assignmentId);

    if (!assignment) {
      throw NotFound("Asignación no encontrada");
    }

    const isOwner = assignment.assignedToId === user.userId;
    const isAdmin = user.role === "admin";
    const hasClinicalRole = isAdmin || user.role === "psychologist";

    if (isOwner) {
      return { assignment, isOwner: true, isClinician: hasClinicalRole, isAdmin };
    }

    if (isAdmin) {
      return { assignment, isOwner: false, isClinician: true, isAdmin: true };
    }

    if (user.role === "psychologist") {
      const student = await deps.userRepo.findById(assignment.assignedToId);

      if (student?.assignedPsychologistId !== user.userId) {
        throw Forbidden("No tienes acceso a los resultados de este estudiante");
      }

      return { assignment, isOwner: false, isClinician: true, isAdmin: false };
    }

    throw Forbidden();
  };

  /**
   * Acceso de lectura: dueño, admin o psicólogo asignado al evaluado.
   */
  const requireReadAccess = resolveAccess;

  /**
   * Acceso de escritura (guardar respuestas, calcular puntaje): solo el
   * evaluado. Ni un psicólogo ni un admin responden pruebas en nombre de otro.
   */
  const requireOwnership = async (
    user: AuthedUser,
    assignmentId: string,
  ): Promise<AssignmentAccess> => {
    const access = await resolveAccess(user, assignmentId);

    if (!access.isOwner) {
      throw Forbidden("Solo el usuario evaluado puede modificar esta asignación");
    }

    return access;
  };

  const getTestCode = (assignmentId: string): Promise<string | null> =>
    deps.assignmentRepo.getTestCodeByAssignmentId(assignmentId);

  return { requireReadAccess, requireOwnership, getTestCode };
};

export type AssignmentAccessGuard = ReturnType<typeof createAssignmentAccessGuard>;

let defaultGuard: AssignmentAccessGuard | null = null;

/** Instancia por defecto, resuelta del contenedor de forma diferida. */
export const assignmentAccessGuard = (): AssignmentAccessGuard => {
  if (!defaultGuard) {
    defaultGuard = createAssignmentAccessGuard({
      assignmentRepo: container.resolve<IAssignmentRepo>("AssignmentRepo"),
      userRepo: container.resolve<IUserRepo>("UserRepo"),
    });
  }

  return defaultGuard;
};
