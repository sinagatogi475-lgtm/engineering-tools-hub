import { fail, ok, checkNum, type Result } from "./result";
export type PowerMode = "dc" | "ac1" | "ac3";
export function calculatePower(x: { mode: PowerMode; v?: number; i?: number; pf?: number }): Result {
  const e = checkNum(x.v, "Voltage", "V") ?? checkNum(x.i, "Current", "A");
  if (e) return fail(e);
  let pf = 1;
  if (x.mode !== "dc") {
    if (x.pf === undefined || !Number.isFinite(x.pf) || x.pf <= 0 || x.pf > 1) return fail("Power factor must be greater than 0 and at most 1.");
    pf = x.pf;
  }
  const v = x.v as number, i = x.i as number;
  const k = x.mode === "ac3" ? Math.sqrt(3) : 1;
  const formula = x.mode === "dc" ? "P = V × I" : x.mode === "ac1" ? "P = V × I × PF" : "P = √3 × V × I × PF";
  return ok([{ label: "Power", value: k * v * i * pf, unit: "W" }], formula);
}
