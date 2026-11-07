import { useRouter } from "expo-router";
import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Button } from "@/components/button";
import { ChoiceGroup } from "@/components/choice-group";
import { EmptyState } from "@/components/empty-state";
import { Screen } from "@/components/screen";
import { TextField } from "@/components/text-field";
import { CATEGORIES } from "@/domain/categories";
import { addDays, isValidDate, todayString } from "@/domain/dates";
import { parseRupees } from "@/domain/money";
import type { TxKind } from "@/domain/types";
import { useLedger } from "@/store/ledger-store";
import { spacing } from "@/theme";

const KIND_OPTIONS: { value: TxKind; label: string }[] = [
  { value: "expense", label: "Expense" },
  { value: "income", label: "Income" },
];

type Errors = { amount?: string; account?: string; date?: string };

export function AddTransaction() {
  const router = useRouter();
  const { state, dispatch } = useLedger();
  const [kind, setKind] = useState<TxKind | null>("expense");
  const [amount, setAmount] = useState("");
  const [accountId, setAccountId] = useState<string | null>(state.accounts.length === 1 ? state.accounts[0].id : null);
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [date, setDate] = useState(todayString());
  const [note, setNote] = useState("");
  const [errors, setErrors] = useState<Errors>({});

  if (state.accounts.length === 0) {
    return (
      <Screen title="Add transaction" onClose={() => router.back()}>
        <EmptyState title="Add an account first" body="A transaction belongs to an account, so FinOSA needs at least one.">
          <Button title="Add account" onPress={() => router.replace("/add-account")} />
        </EmptyState>
      </Screen>
    );
  }

  const categoryOptions = CATEGORIES.filter((c) => c.kind === kind).map((c) => ({ value: c.id, label: c.name }));

  function save() {
    const next: Errors = {};
    const parsed = parseRupees(amount);
    if (!parsed.ok) next.amount = parsed.error;
    if (accountId === null) next.account = "Choose the account this belongs to.";
    if (!isValidDate(date)) next.date = "Enter a real date as YYYY-MM-DD, for example 2026-11-07.";
    setErrors(next);
    if (Object.keys(next).length > 0 || !parsed.ok || accountId === null || kind === null) return;

    dispatch({
      type: "addTransaction",
      transaction: { accountId, kind, amount: parsed.paise, date, description: note.trim(), categoryId },
    });
    router.back();
  }

  return (
    <Screen title="Add transaction" onClose={() => router.back()}>
      <ChoiceGroup
        label="Type"
        options={KIND_OPTIONS}
        value={kind}
        onChange={(value) => {
          setKind(value);
          setCategoryId(null);
        }}
      />
      <TextField label="Amount in ₹" value={amount} onChangeText={setAmount} error={errors.amount} keyboardType="decimal-pad" />
      <ChoiceGroup
        label="Account"
        options={state.accounts.map((a) => ({ value: a.id, label: a.name }))}
        value={accountId}
        onChange={setAccountId}
        error={errors.account}
      />
      <ChoiceGroup label="Category (optional)" options={categoryOptions} value={categoryId} onChange={setCategoryId} clearable />
      <TextField label="Date" value={date} onChangeText={setDate} error={errors.date} hint="Format: YYYY-MM-DD" keyboardType="numbers-and-punctuation" />
      <View style={styles.dateShortcuts}>
        <Button title="Today" variant="secondary" onPress={() => setDate(todayString())} />
        <Button title="Yesterday" variant="secondary" onPress={() => setDate(addDays(todayString(), -1))} />
      </View>
      <TextField label="Note (optional)" value={note} onChangeText={setNote} maxLength={60} />
      <View style={styles.actions}>
        <Button title="Save transaction" onPress={save} />
        <Button title="Cancel" variant="quiet" onPress={() => router.back()} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  dateShortcuts: { flexDirection: "row", gap: spacing.sm },
  actions: { gap: spacing.sm },
});
