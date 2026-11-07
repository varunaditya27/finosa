import { accountBalance, categoryTotals, monthTotals } from "./ledger";
import type { Account, Transaction } from "./types";

const account: Account = { id: "a1", name: "Main", type: "bank", openingBalance: 1000000n, openingDate: "2026-11-01" };

function tx(partial: Partial<Transaction> & Pick<Transaction, "kind" | "amount" | "date">): Transaction {
  return { id: Math.random().toString(), accountId: "a1", description: "", categoryId: null, ...partial };
}

describe("accountBalance", () => {
  it("opens at 10,000, receives 2,000 and pays 1,250, so the balance is 10,750", () => {
    const txs = [
      tx({ kind: "income", amount: 200000n, date: "2026-11-02" }),
      tx({ kind: "expense", amount: 125000n, date: "2026-11-03" }),
    ];
    expect(accountBalance(account, txs)).toBe(1075000n);
  });

  it("counts movements on the opening date and ignores earlier ones", () => {
    const txs = [
      tx({ kind: "expense", amount: 5000n, date: "2026-10-31" }),
      tx({ kind: "expense", amount: 7000n, date: "2026-11-01" }),
    ];
    expect(accountBalance(account, txs)).toBe(993000n);
  });

  it("ignores other accounts", () => {
    expect(accountBalance(account, [tx({ kind: "income", amount: 100n, date: "2026-11-02", accountId: "a2" })])).toBe(1000000n);
  });
});

describe("monthTotals", () => {
  const txs = [
    tx({ kind: "income", amount: 12450000n, date: "2026-11-01" }),
    tx({ kind: "expense", amount: 111111n, date: "2026-11-12" }),
    tx({ kind: "expense", amount: 888888n, date: "2026-11-30" }),
    tx({ kind: "expense", amount: 999n, date: "2026-10-31" }),
    tx({ kind: "income", amount: 999n, date: "2026-12-01" }),
  ];

  it("separates income and expense and keeps only the month, including its last day", () => {
    expect(monthTotals(txs, "2026-11")).toEqual({ income: 12450000n, expense: 999999n, net: 11450001n });
  });

  it("is all zero for a month with no transactions", () => {
    expect(monthTotals(txs, "2026-09")).toEqual({ income: 0n, expense: 0n, net: 0n });
  });
});

describe("categoryTotals", () => {
  const txs = [
    tx({ kind: "expense", amount: 30000n, date: "2026-11-02", categoryId: "food" }),
    tx({ kind: "expense", amount: 20000n, date: "2026-11-05", categoryId: "food" }),
    tx({ kind: "expense", amount: 80000n, date: "2026-11-06", categoryId: "rent" }),
    tx({ kind: "expense", amount: 1000n, date: "2026-11-07", categoryId: null }),
    tx({ kind: "income", amount: 500000n, date: "2026-11-08", categoryId: "salary" }),
    tx({ kind: "expense", amount: 9999n, date: "2026-10-30", categoryId: "food" }),
  ];

  it("lists expenses by category, largest first, with an explicit uncategorized bucket", () => {
    expect(categoryTotals(txs, "2026-11")).toEqual([
      { categoryId: "rent", total: 80000n },
      { categoryId: "food", total: 50000n },
      { categoryId: null, total: 1000n },
    ]);
  });

  it("adds up to the month's expense total", () => {
    const sum = categoryTotals(txs, "2026-11").reduce((acc, row) => acc + row.total, 0n);
    expect(sum).toBe(monthTotals(txs, "2026-11").expense);
  });
});
