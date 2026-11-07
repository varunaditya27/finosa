import { StyleSheet, TextInput, View, type TextInputProps } from "react-native";
import { AppText } from "@/components/app-text";
import { colors, minTouch, radius, spacing, type } from "@/theme";

type Props = Omit<TextInputProps, "style"> & { label: string; error?: string; hint?: string };

export function TextField({ label, error, hint, ...input }: Props) {
  return (
    <View style={styles.field}>
      <AppText variant="label">{label}</AppText>
      <TextInput
        aria-label={label}
        placeholderTextColor={colors.muted}
        style={[styles.input, type.body, { borderColor: error ? colors.negative : colors.hairline }]}
        {...input}
      />
      {error ? (
        <AppText variant="caption" color={colors.negative} aria-live="polite" selectable>
          {error}
        </AppText>
      ) : hint ? (
        <AppText variant="caption" color={colors.muted}>
          {hint}
        </AppText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  field: { gap: spacing.xs },
  input: {
    minHeight: minTouch,
    paddingHorizontal: spacing.md,
    borderWidth: 1,
    borderRadius: radius.control,
    borderCurve: "continuous",
    backgroundColor: colors.surface,
    color: colors.ink,
  },
});
