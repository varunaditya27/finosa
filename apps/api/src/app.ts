import type { IncomingMessage, RequestListener, ServerResponse } from "node:http";
import { sendJson } from "./infrastructure/http/response.ts";
import { getHealth } from "./modules/health/health.controller.ts";

export function createApp(): RequestListener {
  return (req: IncomingMessage, res: ServerResponse) => {
    const { pathname } = new URL(req.url ?? "/", "http://localhost");
    if (req.method === "GET" && pathname === "/health") {
      getHealth(req, res);
      return;
    }
    sendJson(res, 404, { error: "not_found" });
  };
}
