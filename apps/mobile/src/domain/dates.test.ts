import { addMonths, formatDay, formatMonth, isValidDate, monthOf, todayString } from "./dates";

describe("isValidDate", () => {
  it.each([
    ["2026-11-07", true],
    ["2024-02-29", true],
    ["2026-02-29", false],
    ["2026-13-01", false],
    ["2026-04-31", false],
    ["26-1-1", false],
    ["", false],
  ])("%s -> %s", (value, expected) => {
    expect(isValidDate(value)).toBe(expected);
  });
});

describe("month helpers", () => {
  it("takes the month from a calendar date with no time-zone conversion", () => {
    expect(monthOf("2026-11-30")).toBe("2026-11");
  });

  it("moves across year boundaries", () => {
    expect(addMonths("2026-01", -1)).toBe("2025-12");
    expect(addMonths("2026-12", 1)).toBe("2027-01");
  });

  it("writes the month in words", () => {
    expect(formatMonth("2026-11")).toBe("November 2026");
  });
});

describe("formatDay", () => {
  it("writes a short readable date", () => {
    expect(formatDay("2026-11-07")).toBe("7 Nov 2026");
  });
});

describe("todayString", () => {
  it("uses the local calendar date", () => {
    expect(todayString(new Date(2026, 10, 7, 23, 59))).toBe("2026-11-07");
  });
});
