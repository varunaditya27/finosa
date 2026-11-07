import { addDays, isValidDate, monthOf } from "./dates";
import { accountBalance, monthTotals } from "./ledger";
import { makeSample } from "./sample";

const today = "2026-11-07";

describe("addDays", () => {
  it("goes back across month and year boundaries", () => {
    expect(addDays("2026-11-07", -7)).toBe("2026-10-31");
    expect(addDays("2026-01-02", -3)).toBe("2025-12-30");
  });
});

describe("makeSample", () => {
  const { accounts, transactions } = makeSample(today);

  it("uses valid dates and never a date after today", () => {
    for (const tx of transactions) {
      expect(isValidDate(tx.date)).toBe(true);
      expect(tx.date <= today).toBe(true);
    }
  });

  it("only refers to accounts that exist and counts every transaction in a balance", () => {
    for (const tx of transactions) {
      const account = accounts.find((a) => a.id === tx.accountId);
      expect(account).toBeDefined();
      expect(tx.date >= account!.openingDate).toBe(true);
    }
  });

  it("has activity in this month and the one before, so month switching has something to show", () => {
    const months = new Set(transactions.map((tx) => monthOf(tx.date)));
    expect(months.has("2026-11")).toBe(true);
    expect(months.has("2026-10")).toBe(true);
  });

  it("has income and expenses this month and a positive balance everywhere", () => {
    const totals = monthTotals(transactions, "2026-11");
    expect(totals.income > 0n && totals.expense > 0n).toBe(true);
    for (const account of accounts) expect(accountBalance(account, transactions) > 0n).toBe(true);
  });
});
