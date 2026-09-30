import { fail, ok, checkNum, type Result } from "./result";
export function calculateVoltageDivider(x: { vin?: number; r1?: number; r2?: number }): Result {
  const e = checkNum(x.vin, "Vin", "V") ?? checkNum(x.r1, "R1", "Ω", "positive") ?? checkNum(x.r2, "R2", "Ω", "positive");
  if (e) return fail(e);
  const vin = x.vin as number, r1 = x.r1 as number, r2 = x.r2 as number;
  const rt = r1 + r2;
  return ok([{ label: "Vout", value: (vin * r2) / rt, unit: "V" }, { label: "Current", value: vin / rt, unit: "A" }, { label: "Total resistance", value: rt, unit: "Ω" }], "Vout = Vin × R2 / (R1 + R2)");
}
