import type { IncomingMessage, RequestListener, ServerResponse } from "node:http";
import { sendJson } from "./response.ts";

export type RouteHandler = (
  req: IncomingMessage,
  res: ServerResponse,
  params: Record<string, string | undefined>,
) => void | Promise<void>;

export interface Route {
  method: string;
  path: string;
  handler: RouteHandler;
}

export function createRouter(routes: readonly Route[]): RequestListener {
  const compiled = routes.map((route) => ({
    ...route,
    pattern: new URLPattern({ pathname: route.path }),
  }));

  return async (req, res) => {
    const { pathname } = new URL(req.url ?? "/", "http://localhost");
    const sameMethod = (route: { method: string }) => route.method === req.method;
    const onPath = compiled.filter((route) => route.pattern.test({ pathname }));

    if (onPath.length === 0) {
      sendJson(res, 404, { error: "not_found" });
      return;
    }
    const hit = onPath.find(sameMethod);
    if (!hit) {
      res.setHeader("allow", [...new Set(onPath.map((route) => route.method))].join(", "));
      sendJson(res, 405, { error: "method_not_allowed" });
      return;
    }
    const params = hit.pattern.exec({ pathname })?.pathname.groups ?? {};
    await hit.handler(req, res, params);
  };
}
