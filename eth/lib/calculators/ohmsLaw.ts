import { fail, ok, checkNum, clean, type Result } from "./result";
export interface OhmsInput { v?: number; i?: number; r?: number; p?: number }
const NAMES = { v: ["Voltage", "V"], i: ["Current", "A"], r: ["Resistance", "Ω"], p: ["Power", "W"] } as const;
export function calculateOhmsLaw(x: OhmsInput): Result {
  const keys = (["v", "i", "r", "p"] as const).filter((k) => x[k] !== undefined);
  if (keys.length !== 2) return fail("Enter exactly two values and leave the other two empty.");
  for (const k of keys) { const e = checkNum(x[k], NAMES[k][0], NAMES[k][1]); if (e) return fail(e); }
  const { v = 0, i = 0, r = 0, p = 0 } = x;
  let V = v, I = i, R = r, P = p;
  switch (keys.join("")) {
    case "vi": if (i <= 0) return fail("Current must be greater than 0 A to find resistance."); R = v / i; P = v * i; break;
    case "vr": if (r <= 0) return fail("Resistance must be greater than 0 Ω."); I = v / r; P = (v * v) / r; break;
    case "vp": if (v <= 0) return fail("Voltage must be greater than 0 V to use power."); I = p / v; R = (v * v) / p; if (p <= 0) return fail("Power must be greater than 0 W."); break;
    case "ir": V = i * r; P = i * i * r; break;
    case "ip": if (i <= 0) return fail("Current must be greater than 0 A."); V = p / i; R = p / (i * i); break;
    case "rp": if (r <= 0) return fail("Resistance must be greater than 0 Ω."); V = Math.sqrt(p * r); I = Math.sqrt(p / r); break;
  }
  return ok([{ label: "Voltage", value: clean(V), unit: "V" }, { label: "Current", value: clean(I), unit: "A" }, { label: "Resistance", value: clean(R), unit: "Ω" }, { label: "Power", value: clean(P), unit: "W" }], "V = I × R, I = V / R, R = V / I, P = V × I");
}
