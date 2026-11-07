import { formatRupees, formatSigned, parseRupees } from "./money";

describe("parseRupees", () => {
  it("stores 100.10 exactly as 10,010 paise", () => {
    expect(parseRupees("100.10")).toEqual({ ok: true, paise: 10010n });
  });

  it("accepts whole rupees, commas and a rupee sign", () => {
    expect(parseRupees("1250")).toEqual({ ok: true, paise: 125000n });
    expect(parseRupees("₹1,24,500.5")).toEqual({ ok: true, paise: 12450050n });
  });

  it("asks for an amount when empty", () => {
    expect(parseRupees("  ")).toEqual({ ok: false, error: "Enter an amount." });
  });

  it("rejects text with a specific message", () => {
    expect(parseRupees("abc")).toEqual({ ok: false, error: "Use digits only, for example 1250 or 1250.50." });
  });

  it("rejects a minus sign and points to the Expense and Income choice", () => {
    expect(parseRupees("-5")).toEqual({
      ok: false,
      error: "Enter the amount without a minus sign. Choose Expense or Income instead.",
    });
  });

  it("rejects more than two decimal places", () => {
    expect(parseRupees("10.123")).toEqual({ ok: false, error: "Use at most two decimal places." });
  });

  it("rejects zero unless zero is allowed", () => {
    expect(parseRupees("0")).toEqual({ ok: false, error: "Enter an amount greater than ₹0." });
    expect(parseRupees("0", { allowZero: true })).toEqual({ ok: true, paise: 0n });
  });

  it("rejects amounts that are too large", () => {
    expect(parseRupees("1000000000000")).toEqual({ ok: false, error: "That amount is too large." });
  });
});

describe("formatRupees", () => {
  it.each([
    [0n, "₹0.00"],
    [10010n, "₹100.10"],
    [99999n, "₹999.99"],
    [100000n, "₹1,000.00"],
    [12450000n, "₹1,24,500.00"],
    [10000000n, "₹1,00,000.00"],
    [1000000000n, "₹1,00,00,000.00"],
  ])("formats %s paise as %s", (paise, expected) => {
    expect(formatRupees(paise)).toBe(expected);
  });

  it("puts a real minus sign in front of negative amounts", () => {
    expect(formatRupees(-100n)).toBe("−₹1.00");
  });
});

describe("formatSigned", () => {
  it("shows the direction in words-free symbols, not only color", () => {
    expect(formatSigned("income", 12450000n)).toBe("+₹1,24,500.00");
    expect(formatSigned("expense", 111111n)).toBe("−₹1,111.11");
  });

  it("shows no sign for zero", () => {
    expect(formatSigned("expense", 0n)).toBe("₹0.00");
    expect(formatSigned("income", 0n)).toBe("₹0.00");
  });
});
