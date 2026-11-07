import { initialState, ledgerReducer } from "./ledger-reducer";

const account = { name: "Cash in hand", type: "cash" as const, openingBalance: 0n, openingDate: "2026-11-01" };
const expense = { accountId: "", kind: "expense" as const, amount: 50000n, date: "2026-11-05", description: "Tea", categoryId: "food" };

describe("ledgerReducer", () => {
  it("starts empty", () => {
    expect(initialState.accounts).toEqual([]);
    expect(initialState.transactions).toEqual([]);
  });

  it("adds an account with a fresh id and a notice", () => {
    const state = ledgerReducer(initialState, { type: "addAccount", account });
    expect(state.accounts).toHaveLength(1);
    expect(state.accounts[0].id).toBeTruthy();
    expect(state.notice).toBe('Added account "Cash in hand".');
  });

  it("adds a transaction to an existing account and says what was added", () => {
    const withAccount = ledgerReducer(initialState, { type: "addAccount", account });
    const accountId = withAccount.accounts[0].id;
    const state = ledgerReducer(withAccount, { type: "addTransaction", transaction: { ...expense, accountId } });
    expect(state.transactions).toHaveLength(1);
    expect(state.notice).toBe("Added −₹500.00 to Cash in hand.");
  });

  it("gives every record a different id", () => {
    let state = ledgerReducer(initialState, { type: "addAccount", account });
    const accountId = state.accounts[0].id;
    state = ledgerReducer(state, { type: "addTransaction", transaction: { ...expense, accountId } });
    state = ledgerReducer(state, { type: "addTransaction", transaction: { ...expense, accountId } });
    expect(new Set(state.transactions.map((t) => t.id)).size).toBe(2);
  });

  it("loads sample data into an empty ledger", () => {
    const state = ledgerReducer(initialState, { type: "loadSample", today: "2026-11-07" });
    expect(state.accounts.length).toBeGreaterThan(0);
    expect(state.transactions.length).toBeGreaterThan(0);
  });

  it("never overwrites data the user already entered", () => {
    const withAccount = ledgerReducer(initialState, { type: "addAccount", account });
    const state = ledgerReducer(withAccount, { type: "loadSample", today: "2026-11-07" });
    expect(state).toBe(withAccount);
  });

  it("returns the same state when there is no notice to dismiss", () => {
    expect(ledgerReducer(initialState, { type: "dismissNotice" })).toBe(initialState);
  });

  it("clears the notice when dismissed", () => {
    const state = ledgerReducer(ledgerReducer(initialState, { type: "addAccount", account }), { type: "dismissNotice" });
    expect(state.notice).toBeNull();
  });
});
