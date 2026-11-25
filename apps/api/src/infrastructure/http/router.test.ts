import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { sendJson } from "./response.ts";
import { createRouter } from "./router.ts";
import { startServer } from "../../testing/start-server.ts";

let server: Awaited<ReturnType<typeof startServer>>;

beforeAll(async () => {
  server = await startServer(
    createRouter([
      { method: "GET", path: "/things", handler: (_req, res) => sendJson(res, 200, { list: true }) },
      { method: "POST", path: "/things", handler: (_req, res) => sendJson(res, 201, { created: true }) },
      { method: "GET", path: "/things/:id", handler: (_req, res, params) => sendJson(res, 200, { id: params["id"] }) },
    ]),
  );
});

afterAll(() => server.close());

describe("createRouter", () => {
  it("calls the handler whose method and path match", async () => {
    const res = await fetch(`${server.baseUrl}/things`, { method: "POST" });
    expect(res.status).toBe(201);
  });

  it("passes path parameters to the handler", async () => {
    const res = await fetch(`${server.baseUrl}/things/42`);
    expect(await res.json()).toEqual({ id: "42" });
  });

  it("ignores the query string when matching", async () => {
    const res = await fetch(`${server.baseUrl}/things?page=2`);
    expect(res.status).toBe(200);
  });

  it("answers 404 when no route matches the path", async () => {
    const res = await fetch(`${server.baseUrl}/other`);
    expect(res.status).toBe(404);
    expect(await res.json()).toEqual({ error: "not_found" });
  });

  it("answers 405 and lists every allowed method when the path exists", async () => {
    const res = await fetch(`${server.baseUrl}/things`, { method: "DELETE" });
    expect(res.status).toBe(405);
    expect(res.headers.get("allow")).toBe("GET, POST");
    expect(await res.json()).toEqual({ error: "method_not_allowed" });
  });
});
