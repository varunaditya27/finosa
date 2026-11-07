export type TxKind = "income" | "expense";

export type AccountType = "bank" | "wallet" | "cash" | "other";

export type Account = {
  id: string;
  name: string;
  type: AccountType;
  /** Whole paise. */
  openingBalance: bigint;
  /** Calendar date, YYYY-MM-DD. */
  openingDate: string;
};

export type Category = { id: string; name: string; kind: TxKind };

export type Transaction = {
  id: string;
  accountId: string;
  kind: TxKind;
  /** Whole paise, never negative. The kind says which way it moves the balance. */
  amount: bigint;
  /** Calendar date, YYYY-MM-DD. */
  date: string;
  description: string;
  categoryId: string | null;
};
