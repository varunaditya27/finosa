import { StyleSheet, View, type ViewProps } from "react-native";
import { colors, radius, spacing } from "@/theme";

export function Card({ style, padded = true, ...rest }: ViewProps & { padded?: boolean }) {
  return <View style={[styles.card, padded && styles.padded, style]} {...rest} />;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderColor: colors.hairline,
    borderWidth: 1,
    borderRadius: radius.card,
    borderCurve: "continuous",
    overflow: "hidden",
  },
  padded: { padding: spacing.md },
});
