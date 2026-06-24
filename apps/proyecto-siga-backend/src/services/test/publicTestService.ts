import { inject, injectable } from "tsyringe";
import { IPublicTestService } from "../../contracts/test/IpublicTestService";
import { ITestRepo } from "../../contracts/test/ItestRepo";
import { PublicTestCard } from "@packages/common-types/test.types";
import { publicTestCardSchema } from "@packages/common-schemas/test.schemas";

@injectable()
export class PublicTestService implements IPublicTestService {
  constructor(
    @inject("TestRepo")
    private readonly testRepo: ITestRepo,
  ) {}

  async getLandingCards(): Promise<PublicTestCard[]> {
    const tests = await this.testRepo.getPublicLandingTests();

    // Defensa en profundidad: validar/proyectar la salida contra el contrato
    // compartido garantiza que sólo viajan los campos de previsualización
    // (sin ítems, opciones, scoring ni interpretaciones).
    return tests.map((test) => publicTestCardSchema.parse(test));
  }
}
