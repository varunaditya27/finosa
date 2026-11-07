import type { ReactNode } from "react";
import { StyleSheet, View } from "react-native";
import { AppText } from "@/components/app-text";
import { Card } from "@/components/card";
import { colors, spacing } from "@/theme";

export function EmptyState({ title, body, children }: { title: string; body: string; children?: ReactNode }) {
  return (
    <Card style={styles.card}>
      <AppText variant="heading">{title}</AppText>
      <AppText color={colors.muted}>{body}</AppText>
      {children ? <View style={styles.actions}>{children}</View> : null}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { gap: spacing.sm },
  actions: { gap: spacing.sm, marginTop: spacing.sm },
});
