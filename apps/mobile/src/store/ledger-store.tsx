import { createContext, useContext, useReducer, type Dispatch, type ReactNode } from "react";
import { initialState, ledgerReducer, type LedgerAction, type LedgerState } from "./ledger-reducer";

const LedgerContext = createContext<{ state: LedgerState; dispatch: Dispatch<LedgerAction> } | null>(null);

export function LedgerProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(ledgerReducer, initialState);
  return <LedgerContext value={{ state, dispatch }}>{children}</LedgerContext>;
}

export function useLedger() {
  const value = useContext(LedgerContext);
  if (!value) throw new Error("useLedger must be used inside LedgerProvider");
  return value;
}
