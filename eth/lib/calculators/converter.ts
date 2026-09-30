import { fail, ok, type Result } from "./result";
export const UNITS: Record<string, Record<string, number>> = {
  length: { mm: 1e-3, cm: 1e-2, m: 1, km: 1e3, inch: 0.0254, ft: 0.3048 },
  area: { "mm²": 1e-6, "cm²": 1e-4, "m²": 1, "inch²": 0.00064516, "ft²": 0.09290304 },
  power: { W: 1, kW: 1e3, MW: 1e6, hp: 745.69987158227 },
  energy: { J: 1, kJ: 1e3, Wh: 3600, kWh: 3.6e6, MWh: 3.6e9 },
  voltage: { mV: 1e-3, V: 1, kV: 1e3 },
  current: { "μA": 1e-6, mA: 1e-3, A: 1 },
  resistance: { "Ω": 1, "kΩ": 1e3, "MΩ": 1e6 },
  frequency: { Hz: 1, kHz: 1e3, MHz: 1e6, GHz: 1e9 },
  temperature: { "°C": 1, "°F": 1, K: 1 },
};
const toK = (v: number, u: string) => (u === "°C" ? v + 273.15 : u === "°F" ? ((v - 32) * 5) / 9 + 273.15 : v);
const fromK = (k: number, u: string) => (u === "°C" ? k - 273.15 : u === "°F" ? ((k - 273.15) * 9) / 5 + 32 : k);
export function convert(category: string, value: number, from: string, to: string): Result {
  const table = UNITS[category];
  if (!table || !(from in table) || !(to in table)) return fail("Unknown unit.");
  if (!Number.isFinite(value)) return fail("Value must be a valid number.");
  if (category === "temperature") {
    const k = toK(value, from);
    if (k < 0) return fail("Temperature cannot be below absolute zero.");
    return ok([{ label: "Result", value: fromK(k, to), unit: to }], `${from} → K → ${to}`);
  }
  return ok([{ label: "Result", value: (value * table[from]) / table[to], unit: to }], `value × factor(${from}) / factor(${to})`);
}
