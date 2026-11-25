import type { Route } from "../../infrastructure/http/router.ts";
import { getHealth } from "./health.controller.ts";

export const healthRoutes: Route[] = [{ method: "GET", path: "/health", handler: getHealth }];
