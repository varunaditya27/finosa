import { useRouter } from "expo-router";
import { AppText } from "@/components/app-text";
import { Button } from "@/components/button";
import { Card } from "@/components/card";
import { EmptyState } from "@/components/empty-state";
import { ListRow } from "@/components/list-row";
import { Screen } from "@/components/screen";
import { formatDay, todayString } from "@/domain/dates";
import { accountBalance } from "@/domain/ledger";
import { formatRupees } from "@/domain/money";
import { useLedger } from "@/store/ledger-store";
import { colors } from "@/theme";
import type { AccountType } from "@/domain/types";

export const ACCOUNT_TYPE_LABEL: Record<AccountType, string> = {
  bank: "Bank account",
  wallet: "Wallet",
  cash: "Cash",
  other: "Other",
};

export function Accounts() {
  const router = useRouter();
  const { state, dispatch } = useLedger();

  return (
    <Screen title="Accounts" action={{ label: "Add account", onPress: () => router.push("/add-account") }}>
      {state.accounts.length === 0 ? (
        <EmptyState title="No accounts yet" body="Add the first place your money sits, or load practice data to look around.">
          <Button title="Add account" onPress={() => router.push("/add-account")} />
          <Button title="Load practice data" variant="secondary" onPress={() => dispatch({ type: "loadSample", today: todayString() })} />
        </EmptyState>
      ) : (
        <>
          <Card padded={false}>
            {state.accounts.map((account, index) => (
              <ListRow
                key={account.id}
                first={index === 0}
                title={account.name}
                subtitle={`${ACCOUNT_TYPE_LABEL[account.type]} · counted from ${formatDay(account.openingDate)}`}
                amount={formatRupees(accountBalance(account, state.transactions))}
              />
            ))}
          </Card>
          <AppText variant="caption" color={colors.muted}>
            Each balance is the opening balance plus income minus expenses since the opening date. It is worked out from the records, not
            taken from a bank.
          </AppText>
          <Button title="Add transaction" onPress={() => router.push("/add-transaction")} />
        </>
      )}
    </Screen>
  );
}
