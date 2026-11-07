import { Pressable, StyleSheet } from "react-native";
import { Icon, type IconName } from "@/components/icon";
import { colors, minTouch } from "@/theme";

export function IconButton({ icon, label, onPress }: { icon: IconName; label: string; onPress: () => void }) {
  return (
    <Pressable
      role="button"
      aria-label={label}
      onPress={onPress}
      style={({ pressed }) => [styles.base, { opacity: pressed ? 0.6 : 1 }]}
    >
      <Icon name={icon} color={colors.ink} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: { width: minTouch, height: minTouch, alignItems: "center", justifyContent: "center" },
});
