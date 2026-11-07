import { useLocalSearchParams, useRouter } from "expo-router";
import { StyleSheet, View } from "react-native";
import { AppText } from "@/components/app-text";
import { Button } from "@/components/button";
import { Card } from "@/components/card";
import { ChoiceGroup } from "@/components/choice-group";
import { EmptyState } from "@/components/empty-state";
import { ListRow } from "@/components/list-row";
import { Screen } from "@/components/screen";
import { CATEGORIES, categoryName, UNCATEGORIZED } from "@/domain/categories";
import { formatDay, formatMonth, isValidDate, monthOf } from "@/domain/dates";
import { formatSigned } from "@/domain/money";
import { useLedger } from "@/store/ledger-store";
import { colors, spacing } from "@/theme";

const CATEGORY_OPTIONS = [...CATEGORIES.map((c) => ({ value: c.id, label: c.name })), { value: UNCATEGORIZED, label: "Uncategorized" }];

export function History() {
  const router = useRouter();
  const { state } = useLedger();
  const { month, category } = useLocalSearchParams<{ month?: string; category?: string }>();
  const monthFilter = month && /^\d{4}-\d{2}$/.test(month) && isValidDate(`${month}-01`) ? month : undefined;

  const matches = state.transactions
    .filter((tx) => !monthFilter || monthOf(tx.date) === monthFilter)
    .filter((tx) => !category || (tx.categoryId ?? UNCATEGORIZED) === category);
  // Newest first. Reversing first keeps later entries on top when two share a date.
  const rows = matches.slice().reverse().sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
  const shownIncome = matches.filter((t) => t.kind === "income").reduce((s, t) => s + t.amount, 0n);
  const shownExpense = matches.filter((t) => t.kind === "expense").reduce((s, t) => s + t.amount, 0n);
  const filtered = Boolean(monthFilter || category);
  const clear = () => router.setParams({ month: undefined, category: undefined });

  return (
    <Screen title="History" action={{ label: "Add", onPress: () => router.push("/add-transaction") }}>
      {state.transactions.length === 0 ? (
        <EmptyState title="No transactions yet" body="Every balance and total in FinOSA is worked out from the transactions you record.">
          <Button
            title={state.accounts.length === 0 ? "Add account" : "Add transaction"}
            onPress={() => router.push(state.accounts.length === 0 ? "/add-account" : "/add-transaction")}
          />
        </EmptyState>
      ) : (
        <>
          <ChoiceGroup
            label="Category"
            options={CATEGORY_OPTIONS}
            value={category ?? null}
            clearable
            onChange={(value) => router.setParams({ category: value ?? undefined })}
          />
          {monthFilter ? (
            <View style={styles.monthRow}>
              <AppText variant="label">Month: {formatMonth(monthFilter)}</AppText>
              <Button title="Show all months" variant="quiet" onPress={() => router.setParams({ month: undefined })} />
            </View>
          ) : null}

          <AppText variant="caption" color={colors.muted} selectable>
            {rows.length} {rows.length === 1 ? "transaction" : "transactions"} · income {formatSigned("income", shownIncome)} ·
            expenses {formatSigned("expense", shownExpense)}
          </AppText>

          {rows.length === 0 ? (
            <EmptyState title="Nothing matches these filters" body="Try another category, or clear the filters to see everything.">
              {filtered ? <Button title="Clear filters" onPress={clear} /> : null}
            </EmptyState>
          ) : (
            // shortcut: ScrollView draws every row, switch this list to FlatList once it holds real data.
            <Card padded={false}>
              {rows.map((tx, index) => {
                const account = state.accounts.find((a) => a.id === tx.accountId);
                return (
                  <ListRow
                    key={tx.id}
                    first={index === 0}
                    title={tx.description || categoryName(tx.categoryId)}
                    subtitle={`${formatDay(tx.date)} · ${account?.name ?? "Unknown account"} · ${categoryName(tx.categoryId)}`}
                    amount={formatSigned(tx.kind, tx.amount)}
                    amountColor={tx.kind === "income" ? colors.positive : colors.ink}
                  />
                );
              })}
            </Card>
          )}
        </>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  monthRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: spacing.sm },
});
