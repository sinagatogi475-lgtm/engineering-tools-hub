import { fail, type Result } from "./result";
export const COLORS = ["black", "brown", "red", "orange", "yellow", "green", "blue", "violet", "gray", "white", "gold", "silver"] as const;
const MULT: Record<string, number> = { black: 1, brown: 10, red: 100, orange: 1e3, yellow: 1e4, green: 1e5, blue: 1e6, violet: 1e7, gray: 1e8, white: 1e9, gold: 0.1, silver: 0.01 };
const TOL: Record<string, number> = { brown: 1, red: 2, green: 0.5, blue: 0.25, violet: 0.1, gray: 0.05, gold: 5, silver: 10 };
const TEMPCO: Record<string, number> = { black: 250, brown: 100, red: 50, orange: 15, yellow: 25, blue: 10, violet: 5 };
export function decodeResistor(bands: string[]): Result {
  const n = bands.length;
  if (n < 4 || n > 6) return fail("Use 4, 5 or 6 bands.");
  const nd = n === 4 ? 2 : 3;
  let digits = 0;
  for (let k = 0; k < nd; k++) { const d = COLORS.indexOf(bands[k] as (typeof COLORS)[number]); if (d < 0 || d > 9) return fail("Digit bands must be black through white."); digits = digits * 10 + d; }
  const m = MULT[bands[nd]], t = TOL[bands[nd + 1]];
  if (m === undefined) return fail("Invalid multiplier band.");
  if (t === undefined) return fail("Invalid tolerance band.");
  const lines = [{ label: "Resistance", value: digits * m, unit: "Ω" }, { label: "Tolerance", value: t, unit: "%" }];
  if (n === 6) { const tc = TEMPCO[bands[5]]; if (tc === undefined) return fail("Invalid temperature coefficient band."); lines.push({ label: "Temp. coefficient", value: tc, unit: "ppm/K" }); }
  return { ok: true, lines, formula: "Resistance = digits × multiplier" };
}
