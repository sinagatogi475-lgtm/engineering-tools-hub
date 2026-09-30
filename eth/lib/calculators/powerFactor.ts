import { fail, ok, checkNum, type Result } from "./result";
export function calculatePowerFactor(x: { p?: number; s?: number }): Result {
  const e = checkNum(x.p, "Real power", "W") ?? checkNum(x.s, "Apparent power", "VA", "positive");
  if (e) return fail(e);
  const p = x.p as number, s = x.s as number;
  if (p > s) return fail("Real power cannot exceed apparent power (power factor cannot be above 1).");
  return ok([{ label: "Power factor", value: p / s, unit: "" }, { label: "Reactive power", value: Math.sqrt(Math.max(0, s * s - p * p)), unit: "var" }], "PF = P / S, Q = √(S² − P²)");
}
