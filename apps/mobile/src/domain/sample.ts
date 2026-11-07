import { addMonths, monthOf } from "./dates";
import type { Account, Transaction } from "./types";

const pad = (n: number) => String(n).padStart(2, "0");

/** Made-up accounts and transactions for this month and the one before. */
export function makeSample(today: string): { accounts: Account[]; transactions: Transaction[] } {
  const month = monthOf(today);
  const previous = addMonths(month, -1);
  const todayDay = Number(today.slice(8, 10));
  const openingDate = `${addMonths(month, -2)}-01`;
  // This month's dates never run past today. Last month's days stay within 28 so they exist in every month.
  const now = (day: number) => `${month}-${pad(Math.min(day, todayDay))}`;
  const before = (day: number) => `${previous}-${pad(day)}`;

  const accounts: Account[] = [
    { id: "sample-bank", name: "Everyday bank account", type: "bank", openingBalance: 6000000n, openingDate },
    { id: "sample-cash", name: "Cash in hand", type: "cash", openingBalance: 300000n, openingDate },
    { id: "sample-wallet", name: "UPI wallet", type: "wallet", openingBalance: 800000n, openingDate },
  ];

  const rows: [string, "income" | "expense", bigint, string, string, string | null][] = [
    ["sample-bank", "income", 8500000n, now(1), "Monthly salary", "salary"],
    ["sample-bank", "expense", 1800000n, now(1), "Rent", "rent"],
    ["sample-bank", "expense", 164250n, now(2), "Weekly groceries", "food"],
    ["sample-wallet", "expense", 28000n, now(3), "Auto rickshaw", "transport"],
    ["sample-bank", "expense", 124500n, now(4), "Electricity bill", "utilities"],
    ["sample-cash", "expense", 45000n, now(5), "Tea and snacks", "food"],
    ["sample-wallet", "expense", 349900n, now(6), "Headphones", "shopping"],
    ["sample-wallet", "expense", 12000n, now(6), "Paid back a friend", null],
    ["sample-bank", "income", 8500000n, before(1), "Monthly salary", "salary"],
    ["sample-bank", "expense", 1800000n, before(1), "Rent", "rent"],
    ["sample-bank", "expense", 178000n, before(8), "Weekly groceries", "food"],
    ["sample-bank", "expense", 118000n, before(10), "Electricity bill", "utilities"],
    ["sample-wallet", "expense", 85000n, before(14), "Pharmacy", "health"],
    ["sample-wallet", "expense", 32000n, before(20), "Cab to the airport", "transport"],
    ["sample-bank", "expense", 249900n, before(22), "Shoes", "shopping"],
    ["sample-cash", "expense", 60000n, before(25), "Lunch with colleagues", "food"],
  ];

  const transactions = rows.map(([accountId, kind, amount, date, description, categoryId], i) => ({
    id: `sample-tx-${i + 1}`,
    accountId,
    kind,
    amount,
    date,
    description,
    categoryId,
  }));

  return { accounts, transactions };
}
