import { monthOf } from "./dates";
import type { Account, Transaction } from "./types";

const signed = (tx: Transaction) => (tx.kind === "income" ? tx.amount : -tx.amount);

/** Opening balance plus movements from the opening date onward, inclusive. */
export function accountBalance(account: Account, transactions: Transaction[]): bigint {
  return transactions
    .filter((tx) => tx.accountId === account.id && tx.date >= account.openingDate)
    .reduce((sum, tx) => sum + signed(tx), account.openingBalance);
}

export function monthTotals(transactions: Transaction[], month: string) {
  let income = 0n;
  let expense = 0n;
  for (const tx of transactions) {
    if (monthOf(tx.date) !== month) continue;
    if (tx.kind === "income") income += tx.amount;
    else expense += tx.amount;
  }
  return { income, expense, net: income - expense };
}

/** Expenses for the month by category, largest first. A null categoryId is the Uncategorized bucket. */
export function categoryTotals(transactions: Transaction[], month: string) {
  const totals = new Map<string | null, bigint>();
  for (const tx of transactions) {
    if (tx.kind !== "expense" || monthOf(tx.date) !== month) continue;
    totals.set(tx.categoryId, (totals.get(tx.categoryId) ?? 0n) + tx.amount);
  }
  return [...totals]
    .map(([categoryId, total]) => ({ categoryId, total }))
    .sort((a, b) => (a.total === b.total ? 0 : a.total < b.total ? 1 : -1));
}
