import { formatSigned } from "@/domain/money";
import { makeSample } from "@/domain/sample";
import type { Account, Transaction } from "@/domain/types";

export type LedgerState = {
  accounts: Account[];
  transactions: Transaction[];
  notice: string | null;
  isSample: boolean;
  nextId: number;
};

export type LedgerAction =
  | { type: "loadSample"; today: string }
  | { type: "addAccount"; account: Omit<Account, "id"> }
  | { type: "addTransaction"; transaction: Omit<Transaction, "id"> }
  | { type: "dismissNotice" };

export const initialState: LedgerState = { accounts: [], transactions: [], notice: null, isSample: false, nextId: 1 };

export function ledgerReducer(state: LedgerState, action: LedgerAction): LedgerState {
  switch (action.type) {
    case "loadSample": {
      // Sample data is only for an empty ledger, so it can never overwrite what the user entered.
      if (state.accounts.length > 0 || state.transactions.length > 0) return state;
      return { ...state, ...makeSample(action.today), isSample: true, notice: null };
    }
    case "addAccount": {
      const account = { ...action.account, id: `acc-${state.nextId}` };
      return {
        ...state,
        accounts: [...state.accounts, account],
        nextId: state.nextId + 1,
        notice: `Added account "${account.name}".`,
      };
    }
    case "addTransaction": {
      const account = state.accounts.find((a) => a.id === action.transaction.accountId);
      if (!account) return state;
      const transaction = { ...action.transaction, id: `tx-${state.nextId}` };
      return {
        ...state,
        transactions: [...state.transactions, transaction],
        nextId: state.nextId + 1,
        notice: `Added ${formatSigned(transaction.kind, transaction.amount)} to ${account.name}.`,
      };
    }
    case "dismissNotice":
      return { ...state, notice: null };
  }
}
