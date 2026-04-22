import { PanelType, PANEL_TYPES } from "@/types/quotation-form";

// Peak sun hours and performance ratio constants
const PEAK_SUN_HOURS = 4.5;
const PERFORMANCE_RATIO = 0.75;
const DAYS_PER_MONTH = 30;
const CO2_FACTOR_KG_PER_KWH = 0.71; // kg CO2 per kWh
const PANEL_LIFE_YEARS = 25;
const DEFAULT_SUBSIDY = 78000;

// Calculate monthly generation: P × 4.5 × 0.75 × 30
export function calculateMonthlyGeneration(systemKw: number): number {
  if (systemKw <= 0) return 0;
  return Math.round(systemKw * PEAK_SUN_HOURS * DAYS_PER_MONTH * PERFORMANCE_RATIO);
}

// Calculate monthly savings
export function calculateMonthlySavings(
  monthlyGeneration: number,
  unitRate: number
): number {
  return Math.round(monthlyGeneration * unitRate);
}

// Calculate annual savings
export function calculateAnnualSavings(monthlySavings: number): number {
  return monthlySavings * 12;
}

// Calculate payback period in months
export function calculatePaybackMonths(
  totalInvestment: number,
  annualSavings: number
): number {
  if (annualSavings <= 0) return 0;
  return (totalInvestment / annualSavings) * 12;
}

// Calculate ROI metrics
export function calculateROI(
  systemKw: number,
  systemCost: number,
  unitRate: number,
  subsidyAmount: number = DEFAULT_SUBSIDY
) {
  const monthlyGeneration = calculateMonthlyGeneration(systemKw);
  const monthlySavings = calculateMonthlySavings(monthlyGeneration, unitRate);
  const annualSavings = calculateAnnualSavings(monthlySavings);

  const actualInvestment = systemCost - subsidyAmount;
  const paybackTotalMonths = calculatePaybackMonths(actualInvestment, annualSavings);

  const paybackYears = Math.floor(paybackTotalMonths / 12);
  const paybackMonths = Math.round(paybackTotalMonths % 12);

  const totalSystemLifeMonths = PANEL_LIFE_YEARS * 12;
  const freeMonthsTotal = totalSystemLifeMonths - paybackTotalMonths;
  const freeYears = Math.max(0, Math.floor(freeMonthsTotal / 12));
  const freeMonths = Math.max(0, Math.round(freeMonthsTotal % 12));

  const totalSavings = Math.max(0, Math.round(annualSavings * PANEL_LIFE_YEARS));

  return {
    monthlyGeneration,
    monthlySavings,
    annualSavings,
    actualInvestment,
    paybackYears,
    paybackMonths,
    freeYears,
    freeMonths,
    totalSavings,
  };
}

// Calculate number of panels
export function calculateNumPanels(
  systemKw: number,
  panelType: PanelType
): number {
  if (systemKw <= 0) return 0;
  const panel = PANEL_TYPES.find((p) => p.id === panelType) || PANEL_TYPES[0];
  return Math.ceil((systemKw * 1000) / panel.wattage);
}

// Calculate system area required
export function calculateSystemArea(
  numPanels: number,
  panelType: PanelType
): number {
  if (numPanels <= 0) return 0;
  const panel = PANEL_TYPES.find((p) => p.id === panelType) || PANEL_TYPES[0];
  return Math.ceil(numPanels * panel.areaSqFt);
}

// Calculate available area (50% of total)
export function calculateAvailableArea(totalArea: number): number {
  return Math.round(totalArea * 0.5);
}

// Calculate shortfall
export function calculateShortfall(
  availableArea: number,
  systemArea: number
): number {
  return Math.max(0, systemArea - availableArea);
}

// Calculate carbon footprint saved (tonnes CO2 per year)
export function calculateCO2Saved(systemKw: number): string {
  if (systemKw <= 0) return "0";
  const kwhPerYear = systemKw * PEAK_SUN_HOURS * 365 * PERFORMANCE_RATIO;
  const kgPerYear = kwhPerYear * CO2_FACTOR_KG_PER_KWH;
  const tonnesPerYear = kgPerYear / 1000;
  return tonnesPerYear.toFixed(2);
}

// Get allowed phase options based on sanction load
export function getAllowedPhases(
  sanctionLoad: string
): Array<"1-Phase" | "3-Phase"> {
  const load = parseInt(sanctionLoad) || 0;
  if (load >= 1 && load <= 4) return ["1-Phase"];
  if (load >= 5 && load <= 8) return ["1-Phase", "3-Phase"];
  if (load >= 9 && load <= 10) return ["3-Phase"];
  return ["1-Phase", "3-Phase"];
}

// Format currency in INR
export function formatINR(value: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}

// Calculate EMI for loan
export function calculateEMI(
  principal: number,
  annualRate: number,
  years: number
): number {
  if (principal <= 0) return 0;
  const monthlyRate = annualRate / 100 / 12;
  const months = years * 12;
  if (monthlyRate <= 0) return principal / months;

  const emi =
    (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) /
    (Math.pow(1 + monthlyRate, months) - 1);
  return Math.round(emi);
}

// Calculate total loan payable
export function calculateLoanPayable(emi: number, months: number): number {
  return emi * months;
}