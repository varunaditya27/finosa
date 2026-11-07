import { StyleSheet, View } from "react-native";
import { AppText } from "@/components/app-text";
import { FocusPressable } from "@/components/focus-pressable";
import { colors, minTouch, radius, spacing } from "@/theme";

type Option<T extends string> = { value: T; label: string };

type Props<T extends string> = {
  label: string;
  options: Option<T>[];
  value: T | null;
  onChange: (value: T | null) => void;
  /** When true, pressing the selected option again clears the choice. */
  clearable?: boolean;
  error?: string;
};

// The selected option also gets a heavier border and bolder text, so selection never depends on color alone.
export function ChoiceGroup<T extends string>({ label, options, value, onChange, clearable, error }: Props<T>) {
  return (
    <View style={styles.group} role="radiogroup" aria-label={label}>
      <AppText variant="label">{label}</AppText>
      <View style={styles.row}>
        {options.map((option) => {
          const selected = option.value === value;
          return (
            <FocusPressable
              key={option.value}
              role="radio"
              aria-checked={selected}
              onPress={() => onChange(selected && clearable ? null : option.value)}
              style={[
                styles.chip,
                selected ? styles.selected : { borderColor: colors.hairline, backgroundColor: colors.surface },
              ]}
            >
              <AppText variant={selected ? "label" : "body"}>{option.label}</AppText>
            </FocusPressable>
          );
        })}
      </View>
      {error ? (
        <AppText variant="caption" color={colors.negative} aria-live="polite" selectable>
          {error}
        </AppText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  group: { gap: spacing.xs },
  row: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm },
  chip: {
    minHeight: minTouch,
    paddingHorizontal: spacing.md,
    borderRadius: radius.pill,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  selected: { borderColor: colors.ink, borderWidth: 2, backgroundColor: colors.mint },
});
