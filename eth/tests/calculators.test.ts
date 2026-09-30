import { describe, it, expect } from "vitest";
import { calculateOhmsLaw } from "@/lib/calculators/ohmsLaw";
import { calculatePower } from "@/lib/calculators/power";
import { calculateVoltageDivider } from "@/lib/calculators/voltageDivider";
import { calculateThreePhase } from "@/lib/calculators/threePhase";
import { calculateBatteryRuntime } from "@/lib/calculators/battery";
import { calculateEnergyCost, formatRupiah } from "@/lib/calculators/energyCost";
import { calculatePowerFactor } from "@/lib/calculators/powerFactor";
import { convert } from "@/lib/calculators/converter";
import { decodeResistor } from "@/lib/calculators/resistor";
import type { Result } from "@/lib/calculators/result";
const val = (r: Result, label: string): number => { if (!r.ok) throw new Error(r.error); return r.lines.find((l) => l.label === label)!.value; };
describe("calculators", () => {
  it("ohm: V=12, I=2 -> R=6, P=24", () => { const r = calculateOhmsLaw({ v: 12, i: 2 }); expect(val(r, "Resistance")).toBe(6); expect(val(r, "Power")).toBe(24); });
  it("ohm: rejects zero denominator, one input, NaN", () => { expect(calculateOhmsLaw({ v: 12, i: 0 }).ok).toBe(false); expect(calculateOhmsLaw({ v: 12 }).ok).toBe(false); expect(calculateOhmsLaw({ v: NaN, i: 1 }).ok).toBe(false); });
  it("ohm: R and P", () => { const r = calculateOhmsLaw({ r: 4, p: 100 }); expect(val(r, "Current")).toBeCloseTo(5); expect(val(r, "Voltage")).toBeCloseTo(20); });
  it("power DC/AC/3ph", () => { expect(val(calculatePower({ mode: "dc", v: 12, i: 2 }), "Power")).toBe(24); expect(val(calculatePower({ mode: "ac1", v: 230, i: 10, pf: 0.8 }), "Power")).toBeCloseTo(1840); expect(calculatePower({ mode: "ac1", v: 230, i: 10, pf: 1.2 }).ok).toBe(false); });
  it("voltage divider", () => { expect(val(calculateVoltageDivider({ vin: 12, r1: 1000, r2: 1000 }), "Vout")).toBe(6); expect(calculateVoltageDivider({ vin: 12, r1: 0, r2: 0 }).ok).toBe(false); });
  it("three phase 400V 10A PF0.8", () => { const r = calculateThreePhase({ v: 400, i: 10, pf: 0.8 }); expect(val(r, "Active power (P)") / 1000).toBeCloseTo(5.54, 2); expect(val(calculateThreePhase({ v: 400, i: 10, pf: 1 }), "Reactive power")).toBe(0); });
  it("battery", () => { expect(val(calculateBatteryRuntime({ voltage: 12, capacity: 100, unit: "Ah", load: 100, efficiency: 90 }), "Runtime")).toBeCloseTo(10.8); expect(calculateBatteryRuntime({ voltage: 12, capacity: 100, unit: "Ah", load: 0, efficiency: 90 }).ok).toBe(false); expect(calculateBatteryRuntime({ voltage: 12, capacity: 100, unit: "Ah", load: 10, efficiency: 101 }).ok).toBe(false); });
  it("energy cost", () => { const r = calculateEnergyCost({ powerW: 100, qty: 1, hours: 10, days: 30, price: 1500 }); expect(val(r, "Monthly energy")).toBeCloseTo(30); expect(val(r, "Monthly cost")).toBeCloseTo(45000); expect(formatRupiah(125000).replace(/\s/g, " ")).toBe("Rp 125.000"); });
  it("power factor", () => { expect(val(calculatePowerFactor({ p: 800, s: 1000 }), "Power factor")).toBeCloseTo(0.8); expect(calculatePowerFactor({ p: 1200, s: 1000 }).ok).toBe(false); });
  it("converter", () => { expect(val(convert("length", 1, "inch", "mm"), "Result")).toBeCloseTo(25.4); expect(val(convert("energy", 1, "kWh", "J"), "Result")).toBeCloseTo(3.6e6); expect(val(convert("temperature", 100, "°C", "°F"), "Result")).toBeCloseTo(212); expect(convert("temperature", -300, "°C", "K").ok).toBe(false); });
  it("resistor", () => { expect(val(decodeResistor(["brown", "black", "red", "gold"]), "Resistance")).toBe(1000); expect(val(decodeResistor(["yellow", "violet", "black", "red", "brown"]), "Resistance")).toBe(4700); expect(decodeResistor(["gold", "black", "red", "gold"]).ok).toBe(false); });
});

import { describe, expect, it } from "vitest";
import { calculateElectricityBill, calculateSolarPanel, calculateSolarBattery, calculateVoltageDrop, calculateCableSize, calculateMotorCurrent, calculateTransformer, calculateGeneratorSizing, calculateAcConsumption, calculateWattToKwh } from "@/lib/calculators/additional";
describe("additional calculators",()=>{
 it("calculates electricity bill",()=>{const r=calculateElectricityBill({powerW:100,qty:1,hours:5,days:30,price:1444});expect(r.ok&&r.lines[1].value).toBe(15);});
 it("calculates solar capacity",()=>{const r=calculateSolarPanel({dailyKwh:5,peakSunHours:4,efficiency:80});expect(r.ok&&r.lines[0].value).toBeCloseTo(1.5625);});
 it("calculates battery capacity",()=>{const r=calculateSolarBattery({dailyKwh:5,autonomyDays:1,depthOfDischarge:80,efficiency:90});expect(r.ok&&r.lines[0].value).toBeCloseTo(6.9444,3);});
 it("calculates voltage drop",()=>{const r=calculateVoltageDrop({mode:"dc",voltage:12,current:5,length:10,resistance:5});expect(r.ok&&r.lines[0].value).toBeCloseTo(.5);});
 it("selects standard cable size",()=>{const r=calculateCableSize({current:10,length:20,voltage:230,maxDropPercent:3,material:"copper"});expect(r.ok&&r.lines[1].value).toBeGreaterThan(0);});
 it("calculates motor current",()=>{const r=calculateMotorCurrent({mode:"three",powerKw:5,voltage:400,pf:.85,efficiency:90});expect(r.ok&&r.lines[0].value).toBeCloseTo(9.43,1);});
 it("calculates transformer",()=>{const r=calculateTransformer({primaryV:230,secondaryV:24,apparentPowerKva:1});expect(r.ok&&r.lines[0].value).toBeCloseTo(9.5833,3);});
 it("calculates generator size",()=>{const r=calculateGeneratorSizing({loadKw:80,pf:.8,margin:20});expect(r.ok&&r.lines[0].value).toBeCloseTo(120);});
 it("calculates AC consumption",()=>{const r=calculateAcConsumption({inputPowerW:1000,hours:5,days:30,quantity:1});expect(r.ok&&r.lines[0].value).toBe(150);});
 it("calculates watt to kwh",()=>{const r=calculateWattToKwh({powerW:100,hours:5,days:30});expect(r.ok&&r.lines[0].value).toBe(15);});
});

import { convert } from "@/lib/calculators/converter";
import { decodeResistor } from "@/lib/calculators/resistor";
it("converts temperature through Kelvin",()=>{const r=convert("temperature",32,"°F","°C");expect(r.ok&&r.lines[0].value).toBeCloseTo(0);});
it("decodes a four-band resistor",()=>{const r=decodeResistor(["brown","black","red","gold"]);expect(r.ok&&r.lines[0].value).toBe(1000);});
