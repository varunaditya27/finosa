import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { createApp } from "./app.ts";
import { startServer } from "./testing/start-server.ts";

let server: Awaited<ReturnType<typeof startServer>>;

beforeAll(async () => {
  server = await startServer(createApp());
});

afterAll(() => server.close());

describe("the app", () => {
  it("answers GET /health with 200 and status ok", async () => {
    const res = await fetch(`${server.baseUrl}/health`);
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ status: "ok" });
  });

  it("answers 404 for an unknown path", async () => {
    const res = await fetch(`${server.baseUrl}/nope`);
    expect(res.status).toBe(404);
  });

  it("answers 405 with an Allow header for a wrong method", async () => {
    const res = await fetch(`${server.baseUrl}/health`, { method: "POST" });
    expect(res.status).toBe(405);
    expect(res.headers.get("allow")).toBe("GET");
  });
});
