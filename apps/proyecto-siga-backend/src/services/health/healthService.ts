import { injectable } from "tsyringe";
import prisma from "@packages/libs/prisma";
import redis from "@packages/libs/redis/redis";
import {
  DependencyStatus,
  HealthReport,
  IHealthService,
} from "../../contracts/health/IHealthService";

@injectable()
export class HealthService implements IHealthService {
  // El SHA del commit lo inyecta el deploy (variable de entorno COMMIT_SHA).
  // El job `verify` del pipeline busca este valor en la respuesta para confirmar
  // que la versión desplegada es la esperada.
  private readonly version = process.env.COMMIT_SHA ?? "unknown";

  async check(): Promise<HealthReport> {
    const [database, cache] = await Promise.all([
      this.pingDatabase(),
      this.pingRedis(),
    ]);

    const allUp = database === "up" && cache === "up";

    return {
      status: allUp ? "ok" : "degraded",
      version: this.version,
      uptime: Math.floor(process.uptime()),
      timestamp: new Date().toISOString(),
      dependencies: {
        database,
        redis: cache,
      },
    };
  }

  private async pingDatabase(): Promise<DependencyStatus> {
    try {
      await prisma.$queryRaw`SELECT 1`;
      return "up";
    } catch {
      return "down";
    }
  }

  private async pingRedis(): Promise<DependencyStatus> {
    try {
      const pong = await redis.ping();
      return pong === "PONG" ? "up" : "down";
    } catch {
      return "down";
    }
  }
}
