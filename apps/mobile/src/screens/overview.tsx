import { useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { AppText } from "@/components/app-text";
import { Button } from "@/components/button";
import { Card } from "@/components/card";
import { EmptyState } from "@/components/empty-state";
import { IconButton } from "@/components/icon-button";
import { Screen } from "@/components/screen";
import { categoryName, UNCATEGORIZED } from "@/domain/categories";
import { addMonths, formatMonth, monthOf, todayString } from "@/domain/dates";
import { categoryTotals, monthTotals } from "@/domain/ledger";
import { formatRupees, formatSigned } from "@/domain/money";
import { useLedger } from "@/store/ledger-store";
import { colors, radius, spacing } from "@/theme";

export function Overview() {
  const router = useRouter();
  const { state, dispatch } = useLedger();
  const [month, setMonth] = useState(monthOf(todayString()));

  const totals = monthTotals(state.transactions, month);
  const categories = categoryTotals(state.transactions, month);
  const hasActivity = state.transactions.some((tx) => monthOf(tx.date) === month);

  return (
    <Screen title="Overview" action={{ label: "Add", onPress: () => router.push("/add-transaction") }}>
      {state.accounts.length === 0 ? (
        <EmptyState
          title="Start with an account"
          body="An account is a place your money sits, like a bank account or cash in hand. Add one, or load practice data to look around."
        >
          <Button title="Add account" onPress={() => router.push("/add-account")} />
          <Button title="Load practice data" variant="secondary" onPress={() => dispatch({ type: "loadSample", today: todayString() })} />
        </EmptyState>
      ) : (
        <>
          <View style={styles.monthRow}>
            <IconButton icon="chevron-left" label="Previous month" onPress={() => setMonth(addMonths(month, -1))} />
            <AppText variant="heading" role="heading">
              {formatMonth(month)}
            </AppText>
            <IconButton icon="chevron-right" label="Next month" onPress={() => setMonth(addMonths(month, 1))} />
          </View>

          {hasActivity ? (
            <>
              <Card style={styles.summary}>
                <AppText variant="label" color={colors.muted}>
                  Income minus expenses
                </AppText>
                <AppText variant="display" numeric selectable>
                  {formatRupees(totals.net)}
                </AppText>
                <View style={styles.split}>
                  <View>
                    <AppText variant="caption" color={colors.muted}>
                      Income
                    </AppText>
                    <AppText variant="bodyStrong" color={colors.positive} numeric selectable>
                      {formatSigned("income", totals.income)}
                    </AppText>
                  </View>
                  <View>
                    <AppText variant="caption" color={colors.muted}>
                      Expenses
                    </AppText>
                    <AppText variant="bodyStrong" numeric selectable>
                      {formatSigned("expense", totals.expense)}
                    </AppText>
                  </View>
                </View>
              </Card>

              <View style={styles.section}>
                <AppText variant="heading" role="heading">
                  Where it went
                </AppText>
                {categories.length === 0 ? (
                  <AppText color={colors.muted}>No spending recorded in {formatMonth(month)}.</AppText>
                ) : (
                  <Card padded={false}>
                    {categories.map(({ categoryId, total }, index) => {
                      const share = Number((total * 10000n) / totals.expense) / 100;
                      const name = categoryName(categoryId);
                      return (
                        <Pressable
                          key={categoryId ?? UNCATEGORIZED}
                          role="button"
                          aria-label={`${name}, ${formatRupees(total)}, ${Math.round(share)} percent of spending. Opens the matching transactions.`}
                          onPress={() =>
                            router.navigate({ pathname: "/history", params: { month, category: categoryId ?? UNCATEGORIZED } })
                          }
                          style={({ pressed }) => [styles.categoryRow, index > 0 && styles.divider, { opacity: pressed ? 0.7 : 1 }]}
                        >
                          <View style={styles.categoryTop}>
                            <AppText variant="bodyStrong">{name}</AppText>
                            <AppText variant="bodyStrong" numeric>
                              {formatRupees(total)}
                            </AppText>
                          </View>
                          <View style={styles.track}>
                            <View style={[styles.fill, { width: `${share}%` }]} />
                          </View>
                          <AppText variant="caption" color={colors.muted}>
                            {Math.round(share)}% of spending
                          </AppText>
                        </Pressable>
                      );
                    })}
                  </Card>
                )}
              </View>
            </>
          ) : (
            <EmptyState title={`No transactions in ${formatMonth(month)}`} body="Add one, or use the arrows to look at another month.">
              <Button title="Add transaction" onPress={() => router.push("/add-transaction")} />
            </EmptyState>
          )}
        </>
      )}
      <AppText variant="caption" color={colors.muted}>
        This is a practice app. No bank is connected, and nothing here is financial advice.
      </AppText>
    </Screen>
  );
}

const styles = StyleSheet.create({
  monthRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  section: { gap: spacing.sm },
  summary: { gap: spacing.xs },
  split: { flexDirection: "row", gap: spacing.xl, marginTop: spacing.sm },
  categoryRow: { padding: spacing.md, gap: spacing.xs, minHeight: 72 },
  divider: { borderTopWidth: 1, borderTopColor: colors.hairline },
  categoryTop: { flexDirection: "row", justifyContent: "space-between", gap: spacing.md },
  track: { height: 6, borderRadius: radius.pill, backgroundColor: colors.mint, overflow: "hidden" },
  fill: { height: 6, borderRadius: radius.pill, backgroundColor: colors.jade },
});
