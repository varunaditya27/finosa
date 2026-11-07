import type { TextStyle } from "react-native";

export const colors = {
  ink: "#143C3A",
  jade: "#1C827A",
  jadeBright: "#29A79C",
  mint: "#DDEFE8",
  porcelain: "#F8F6EF",
  citrus: "#E3B84E",
  muted: "#546C68",
  hairline: "#DBE6E1",
  surface: "#FFFFFF",
  positive: "#16675B",
  attention: "#B06B1E",
  negative: "#A6443B",
} as const;

export const spacing = { xs: 4, sm: 8, md: 16, lg: 24, xl: 32 } as const;

export const radius = { control: 10, card: 16, pill: 999 } as const;

export const fonts = {
  headline: "Petrona_600SemiBold",
  headlineMedium: "Petrona_500Medium",
  regular: "FamiljenGrotesk_400Regular",
  medium: "FamiljenGrotesk_500Medium",
  semibold: "FamiljenGrotesk_600SemiBold",
  bold: "FamiljenGrotesk_700Bold",
} as const;

// Weights live in the font family name because each weight is a separate font file.
export const type = {
  display: { fontFamily: fonts.headline, fontSize: 40, lineHeight: 48 },
  title: { fontFamily: fonts.headline, fontSize: 28, lineHeight: 34 },
  heading: { fontFamily: fonts.headline, fontSize: 20, lineHeight: 26 },
  body: { fontFamily: fonts.regular, fontSize: 16, lineHeight: 22 },
  bodyStrong: { fontFamily: fonts.medium, fontSize: 16, lineHeight: 22 },
  label: { fontFamily: fonts.semibold, fontSize: 14, lineHeight: 18 },
  caption: { fontFamily: fonts.regular, fontSize: 13, lineHeight: 18 },
} as const satisfies Record<string, TextStyle>;

export const tabular: TextStyle = { fontVariant: ["tabular-nums"] };

export const minTouch = 48;
