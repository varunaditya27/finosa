import { Text, type TextProps } from "react-native";
import { colors, tabular, type } from "@/theme";

type Props = TextProps & {
  variant?: keyof typeof type;
  color?: string;
  numeric?: boolean;
};

export function AppText({ variant = "body", color = colors.ink, numeric, style, ...rest }: Props) {
  return <Text style={[type[variant], { color }, numeric && tabular, style]} {...rest} />;
}
