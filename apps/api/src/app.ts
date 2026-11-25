import type { RequestListener } from "node:http";
import { createRouter } from "./infrastructure/http/router.ts";
import { healthRoutes } from "./modules/health/health.routes.ts";

export function createApp(): RequestListener {
  return createRouter([...healthRoutes]);
}
