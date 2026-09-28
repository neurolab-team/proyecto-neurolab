import {
  StudyCode,
  StudyConsentDecision,
} from "@packages/common-types/consent.types";
import { AssignmentConsentInput } from "@packages/common-schemas/assignment.schemas";

/** Desde dónde se tomó la decisión; se guarda como contexto de auditoría. */
export type ConsentContext = {
  assignmentId: string | null;
  testCode: string | null;
};

export type TestConsentState = {
  /** false = la prueba no pertenece a ningún estudio. */
  requiresConsent: boolean;
  /** Decisión vigente (versión actual del texto) o null si está pendiente. */
  decision: StudyConsentDecision | null;
};

export interface IStudyConsentService {
  getCurrentDecision(
    userId: string,
    studyCode: StudyCode,
  ): Promise<StudyConsentDecision | null>;
  getConsentStateForTest(
    userId: string,
    testCode: string | null,
  ): Promise<TestConsentState>;
  submit(
    userId: string,
    studyCode: StudyCode,
    input: AssignmentConsentInput,
    context: ConsentContext,
  ): Promise<StudyConsentDecision>;
  /** Lanza 403 si la prueba pertenece a un estudio sin consentimiento aceptado. */
  requireAcceptedForTest(userId: string, testCode: string | null): Promise<void>;
}
