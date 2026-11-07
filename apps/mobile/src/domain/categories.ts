import type { Category } from "./types";

export const CATEGORIES: Category[] = [
  { id: "food", name: "Food and groceries", kind: "expense" },
  { id: "rent", name: "Rent", kind: "expense" },
  { id: "transport", name: "Transport", kind: "expense" },
  { id: "utilities", name: "Bills and utilities", kind: "expense" },
  { id: "shopping", name: "Shopping", kind: "expense" },
  { id: "health", name: "Health", kind: "expense" },
  { id: "salary", name: "Salary", kind: "income" },
  { id: "other-income", name: "Other income", kind: "income" },
];

/** Route and filter value for transactions with no category. */
export const UNCATEGORIZED = "none";

export function categoryName(id: string | null): string {
  if (id === null) return "Uncategorized";
  return CATEGORIES.find((c) => c.id === id)?.name ?? "Uncategorized";
}
