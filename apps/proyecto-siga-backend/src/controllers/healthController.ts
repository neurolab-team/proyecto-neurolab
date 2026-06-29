import { Router } from "express";
import container from "../container/index";
import { wrap } from "../middleware/async";
import { IHealthService } from "../contracts/health/IHealthService";

export const HealthController = Router();

const healthService = container.resolve<IHealthService>("HealthService");

// GET /api/health — verificación de readiness usada por el pipeline (job verify),
// el HEALTHCHECK del contenedor y el proxy inverso.
// Responde 200 si DB y Redis están arriba; 503 si alguna dependencia está caída
// (un contenedor levantado pero con un servicio caído debe marcarse como fallido).
HealthController.get(
  "/",
  wrap(async (_req, res) => {
    const report = await healthService.check();
    const statusCode = report.status === "ok" ? 200 : 503;
    return res.status(statusCode).json(report);
  }),
);
