import Svg, { Circle, Path } from "react-native-svg";

// Line icons on a 24 grid. The overview icon repeats the three flowing strokes of the FinOSA mark.
const PATHS = {
  overview: ["M4 7c4-3 8 3 16 0", "M4 12c4-3 8 3 16 0", "M4 17c4-3 8 3 16 0"],
  accounts: ["M4 8a3 3 0 0 1 3-3h10a3 3 0 0 1 3 3v8a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3z", "M4 9h16"],
  history: ["M9 7h11", "M9 12h11", "M9 17h11"],
  plus: ["M12 5v14", "M5 12h14"],
  check: ["M5 12.5l4.5 4.5L19 7"],
  close: ["M6 6l12 12", "M18 6L6 18"],
  "chevron-left": ["M14.5 6l-6 6 6 6"],
  "chevron-right": ["M9.5 6l6 6-6 6"],
} as const;

const DOTS: Partial<Record<IconName, [number, number][]>> = {
  accounts: [[16, 14]],
  history: [[5, 7], [5, 12], [5, 17]],
};

export type IconName = keyof typeof PATHS;

export function Icon({ name, size = 24, color }: { name: IconName; size?: number; color: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {PATHS[name].map((d) => (
        <Path key={d} d={d} stroke={color} strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" />
      ))}
      {DOTS[name]?.map(([cx, cy]) => <Circle key={`${cx}-${cy}`} cx={cx} cy={cy} r={1.1} fill={color} />)}
    </Svg>
  );
}
