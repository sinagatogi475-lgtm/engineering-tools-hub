import { fail, ok, checkNum, type Result } from "./result";
export function calculateThreePhase(x: { v?: number; i?: number; pf?: number }): Result {
  const e = checkNum(x.v, "Line voltage", "V") ?? checkNum(x.i, "Current", "A");
  if (e) return fail(e);
  if (x.pf === undefined || !Number.isFinite(x.pf) || x.pf <= 0 || x.pf > 1) return fail("Power factor must be greater than 0 and at most 1.");
  const s = Math.sqrt(3) * (x.v as number) * (x.i as number);
  const p = s * x.pf;
  const q = Math.sqrt(Math.max(0, s * s - p * p));
  return ok([{ label: "Active power (P)", value: p, unit: "W" }, { label: "Apparent power (S)", value: s, unit: "VA" }, { label: "Reactive power (Q)", value: q, unit: "var" }], "S = √3 × V × I, P = S × PF, Q = √(S² − P²)");
}
