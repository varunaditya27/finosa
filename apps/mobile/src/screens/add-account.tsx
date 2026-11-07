import { useRouter } from "expo-router";
import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { AppText } from "@/components/app-text";
import { Button } from "@/components/button";
import { ChoiceGroup } from "@/components/choice-group";
import { Screen } from "@/components/screen";
import { TextField } from "@/components/text-field";
import { isValidDate, todayString } from "@/domain/dates";
import { parseRupees } from "@/domain/money";
import { ACCOUNT_TYPE_LABEL, type AccountType } from "@/domain/types";
import { useLedger } from "@/store/ledger-store";
import { colors, spacing } from "@/theme";

const TYPE_OPTIONS = (Object.keys(ACCOUNT_TYPE_LABEL) as AccountType[]).map((value) => ({ value, label: ACCOUNT_TYPE_LABEL[value] }));

type Errors = { name?: string; balance?: string; date?: string };

export function AddAccount() {
  const router = useRouter();
  const { state, dispatch } = useLedger();
  const [name, setName] = useState("");
  const [type, setType] = useState<AccountType | null>("bank");
  const [balance, setBalance] = useState("");
  const [date, setDate] = useState(todayString());
  const [errors, setErrors] = useState<Errors>({});

  function save() {
    const next: Errors = {};
    const trimmed = name.trim();
    if (trimmed === "") next.name = "Enter a name for the account.";
    else if (state.accounts.some((a) => a.name.toLowerCase() === trimmed.toLowerCase())) {
      next.name = "You already have an account with this name.";
    }
    const parsed = balance.trim() === "" ? ({ ok: true, paise: 0n } as const) : parseRupees(balance, { allowZero: true });
    if (!parsed.ok) next.balance = parsed.error;
    if (!isValidDate(date)) next.date = "Enter a real date as YYYY-MM-DD, for example 2026-11-07.";
    setErrors(next);
    if (Object.keys(next).length > 0 || !parsed.ok || type === null) return;

    dispatch({ type: "addAccount", account: { name: trimmed, type, openingBalance: parsed.paise, openingDate: date } });
    router.back();
  }

  return (
    <Screen title="Add account" onClose={() => router.back()}>
      <TextField label="Account name" value={name} onChangeText={setName} error={errors.name} maxLength={40} autoCapitalize="words" />
      <ChoiceGroup label="Type" options={TYPE_OPTIONS} value={type} onChange={setType} />
      <TextField
        label="Opening balance (optional)"
        value={balance}
        onChangeText={setBalance}
        error={errors.balance}
        hint="What the account held on the date below. Leave empty for ₹0.00."
        keyboardType="decimal-pad"
      />
      <TextField label="Counted from" value={date} onChangeText={setDate} error={errors.date} hint="Format: YYYY-MM-DD" keyboardType="numbers-and-punctuation" />
      <AppText variant="caption" color={colors.muted}>
        Currency: Indian rupee (₹). Other currencies are not supported yet.
      </AppText>
      <View style={styles.actions}>
        <Button title="Save account" onPress={save} />
        <Button title="Cancel" variant="quiet" onPress={() => router.back()} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({ actions: { gap: spacing.sm } });
