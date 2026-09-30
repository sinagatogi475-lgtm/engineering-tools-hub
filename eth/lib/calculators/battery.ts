import { fail, ok, checkNum, type Result } from "./result";
export function calculateBatteryRuntime(x: { voltage?: number; capacity?: number; unit: "Ah" | "Wh"; load?: number; efficiency?: number }): Result {
  const e = checkNum(x.capacity, "Capacity", x.unit, "positive") ?? checkNum(x.load, "Load power", "W", "positive") ?? (x.unit === "Ah" ? checkNum(x.voltage, "Battery voltage", "V", "positive") : null);
  if (e) return fail(e);
  if (x.efficiency === undefined || !Number.isFinite(x.efficiency) || x.efficiency <= 0 || x.efficiency > 100) return fail("Efficiency must be between 0 and 100 %.");
  const wh = x.unit === "Ah" ? (x.voltage as number) * (x.capacity as number) : (x.capacity as number);
  const h = (wh * (x.efficiency / 100)) / (x.load as number);
  return ok([{ label: "Runtime", value: h, unit: "h" }, { label: "Runtime", value: h * 60, unit: "min" }, { label: "Battery energy", value: wh, unit: "Wh" }], "Energy (Wh) = V × Ah; Runtime = Energy × Efficiency / Load");
}
