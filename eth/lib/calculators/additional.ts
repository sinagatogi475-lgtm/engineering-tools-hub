import { fail, ok, type Result, checkNum } from "./result";

const positive = (v: number | undefined, name: string, unit: string) => checkNum(v, name, unit, "positive");

export function calculateElectricityBill(input: {
  powerW?: number; qty?: number; hours?: number; days?: number; price?: number;
}): Result {
  const checks = [
    positive(input.powerW, "Device power", "W"),
    positive(input.qty, "Quantity", ""),
    positive(input.hours, "Hours per day", "h"),
    positive(input.days, "Days per month", "days"),
    positive(input.price, "Electricity price", "Rp/kWh"),
  ];
  const err = checks.find(Boolean); if (err) return fail(err!);
  const dailyKwh = (input.powerW! * input.qty! * input.hours!) / 1000;
  const monthlyKwh = dailyKwh * input.days!;
  const monthlyCost = monthlyKwh * input.price!;
  return ok([
    {label:"Daily energy", value:dailyKwh, unit:"kWh"},
    {label:"Monthly energy", value:monthlyKwh, unit:"kWh"},
    {label:"Monthly estimated cost", value:monthlyCost, unit:"Rp"},
    {label:"Yearly estimated cost", value:monthlyCost * 12, unit:"Rp"},
  ], "Energy = Power(kW) × Quantity × Hours × Days; Cost = Energy × Price");
}

export function calculateSolarPanel(input: {
  dailyKwh?: number; peakSunHours?: number; efficiency?: number;
}): Result {
  const err = positive(input.dailyKwh, "Daily energy", "kWh") || positive(input.peakSunHours, "Peak sun hours", "h");
  if (err) return fail(err);
  if (input.efficiency === undefined || !Number.isFinite(input.efficiency) || input.efficiency <= 0 || input.efficiency > 100)
    return fail("System efficiency must be greater than 0% and no more than 100%.");
  const capacityKw = input.dailyKwh! / (input.peakSunHours! * (input.efficiency / 100));
  const generation = capacityKw * input.peakSunHours! * (input.efficiency / 100);
  return ok([
    {label:"Required solar capacity", value:capacityKw, unit:"kWp"},
    {label:"Estimated daily generation", value:generation, unit:"kWh/day"},
  ], "Solar capacity = Daily energy ÷ (Peak sun hours × System efficiency)");
}

export function calculateSolarBattery(input: {
  dailyKwh?: number; autonomyDays?: number; depthOfDischarge?: number; efficiency?: number;
}): Result {
  const err = positive(input.dailyKwh, "Daily energy", "kWh") || positive(input.autonomyDays, "Autonomy", "days");
  if (err) return fail(err);
  if (input.depthOfDischarge === undefined || input.depthOfDischarge <= 0 || input.depthOfDischarge > 100)
    return fail("Depth of discharge must be greater than 0% and no more than 100%.");
  if (input.efficiency === undefined || input.efficiency <= 0 || input.efficiency > 100)
    return fail("System efficiency must be greater than 0% and no more than 100%.");
  const usable = (input.depthOfDischarge / 100) * (input.efficiency / 100);
  const capacity = (input.dailyKwh! * input.autonomyDays!) / usable;
  return ok([{label:"Estimated battery capacity", value:capacity, unit:"kWh"}],
    "Battery capacity = Daily energy × Autonomy days ÷ (DoD × Efficiency)");
}

export function calculateVoltageDrop(input: {
  mode?: "dc"|"ac1"; voltage?: number; current?: number; length?: number; resistance?: number;
}): Result {
  const err = positive(input.voltage, "Voltage", "V") || positive(input.current, "Current", "A") ||
    positive(input.length, "Cable length", "m") || positive(input.resistance, "Cable resistance", "Ω/km");
  if (err) return fail(err);
  const multiplier = input.mode === "ac1" ? 2 : 2;
  const drop = input.current! * input.resistance! * (input.length! * multiplier / 1000);
  const percent = (drop / input.voltage!) * 100;
  return ok([
    {label:"Voltage drop", value:drop, unit:"V"},
    {label:"Voltage drop", value:percent, unit:"%"},
    {label:"Voltage at load", value:input.voltage! - drop, unit:"V"},
  ], "Vdrop = I × R(Ω/km) × loop length(km); Vload = Vsupply − Vdrop");
}

const COPPER_RESISTIVITY = 0.0175; // Ω·mm²/m at approximately 20°C
const STANDARD_MM2 = [0.5,0.75,1,1.5,2.5,4,6,10,16,25,35,50,70,95,120,150,185,240,300,400,500,630];

export function calculateCableSize(input: {
  current?: number; length?: number; voltage?: number; maxDropPercent?: number; material?: "copper"|"aluminum";
}): Result {
  const err = positive(input.current, "Current", "A") || positive(input.length, "One-way cable length", "m") ||
    positive(input.voltage, "Voltage", "V") || positive(input.maxDropPercent, "Maximum voltage drop", "%");
  if (err) return fail(err);
  if (input.maxDropPercent! >= 100) return fail("Maximum voltage drop must be below 100%.");
  const rho = input.material === "aluminum" ? 0.0282 : COPPER_RESISTIVITY;
  const required = (2 * input.length! * input.current! * rho) / (input.voltage! * input.maxDropPercent! / 100);
  const standard = STANDARD_MM2.find(x => x >= required) ?? STANDARD_MM2[STANDARD_MM2.length-1];
  return ok([
    {label:"Minimum calculated cross-section", value:required, unit:"mm²"},
    {label:"Next standard size", value:standard, unit:"mm²"},
    {label:"Estimated voltage drop at standard size", value:(2 * input.length! * input.current! * rho / standard), unit:"V"},
  ], "A = 2 × L × I × ρ ÷ Vdrop; uses a voltage-drop criterion and a standard-size lookup");
}

export function calculateMotorCurrent(input: {
  mode?: "single"|"three"; powerKw?: number; voltage?: number; pf?: number; efficiency?: number;
}): Result {
  const err = positive(input.powerKw, "Motor output power", "kW") || positive(input.voltage, "Voltage", "V");
  if (err) return fail(err);
  if (input.pf === undefined || input.pf <= 0 || input.pf > 1) return fail("Power factor must be greater than 0 and no more than 1.");
  if (input.efficiency === undefined || input.efficiency <= 0 || input.efficiency > 100) return fail("Efficiency must be greater than 0% and no more than 100%.");
  const eta = input.efficiency / 100;
  const current = input.mode === "single"
    ? (input.powerKw! * 1000) / (input.voltage! * input.pf! * eta)
    : (input.powerKw! * 1000) / (Math.sqrt(3) * input.voltage! * input.pf! * eta);
  return ok([{label:"Estimated full-load current", value:current, unit:"A"}],
    input.mode === "single" ? "I = P ÷ (V × PF × η)" : "I = P ÷ (√3 × V × PF × η)");
}

export function calculateTransformer(input: {
  primaryV?: number; secondaryV?: number; turnsPrimary?: number; turnsSecondary?: number; apparentPowerKva?: number;
}): Result {
  const err = positive(input.primaryV, "Primary voltage", "V") || positive(input.secondaryV, "Secondary voltage", "V");
  if (err) return fail(err);
  const lines = [{label:"Voltage ratio (Vp/Vs)", value:input.primaryV!/input.secondaryV!, unit:"ratio"}];
  if (input.turnsPrimary !== undefined && input.turnsSecondary !== undefined) {
    if (input.turnsPrimary <= 0 || input.turnsSecondary <= 0) return fail("Turns must be greater than 0.");
    lines.push({label:"Turns ratio (Np/Ns)", value:input.turnsPrimary/input.turnsSecondary, unit:"ratio"});
  }
  if (input.apparentPowerKva !== undefined) {
    if (input.apparentPowerKva <= 0) return fail("Apparent power must be greater than 0 kVA.");
    lines.push({label:"Estimated primary current", value:(input.apparentPowerKva*1000)/input.primaryV!, unit:"A"});
    lines.push({label:"Estimated secondary current", value:(input.apparentPowerKva*1000)/input.secondaryV!, unit:"A"});
  }
  return ok(lines, "Ideal transformer: Vp/Vs ≈ Np/Ns; I = S/V");
}

export function calculateGeneratorSizing(input: {
  loadKw?: number; pf?: number; margin?: number;
}): Result {
  const err = positive(input.loadKw, "Load", "kW");
  if (err) return fail(err);
  if (input.pf === undefined || input.pf <= 0 || input.pf > 1) return fail("Power factor must be greater than 0 and no more than 1.");
  if (input.margin === undefined || input.margin < 0 || input.margin > 100) return fail("Safety margin must be between 0% and 100%.");
  const kva = (input.loadKw! / input.pf!) * (1 + input.margin!/100);
  return ok([{label:"Estimated generator rating", value:kva, unit:"kVA"}],
    "Generator kVA = Load kW ÷ Power factor × (1 + margin)");
}

export function calculateAcConsumption(input: {
  inputPowerW?: number; hours?: number; days?: number; quantity?: number;
}): Result {
  const err = positive(input.inputPowerW, "Input power", "W") || positive(input.hours, "Hours per day", "h") ||
    positive(input.days, "Days", "days") || positive(input.quantity, "Quantity", "");
  if (err) return fail(err);
  const monthly = input.inputPowerW! * input.hours! * input.days! * input.quantity! / 1000;
  return ok([{label:"Estimated monthly energy", value:monthly, unit:"kWh"}],
    "Energy = Input power(kW) × Hours/day × Days × Quantity");
}

export function calculateWattToKwh(input: { powerW?: number; hours?: number; days?: number }): Result {
  const err = positive(input.powerW, "Power", "W") || positive(input.hours, "Hours", "h") || positive(input.days, "Days", "days");
  if (err) return fail(err);
  const kwh = input.powerW! * input.hours! * input.days! / 1000;
  return ok([{label:"Energy", value:kwh, unit:"kWh"}], "Energy(kWh) = Power(W) × Hours × Days ÷ 1000");
}
