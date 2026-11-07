import { StyleSheet, View } from "react-native";
import { AppText } from "@/components/app-text";
import { colors, spacing } from "@/theme";

type Props = {
  title: string;
  subtitle: string;
  amount: string;
  amountColor?: string;
  first?: boolean;
};

// Rows sit inside one Card and are separated by hairlines, not one box per row.
export function ListRow({ title, subtitle, amount, amountColor = colors.ink, first }: Props) {
  return (
    <View style={[styles.row, !first && styles.divider]}>
      <View style={styles.text}>
        <AppText variant="bodyStrong" selectable>
          {title}
        </AppText>
        <AppText variant="caption" color={colors.muted} selectable>
          {subtitle}
        </AppText>
      </View>
      <AppText variant="bodyStrong" color={amountColor} numeric selectable>
        {amount}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md - 4,
    minHeight: 56,
  },
  divider: { borderTopWidth: 1, borderTopColor: colors.hairline },
  text: { flex: 1, gap: 2 },
});
