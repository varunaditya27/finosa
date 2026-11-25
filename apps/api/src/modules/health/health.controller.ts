import type { IncomingMessage, ServerResponse } from "node:http";
import { sendJson } from "../../infrastructure/http/response.ts";

export function getHealth(_req: IncomingMessage, res: ServerResponse): void {
  sendJson(res, 200, { status: "ok" });
}
