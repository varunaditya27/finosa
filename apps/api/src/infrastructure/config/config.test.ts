import { describe, expect, it } from "vitest";
import { loadConfig } from "./config.ts";

describe("loadConfig", () => {
  it("defaults the port to 3000", () => {
    expect(loadConfig({}).PORT).toBe(3000);
  });

  it("reads the port from the environment as a number", () => {
    expect(loadConfig({ PORT: "3100" }).PORT).toBe(3100);
  });

  it("rejects a port that is not a number", () => {
    expect(() => loadConfig({ PORT: "abc" })).toThrow();
  });
});
