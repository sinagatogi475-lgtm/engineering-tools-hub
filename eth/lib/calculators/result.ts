export interface Line { label: string; value: number; unit: string }
export type Result = { ok: true; lines: Line[]; formula: string } | { ok: false; error: string };
export const fail = (error: string): Result => ({ ok: false, error });
export const ok = (lines: Line[], formula: string): Result => {
  if (lines.some((l) => !Number.isFinite(l.value))) return fail("The result is out of range. Check your inputs.");
  return { ok: true, lines, formula };
};
export const clean = (n: number): number => (Math.abs(n) < 1e-12 ? 0 : n);
/** Returns an error message, or null when valid. */
export function checkNum(v: number | undefined, name: string, unit: string, min: "positive" | "nonneg" = "nonneg"): string | null {
  if (v === undefined || !Number.isFinite(v)) return `${name} must be a valid number.`;
  if (Math.abs(v) > 1e15) return `${name} has too many digits.`;
  if (min === "positive" && v <= 0) return `${name} must be greater than 0 ${unit}.`.trim();
  if (v < 0) return `${name} cannot be negative.`;
  return null;
}
