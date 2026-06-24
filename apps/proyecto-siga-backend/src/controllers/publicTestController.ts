import { Router } from "express";
import container from "../container/index";
import { wrap } from "../middleware/async";
import { ok } from "../utils/jsonResponse";
import { IPublicTestService } from "../contracts/test/IpublicTestService";
import { publicReadRateLimiter } from "../security/httpSecurity";

// Public Routes (sin autenticación)
export const PublicTestController = Router();

const publicTestService =
  container.resolve<IPublicTestService>("PublicTestService");

PublicTestController.get(
  "/",
  publicReadRateLimiter,
  wrap(async (_req, res) => {
    const cards = await publicTestService.getLandingCards();
    return ok(res, cards, "Tests públicos");
  }),
);
