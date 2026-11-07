import { Pressable, StyleSheet, type StyleProp, type ViewStyle } from "react-native";
import { AppText } from "@/components/app-text";
import { colors, minTouch, radius, spacing, type } from "@/theme";

type Variant = "primary" | "secondary" | "quiet";

const LOOK: Record<Variant, { background: string; text: string; border: string }> = {
  primary: { background: colors.ink, text: colors.surface, border: colors.ink },
  secondary: { background: colors.surface, text: colors.ink, border: colors.hairline },
  quiet: { background: "transparent", text: colors.positive, border: "transparent" },
};

type Props = {
  title: string;
  onPress: () => void;
  variant?: Variant;
  style?: StyleProp<ViewStyle>;
};

export function Button({ title, onPress, variant = "primary", style }: Props) {
  const look = LOOK[variant];
  return (
    <Pressable
      role="button"
      onPress={onPress}
      style={({ pressed }) => [
        styles.base,
        { backgroundColor: look.background, borderColor: look.border, opacity: pressed ? 0.7 : 1 },
        style,
      ]}
    >
      <AppText style={type.label} color={look.text}>
        {title}
      </AppText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: minTouch,
    paddingHorizontal: spacing.md,
    borderRadius: radius.control,
    borderCurve: "continuous",
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
