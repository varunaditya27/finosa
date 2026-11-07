import { useState } from "react";
import { Pressable, type PressableProps, type PressableStateCallbackType, type StyleProp, type ViewStyle } from "react-native";
import { colors } from "@/theme";

type Props = Omit<PressableProps, "style"> & {
  style?: StyleProp<ViewStyle> | ((state: PressableStateCallbackType) => StyleProp<ViewStyle>);
  /** Draw the ring inside the edge, for rows in a card that clips anything outside it. */
  ringInset?: boolean;
};

const ring: ViewStyle = { outlineStyle: "solid", outlineWidth: 2, outlineColor: colors.ink, outlineOffset: 2 };

// A Pressable that draws a clear ring while it has keyboard focus, which the browser's default 1px outline does not.
export function FocusPressable({ style, ringInset, onFocus, onBlur, ...rest }: Props) {
  const [focused, setFocused] = useState(false);
  return (
    <Pressable
      {...rest}
      onFocus={(event) => {
        setFocused(true);
        onFocus?.(event);
      }}
      onBlur={(event) => {
        setFocused(false);
        onBlur?.(event);
      }}
      style={(state) => [typeof style === "function" ? style(state) : style, focused && (ringInset ? { ...ring, outlineOffset: -2 } : ring)]}
    />
  );
}
