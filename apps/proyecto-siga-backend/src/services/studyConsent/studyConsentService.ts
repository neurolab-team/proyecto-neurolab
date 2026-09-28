import { inject, injectable } from "tsyringe";
import { studyConsent } from "@packages/libs/prisma";
import {
  ConsentStatus,
  CURRENT_CONSENT_VERSION,
  getStudyCodeForTest,
  StudyCode,
  StudyConsentDecision,
} from "@packages/common-types/consent.types";
import { AssignmentConsentInput } from "@packages/common-schemas/assignment.schemas";
import { IStudyConsentRepo } from "../../contracts/studyConsent/IstudyConsentRepo";
import {
  ConsentContext,
  IStudyConsentService,
  TestConsentState,
} from "../../contracts/studyConsent/IstudyConsentService";
import { Forbidden } from "../../utils/httpError";

const toDecision = (row: studyConsent): StudyConsentDecision => ({
  status: row.status as ConsentStatus,
  allowsSleepTips: row.allowsSleepTips,
  allowsStudyInvites: row.allowsStudyInvites,
  respondedAt: row.respondedAt,
});

/**
 * Consentimiento informado por estudio.
 *
 * Solo cuenta como vigente la decisión más reciente del usuario y únicamente
 * si se tomó sobre `CURRENT_CONSENT_VERSION`: al cambiar el texto legal se
 * sube la versión y se le vuelve a preguntar a todos.
 */
@injectable()
export class StudyConsentService implements IStudyConsentService {
  constructor(
    @inject("StudyConsentRepo")
    private readonly studyConsentRepo: IStudyConsentRepo,
  ) {}

  async getCurrentDecision(
    userId: string,
    studyCode: StudyCode,
  ): Promise<StudyConsentDecision | null> {
    const latest = await this.studyConsentRepo.findLatest(userId, studyCode);
    if (!latest || latest.version !== CURRENT_CONSENT_VERSION) {
      return null;
    }
    return toDecision(latest);
  }

  async getConsentStateForTest(
    userId: string,
    testCode: string | null,
  ): Promise<TestConsentState> {
    const studyCode = getStudyCodeForTest(testCode);
    if (!studyCode) {
      return { requiresConsent: false, decision: null };
    }
    return {
      requiresConsent: true,
      decision: await this.getCurrentDecision(userId, studyCode),
    };
  }

  /**
   * Registra una decisión nueva. Si es idéntica a la vigente (mismo estado,
   * mismas autorizaciones, misma versión) no inserta otra fila: no aporta
   * nada al historial y se devuelve la existente.
   */
  async submit(
    userId: string,
    studyCode: StudyCode,
    input: AssignmentConsentInput,
    context: ConsentContext,
  ): Promise<StudyConsentDecision> {
    const status: ConsentStatus = input.accepted ? "accepted" : "declined";
    // Defensa en profundidad: el DTO ya las limpia si no acepta.
    const allowsSleepTips = input.accepted && input.allowsSleepTips;
    const allowsStudyInvites = input.accepted && input.allowsStudyInvites;

    const latest = await this.studyConsentRepo.findLatest(userId, studyCode);
    if (
      latest &&
      latest.version === CURRENT_CONSENT_VERSION &&
      latest.status === status &&
      latest.allowsSleepTips === allowsSleepTips &&
      latest.allowsStudyInvites === allowsStudyInvites
    ) {
      return toDecision(latest);
    }

    const row = await this.studyConsentRepo.create({
      userId,
      studyCode,
      version: CURRENT_CONSENT_VERSION,
      status,
      allowsSleepTips,
      allowsStudyInvites,
      assignmentId: context.assignmentId,
      testCode: context.testCode,
    });
    return toDecision(row);
  }

  async requireAcceptedForTest(
    userId: string,
    testCode: string | null,
  ): Promise<void> {
    const { requiresConsent, decision } = await this.getConsentStateForTest(
      userId,
      testCode,
    );
    if (requiresConsent && decision?.status !== "accepted") {
      throw Forbidden(
        "Debes aceptar el consentimiento informado antes de responder esta prueba",
      );
    }
  }
}
