/**
 * Solar calculation formulas - pure functions for backend API
 * All formulas from magicpath migrated to service layer
 */

export const SOLAR_CONSTANTS = {
  PEAK_SUN_HOURS: 4.5,
  PERFORMANCE_RATIO: 0.75,
  DAYS_PER_MONTH: 30,
  DAYS_PER_YEAR: 365,
  CO2_FACTOR_KG_PER_KWH: 0.71,
  PANEL_LIFE_YEARS: 25,
  DEFAULT_SUBSIDY: 78000,
  DEFAULT_PROFIT_MARGIN: 20,
  DEFAULT_UNIT_RATE: 10,
  PANEL_WATTAGE: {
    'mono-standard': 550,
    'mono-large': 585,
    'topcon': 590,
  },
  PANEL_AREA_SQFT: {
    'mono-standard': 17.8,
    'mono-large': 23.7,
    'topcon': 27.6,
  },
} as const;

/**
 * Calculate monthly energy generation in kWh
 * Formula: systemKw * peakSunHours * days * performanceRatio
 */
export function calculateMonthlyGeneration(
  systemKw: number,
  peakSunHours: number = SOLAR_CONSTANTS.PEAK_SUN_HOURS,
  days: number = SOLAR_CONSTANTS.DAYS_PER_MONTH,
  performanceRatio: number = SOLAR_CONSTANTS.PERFORMANCE_RATIO
): number {
  if (systemKw <= 0 || peakSunHours <= 0 || days <= 0 || performanceRatio <= 0) {
    return 0;
  }
  return Math.round(systemKw * peakSunHours * days * performanceRatio);
}

/**
 * Calculate monthly savings in INR
 * Formula: monthlyGeneration * unitRate
 */
export function calculateMonthlySavings(monthlyGeneration: number, unitRate: number): number {
  if (monthlyGeneration <= 0 || unitRate <= 0) {
    return 0;
  }
  return Math.round(monthlyGeneration * unitRate);
}

/**
 * Calculate annual savings in INR
 * Formula: monthlySavings * 12
 */
export function calculateAnnualSavings(monthlySavings: number): number {
  if (monthlySavings <= 0) {
    return 0;
  }
  return monthlySavings * 12;
}

/**
 * Calculate payback period in months
 * Formula: (systemCost - subsidy) / annualSavings * 12
 */
export function calculatePaybackMonths(
  systemCost: number,
  subsidy: number,
  annualSavings: number
): number {
  if (annualSavings <= 0) {
    return 0;
  }
  const actualInvestment = systemCost - subsidy;
  if (actualInvestment <= 0) {
    return 0;
  }
  return Math.round((actualInvestment / annualSavings) * 12);
}

/**
 * Calculate payback period in years and months
 */
export function calculatePaybackPeriod(
  systemCost: number,
  subsidy: number,
  annualSavings: number
): { years: number; months: number; totalMonths: number } {
  const totalMonths = calculatePaybackMonths(systemCost, subsidy, annualSavings);
  return {
    totalMonths,
    years: Math.floor(totalMonths / 12),
    months: Math.round(totalMonths % 12),
  };
}

/**
 * Calculate CO2 saved per year in tonnes
 * Formula: capacityKw * peakSunHours * pr * daysPerYear * co2Factor / 1000
 */
export function calculateCO2Saved(
  capacityKw: number,
  peakSunHours: number = SOLAR_CONSTANTS.PEAK_SUN_HOURS,
  performanceRatio: number = SOLAR_CONSTANTS.PERFORMANCE_RATIO,
  daysPerYear: number = SOLAR_CONSTANTS.DAYS_PER_YEAR,
  co2Factor: number = SOLAR_CONSTANTS.CO2_FACTOR_KG_PER_KWH
): number {
  if (capacityKw <= 0 || peakSunHours <= 0 || performanceRatio <= 0) {
    return 0;
  }
  const kgSaved = capacityKw * peakSunHours * performanceRatio * daysPerYear * co2Factor;
  return Math.round(kgSaved / 10) / 100; // Convert to tonnes with 2 decimal places
}

/**
 * Calculate EMI (Equated Monthly Installment)
 * Formula: P * r * (1+r)^n / ((1+r)^n - 1)
 * Where: P = principal, r = monthly rate, n = number of months
 */
export function calculateEMI(principal: number, annualRate: number, years: number): {
  emi: number;
  totalPayable: number;
  totalInterest: number;
} {
  if (principal <= 0 || years <= 0) {
    return { emi: 0, totalPayable: 0, totalInterest: 0 };
  }

  const monthlyRate = annualRate / 100 / 12;
  const months = years * 12;

  let emi: number;
  if (monthlyRate <= 0) {
    // Zero interest - simple division
    emi = principal / months;
  } else {
    emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) /
          (Math.pow(1 + monthlyRate, months) - 1);
  }

  const totalPayable = Math.round(emi * months);
  const totalInterest = totalPayable - principal;

  return {
    emi: Math.round(emi),
    totalPayable,
    totalInterest,
  };
}

/**
 * Calculate suggested solar capacity from monthly bill units
 * Formula: avgMonthlyUnits / (daysPerMonth * peakSunHours)
 */
export function calculateSuggestedCapacity(
  monthlyUnits: number[],
  peakSunHours: number = SOLAR_CONSTANTS.PEAK_SUN_HOURS,
  daysPerMonth: number = SOLAR_CONSTANTS.DAYS_PER_MONTH
): { avgMonthlyUnits: number; suggestedCapacityKw: number } {
  if (!monthlyUnits || monthlyUnits.length === 0) {
    return { avgMonthlyUnits: 0, suggestedCapacityKw: 0 };
  }

  const validUnits = monthlyUnits.filter(u => u >= 0);
  if (validUnits.length === 0) {
    return { avgMonthlyUnits: 0, suggestedCapacityKw: 0 };
  }

  const avgMonthlyUnits = Math.round(
    validUnits.reduce((sum, u) => sum + u, 0) / validUnits.length
  );

  if (peakSunHours <= 0 || daysPerMonth <= 0) {
    return { avgMonthlyUnits, suggestedCapacityKw: 0 };
  }

  const suggestedCapacityKw = Math.ceil(
    avgMonthlyUnits / (daysPerMonth * peakSunHours) * 10
  ) / 10; // Round up to 1 decimal

  return { avgMonthlyUnits, suggestedCapacityKw };
}

/**
 * Calculate number of panels required
 * Formula: ceil(systemKw * 1000 / panelWattage)
 */
export function calculatePanelCount(
  systemKw: number,
  panelWattage: number
): number {
  if (systemKw <= 0 || panelWattage <= 0) {
    return 0;
  }
  return Math.ceil((systemKw * 1000) / panelWattage);
}

/**
 * Calculate total system area requirement
 * Formula: panelCount * panelAreaSqFt
 */
export function calculateSystemArea(
  panelCount: number,
  panelAreaSqFt: number
): number {
  if (panelCount <= 0 || panelAreaSqFt <= 0) {
    return 0;
  }
  return Math.round(panelCount * panelAreaSqFt * 10) / 10;
}

/**
 * Calculate total system cost with profit margin
 * Formula: (baseCost + otherExpenses) * (1 + profitMargin / 100)
 */
export function calculateTotalCost(
  baseCost: number,
  otherExpenses: number,
  profitMargin: number = SOLAR_CONSTANTS.DEFAULT_PROFIT_MARGIN
): { totalCost: number; profitAmount: number; costWithMargin: number } {
  if (baseCost < 0 || otherExpenses < 0) {
    return { totalCost: 0, profitAmount: 0, costWithMargin: 0 };
  }

  const totalCost = baseCost + otherExpenses;
  const profitAmount = Math.round(totalCost * profitMargin / 100);
  const costWithMargin = totalCost + profitAmount;

  return { totalCost, profitAmount, costWithMargin };
}

/**
 * Calculate panel requirements for a solar system
 */
export function calculateSolarSizing(
  systemKw: number,
  panelType: keyof typeof SOLAR_CONSTANTS.PANEL_WATTAGE
): {
  systemKw: number;
  panelCount: number;
  systemArea: number;
  panelWattage: number;
  panelAreaSqFt: number;
  wattagePerKw: number;
} {
  if (systemKw <= 0) {
    return {
      systemKw: 0,
      panelCount: 0,
      systemArea: 0,
      panelWattage: 0,
      panelAreaSqFt: 0,
      wattagePerKw: 0,
    };
  }

  const panelWattage = SOLAR_CONSTANTS.PANEL_WATTAGE[panelType];
  const panelAreaSqFt = SOLAR_CONSTANTS.PANEL_AREA_SQFT[panelType];
  const panelCount = calculatePanelCount(systemKw, panelWattage);
  const systemArea = calculateSystemArea(panelCount, panelAreaSqFt);

  return {
    systemKw,
    panelCount,
    systemArea,
    panelWattage,
    panelAreaSqFt,
    wattagePerKw: Math.round((panelCount * panelWattage / systemKw) * 10) / 10,
  };
}
