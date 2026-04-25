/**
 * Solar calculations service - business logic layer
 * Uses pure formula functions from solar-calculations.ts
 */

import {
  SOLAR_CONSTANTS,
  calculateMonthlyGeneration,
  calculateMonthlySavings,
  calculateAnnualSavings,
  calculatePaybackPeriod,
  calculateCO2Saved,
  calculateEMI,
  calculateSuggestedCapacity,
  calculateSolarSizing,
  calculateTotalCost,
} from '../lib/solar-calculations.js';

export interface SolarSizingResult {
  systemKw: number;
  panelCount: number;
  systemArea: number;
  panelWattage: number;
  panelAreaSqFt: number;
  wattagePerKw: number;
}

export interface CostCalculationResult {
  systemKw: number;
  baseCost: number;
  otherExpenses: number;
  profitMargin: number;
  totalCost: number;
  profitAmount: number;
  costWithMargin: number;
  gstAmount: number;
  finalPrice: number;
}

export interface ROIResult {
  monthlyGeneration: number;
  monthlySavings: number;
  annualSavings: number;
  systemCost: number;
  subsidyAmount: number;
  actualInvestment: number;
  paybackYears: number;
  paybackMonths: number;
  totalSavings: number;
  co2SavedPerYear: number;
  co2SavedOverLifetime: number;
}

export interface EMIResult {
  loanAmount: number;
  interestRate: number;
  termInYears: number;
  emi: number;
  totalPayable: number;
  totalInterest: number;
}

export interface SuggestCapacityResult {
  monthlyUnits: number[];
  avgMonthlyUnits: number;
  suggestedCapacityKw: number;
  monthlyGeneration: number;
  annualSavings: number;
  systemCost: number;
  paybackYears: number;
}

/**
 * Calculate solar system sizing (panels, area)
 */
export function calculateSystemSizing(
  systemKw: number,
  panelType: keyof typeof SOLAR_CONSTANTS.PANEL_WATTAGE
): SolarSizingResult {
  const sizing = calculateSolarSizing(systemKw, panelType);
  return {
    ...sizing,
    systemKw: sizing.systemKw,
    panelCount: sizing.panelCount,
    systemArea: sizing.systemArea,
    panelWattage: sizing.panelWattage,
    panelAreaSqFt: sizing.panelAreaSqFt,
    wattagePerKw: sizing.wattagePerKw,
  };
}

/**
 * Calculate total cost with profit margin and GST
 */
export function calculateSystemCost(
  systemKw: number,
  baseCost: number,
  otherExpenses: number = 0,
  profitMargin: number = SOLAR_CONSTANTS.DEFAULT_PROFIT_MARGIN,
  gstPercentage: number = 18
): CostCalculationResult {
  const costCalc = calculateTotalCost(baseCost, otherExpenses, profitMargin);
  const gstAmount = Math.round(costCalc.costWithMargin * gstPercentage / 100);
  const finalPrice = costCalc.costWithMargin + gstAmount;

  return {
    systemKw,
    baseCost,
    otherExpenses,
    profitMargin,
    totalCost: costCalc.totalCost,
    profitAmount: costCalc.profitAmount,
    costWithMargin: costCalc.costWithMargin,
    gstAmount,
    finalPrice,
  };
}

/**
 * Calculate full ROI including savings, payback, and CO2
 */
export function calculateSystemROI(
  systemCost: number,
  subsidyAmount: number = SOLAR_CONSTANTS.DEFAULT_SUBSIDY,
  monthlyGeneration?: number,
  unitRate: number = SOLAR_CONSTANTS.DEFAULT_UNIT_RATE,
  systemKw?: number
): ROIResult {
  // Calculate generation if not provided
  const generation = monthlyGeneration ?? (systemKw
    ? calculateMonthlyGeneration(systemKw)
    : 0);

  const monthlySavings = calculateMonthlySavings(generation, unitRate);
  const annualSavings = calculateAnnualSavings(monthlySavings);
  const payback = calculatePaybackPeriod(systemCost, subsidyAmount, annualSavings);
  const co2PerYear = systemKw
    ? calculateCO2Saved(systemKw)
    : 0;

  return {
    monthlyGeneration: generation,
    monthlySavings,
    annualSavings,
    systemCost,
    subsidyAmount,
    actualInvestment: systemCost - subsidyAmount,
    paybackYears: payback.years,
    paybackMonths: payback.months,
    totalSavings: annualSavings * SOLAR_CONSTANTS.PANEL_LIFE_YEARS,
    co2SavedPerYear: co2PerYear,
    co2SavedOverLifetime: co2PerYear * SOLAR_CONSTANTS.PANEL_LIFE_YEARS,
  };
}

/**
 * Calculate EMI for solar loan
 */
export function calculateLoanEMI(
  loanAmount: number,
  interestRate: number,
  termInYears: number
): EMIResult {
  const emiCalc = calculateEMI(loanAmount, interestRate, termInYears);

  return {
    loanAmount,
    interestRate,
    termInYears,
    emi: emiCalc.emi,
    totalPayable: emiCalc.totalPayable,
    totalInterest: emiCalc.totalInterest,
  };
}

/**
 * Suggest capacity from bill data with full calculation
 */
export function suggestSystemCapacity(
  monthlyUnits: number[],
  unitRate: number = SOLAR_CONSTANTS.DEFAULT_UNIT_RATE
): SuggestCapacityResult {
  const { avgMonthlyUnits, suggestedCapacityKw } = calculateSuggestedCapacity(monthlyUnits);
  const monthlyGeneration = calculateMonthlyGeneration(suggestedCapacityKw);
  const annualSavings = calculateAnnualSavings(
    calculateMonthlySavings(monthlyGeneration, unitRate)
  );
  const systemCost = suggestedCapacityKw * 60000; // Estimate ~60k per kW
  const payback = calculatePaybackPeriod(systemCost, SOLAR_CONSTANTS.DEFAULT_SUBSIDY, annualSavings);

  return {
    monthlyUnits,
    avgMonthlyUnits,
    suggestedCapacityKw,
    monthlyGeneration,
    annualSavings,
    systemCost,
    paybackYears: payback.years,
  };
}
