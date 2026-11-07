import { useFocusEffect } from "expo-router";
import { useCallback, type ReactNode } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AppText } from "@/components/app-text";
import { Button } from "@/components/button";
import { IconButton } from "@/components/icon-button";
import { colors, radius, spacing } from "@/theme";
import { useLedger } from "@/store/ledger-store";

type Props = {
  title: string;
  children: ReactNode;
  /** Button in the header corner, for example "Add". */
  action?: { label: string; onPress: () => void };
  /** Shows a close button instead, for screens that slide over the tabs. */
  onClose?: () => void;
};

export function Screen({ title, children, action, onClose }: Props) {
  const { state, dispatch } = useLedger();
  // A saved-message belongs to the screen it appeared on, so leaving a tab clears it. Sheets skip this
  // because they close right after saving, and the message must survive until the tab behind is shown.
  useFocusEffect(
    useCallback(() => {
      if (onClose) return;
      return () => dispatch({ type: "dismissNotice" });
    }, [onClose, dispatch]),
  );
  return (
    <SafeAreaView style={styles.safe} edges={onClose ? ["top", "bottom"] : ["top"]}>
      <View style={styles.header}>
        <AppText variant="title" role="heading">
          {title}
        </AppText>
        {action ? <Button variant="secondary" title={action.label} onPress={action.onPress} /> : null}
        {onClose ? <IconButton icon="close" label="Close" onPress={onClose} /> : null}
      </View>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        {state.notice && !onClose ? (
          <View style={styles.notice} aria-live="polite">
            <AppText style={styles.noticeText} selectable>
              {state.notice}
            </AppText>
            <IconButton icon="close" label="Dismiss message" onPress={() => dispatch({ type: "dismissNotice" })} />
          </View>
        ) : null}
        {children}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.porcelain },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
  },
  content: { padding: spacing.md, gap: spacing.md },
  notice: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.mint,
    borderRadius: radius.control,
    borderCurve: "continuous",
    paddingLeft: spacing.md,
  },
  noticeText: { flex: 1 },
});
