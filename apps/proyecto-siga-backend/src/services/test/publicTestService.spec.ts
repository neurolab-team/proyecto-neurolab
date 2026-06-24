import "reflect-metadata";
import { PublicTestService } from "./publicTestService";
import { ITestRepo } from "../../contracts/test/ItestRepo";
import { PublicTestCard } from "@packages/common-types/test.types";

function makeRepo(cards: PublicTestCard[]): ITestRepo {
  return {
    getTestWithQuestionsById: jest.fn(),
    getPsychologistAssignableTests: jest.fn(),
    getPublicLandingTests: jest.fn().mockResolvedValue(cards),
    existsById: jest.fn(),
  } as unknown as ITestRepo;
}

describe("PublicTestService", () => {
  it("retorna las cards mapeadas al contrato de previsualización", async () => {
    const repo = makeRepo([
      {
        testId: "9296e58f-68e0-5edd-92b4-f1725bf1877a",
        testCode: "EPWORTH",
        title: "Escala de Epworth",
        description: "desc",
        audience: "user",
      },
    ]);
    const service = new PublicTestService(repo);

    const result = await service.getLandingCards();

    expect(result).toHaveLength(1);
    expect(result[0].testCode).toBe("EPWORTH");
    expect(result[0].audience).toBe("user");
  });

  it("no expone campos sensibles (questions/scoring/interpretaciones)", async () => {
    // El repo nunca debería traerlos, pero validamos que el service los descarta
    // si por error llegaran (defensa en profundidad vía publicTestCardSchema).
    const dirty = {
      testId: "2b1c0a7e-1111-4222-8333-444455556666",
      testCode: "DASS-21",
      title: "DASS-21",
      description: null,
      audience: "user",
      // campos sensibles inyectados que NO deben sobrevivir al parse
      questions: [{ questionId: "x", prompt: "secreta" }],
      scoreValue: 42,
      interpretation: "no debe filtrarse",
    };
    const repo = makeRepo([dirty as unknown as PublicTestCard]);
    const service = new PublicTestService(repo);

    const result = await service.getLandingCards();

    const card = result[0] as Record<string, unknown>;
    expect(Object.keys(card).sort()).toEqual(
      ["audience", "description", "testCode", "testId", "title"].sort(),
    );
    expect(card).not.toHaveProperty("questions");
    expect(card).not.toHaveProperty("scoreValue");
    expect(card).not.toHaveProperty("interpretation");
  });

  it("propaga una lista vacía cuando no hay tests visibles", async () => {
    const service = new PublicTestService(makeRepo([]));
    await expect(service.getLandingCards()).resolves.toEqual([]);
  });
});
