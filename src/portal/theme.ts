export const portalColors = {
  primary: "#1b7240",
  primaryDark: "#145a31",
  heroFrom: "#0a3b23",
  heroTo: "#1e7a47",
  mint: "#eef7f1",
  mintBorder: "#cfe6d8",
  background: "#f2f7f4",
  text: "#0f172a",
  muted: "#64748b",
  border: "#e2e8f0",
  warn: "#b45309",
  warnBackground: "#fef3c7",
  warnBorder: "#fcd34d",
  white: "#fff",
} as const;

export const portalGradient = {
  colors: [portalColors.heroFrom, portalColors.heroTo],
  start: { x: 0, y: 0 },
  end: { x: 1, y: 1 },
} as const;
