import { fail, ok, checkNum, type Result } from "./result";
export function calculateEnergyCost(x: { powerW?: number; qty?: number; hours?: number; days?: number; price?: number }): Result {
  const e = checkNum(x.powerW, "Device power", "W") ?? checkNum(x.qty, "Quantity", "", "positive") ?? checkNum(x.hours, "Hours per day", "h") ?? checkNum(x.days, "Days per month", "") ?? checkNum(x.price, "Electricity price", "Rp/kWh");
  if (e) return fail(e);
  if ((x.hours as number) > 24) return fail("Hours per day cannot exceed 24.");
  if ((x.days as number) > 31) return fail("Days per month cannot exceed 31.");
  const daily = ((x.powerW as number) / 1000) * (x.hours as number) * (x.qty as number);
  const monthly = daily * (x.days as number);
  const price = x.price as number;
  return ok([{ label: "Monthly cost", value: monthly * price, unit: "Rp" }, { label: "Daily energy", value: daily, unit: "kWh" }, { label: "Monthly energy", value: monthly, unit: "kWh" }, { label: "Yearly energy", value: monthly * 12, unit: "kWh" }, { label: "Yearly cost", value: monthly * 12 * price, unit: "Rp" }], "Energy = P(kW) × Hours × Days × Quantity; Cost = Energy × Price");
}
export const formatRupiah = (n: number): string => "Rp " + new Intl.NumberFormat("id-ID", { maximumFractionDigits: 0 }).format(n);
