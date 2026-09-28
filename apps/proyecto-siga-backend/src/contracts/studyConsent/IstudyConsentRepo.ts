import { studyConsent } from "@packages/libs/prisma";
import { ConsentStatus, StudyCode } from "@packages/common-types/consent.types";

export type CreateStudyConsentData = {
  userId: string;
  studyCode: StudyCode;
  version: string;
  status: ConsentStatus;
  allowsSleepTips: boolean;
  allowsStudyInvites: boolean;
  assignmentId: string | null;
  testCode: string | null;
};

/**
 * Acceso a `studyConsents`. La tabla es de solo inserción: no hay update ni
 * delete, cada decisión nueva del usuario es una fila nueva.
 */
export interface IStudyConsentRepo {
  /** Decisión más reciente del usuario para el estudio, sin filtrar versión. */
  findLatest(userId: string, studyCode: StudyCode): Promise<studyConsent | null>;
  create(data: CreateStudyConsentData): Promise<studyConsent>;
}
