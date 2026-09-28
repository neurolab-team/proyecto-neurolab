import "reflect-metadata";
import { studyConsent } from "@packages/libs/prisma";
import { CURRENT_CONSENT_VERSION } from "@packages/common-types/consent.types";
import { StudyConsentService } from "./studyConsentService";
import { IStudyConsentRepo } from "../../contracts/studyConsent/IstudyConsentRepo";

const USER_ID = "11111111-1111-4111-8111-111111111111";
const CONTEXT = {
  assignmentId: "33333333-3333-4333-8333-333333333333",
  testCode: "PSQI",
};

function makeRow(overrides: Partial<studyConsent> = {}): studyConsent {
  return {
    studyConsentId: "22222222-2222-4222-8222-222222222222",
    userId: USER_ID,
    studyCode: "MATELAB_II_SLEEP",
    version: CURRENT_CONSENT_VERSION,
    status: "accepted",
    allowsSleepTips: false,
    allowsStudyInvites: false,
    source: "user",
    assignmentId: null,
    testCode: null,
    respondedAt: new Date("2026-09-28T10:00:00Z"),
    ...overrides,
  };
}

function makeRepo(latest: studyConsent | null): jest.Mocked<IStudyConsentRepo> {
  return {
    findLatest: jest.fn().mockResolvedValue(latest),
    create: jest.fn().mockImplementation(async (data) => makeRow(data)),
  };
}

describe("StudyConsentService", () => {
  it("considera pendiente una decisión tomada sobre una versión anterior del texto", async () => {
    const service = new StudyConsentService(
      makeRepo(makeRow({ version: "matelab-ii-2026-09" })),
    );

    const state = await service.getConsentStateForTest(USER_ID, "PSQI");

    expect(state).toEqual({ requiresConsent: true, decision: null });
  });

  it("comparte la decisión entre todas las pruebas del estudio", async () => {
    const repo = makeRepo(makeRow());
    const service = new StudyConsentService(repo);

    for (const testCode of ["EPWORTH", "PSQI", "MUNICH"]) {
      const state = await service.getConsentStateForTest(USER_ID, testCode);
      expect(state.decision?.status).toBe("accepted");
    }
    expect(repo.findLatest).toHaveBeenCalledWith(USER_ID, "MATELAB_II_SLEEP");
  });

  it("no exige consentimiento en pruebas fuera de un estudio", async () => {
    const repo = makeRepo(null);
    const service = new StudyConsentService(repo);

    await expect(service.requireAcceptedForTest(USER_ID, "GAD7")).resolves.toBeUndefined();
    expect(repo.findLatest).not.toHaveBeenCalled();
  });

  it("bloquea responder si el usuario rechazó el consentimiento", async () => {
    const service = new StudyConsentService(makeRepo(makeRow({ status: "declined" })));

    await expect(service.requireAcceptedForTest(USER_ID, "EPWORTH")).rejects.toMatchObject({
      message: expect.stringContaining("consentimiento"),
    });
  });

  it("descarta las autorizaciones opcionales si no acepta participar", async () => {
    const repo = makeRepo(null);
    const service = new StudyConsentService(repo);

    await service.submit(USER_ID, "MATELAB_II_SLEEP", {
      accepted: false,
      allowsSleepTips: true,
      allowsStudyInvites: true,
    }, CONTEXT);

    expect(repo.create).toHaveBeenCalledWith(
      expect.objectContaining({
        status: "declined",
        version: CURRENT_CONSENT_VERSION,
        allowsSleepTips: false,
        allowsStudyInvites: false,
      }),
    );
  });

  it("guarda las autorizaciones opcionales cuando acepta", async () => {
    const repo = makeRepo(null);
    const service = new StudyConsentService(repo);

    const decision = await service.submit(USER_ID, "MATELAB_II_SLEEP", {
      accepted: true,
      allowsSleepTips: true,
      allowsStudyInvites: false,
    }, CONTEXT);

    expect(decision).toMatchObject({
      status: "accepted",
      allowsSleepTips: true,
      allowsStudyInvites: false,
    }, CONTEXT);
  });

  it("guarda desde qué asignación y prueba se tomó la decisión", async () => {
    const repo = makeRepo(null);
    const service = new StudyConsentService(repo);

    await service.submit(
      USER_ID,
      "MATELAB_II_SLEEP",
      { accepted: true, allowsSleepTips: false, allowsStudyInvites: false },
      CONTEXT,
    );

    expect(repo.create).toHaveBeenCalledWith(expect.objectContaining(CONTEXT));
  });

  it("no inserta otra fila si la decisión es idéntica a la vigente", async () => {
    const latest = makeRow({ status: "declined" });
    const repo = makeRepo(latest);
    const service = new StudyConsentService(repo);

    const decision = await service.submit(
      USER_ID,
      "MATELAB_II_SLEEP",
      { accepted: false, allowsSleepTips: false, allowsStudyInvites: false },
      CONTEXT,
    );

    expect(repo.create).not.toHaveBeenCalled();
    expect(decision.respondedAt).toEqual(latest.respondedAt);
  });

  it("sí inserta si cambia una autorización opcional", async () => {
    const repo = makeRepo(makeRow({ allowsSleepTips: false }));
    const service = new StudyConsentService(repo);

    await service.submit(
      USER_ID,
      "MATELAB_II_SLEEP",
      { accepted: true, allowsSleepTips: true, allowsStudyInvites: false },
      CONTEXT,
    );

    expect(repo.create).toHaveBeenCalledTimes(1);
  });

  it("sí inserta si la vigente es de una versión anterior del texto", async () => {
    const repo = makeRepo(makeRow({ version: "matelab-ii-2026-09" }));
    const service = new StudyConsentService(repo);

    await service.submit(
      USER_ID,
      "MATELAB_II_SLEEP",
      { accepted: true, allowsSleepTips: false, allowsStudyInvites: false },
      CONTEXT,
    );

    expect(repo.create).toHaveBeenCalledTimes(1);
  });
});
