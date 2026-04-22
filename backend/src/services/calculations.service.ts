// Solar calculation constants
const PEAK_SUN_HOURS = 4.5;
const PERFORMANCE_RATIO = 0.75;
const DAYS_PER_MONTH = 30;
const CO2_FACTOR_KG_PER_KWH = 0.71;
const PANEL_LIFE_YEARS = 25;
const DEFAULT_SUBSIDY = 78000;

const PANEL_WATTAGE: Record<string, number> = {
  'mono-standard': 540,
  'mono-large': 585,
  'topcon': 590,
};

const PANEL_AREA: Record<string, number> = {
  'mono-standard': 22,
  'mono-large': 24,
  'topcon': 22,
};

export function calculateSolarMetrics(
  systemKw: number,
  _panelType: string,
  unitRate: number
) {
  const monthlyGeneration = Math.round(systemKw * PEAK_SUN_HOURS * DAYS_PER_MONTH * PERFORMANCE_RATIO);
  const monthlySavings = Math.round(monthlyGeneration * unitRate);
  const annualSavings = monthlySavings * 12;
  const subsidyAmount = DEFAULT_SUBSIDY;

  // Default system cost calculation (rough estimate)
  const systemCost = systemKw * 60000; // ~60k per kW
  const actualInvestment = systemCost - subsidyAmount;
  const paybackTotalMonths = annualSavings > 0 ? (actualInvestment / annualSavings) * 12 : 0;

  const paybackYears = Math.floor(paybackTotalMonths / 12);
  const paybackMonths = Math.round(paybackTotalMonths % 12);
  const totalSavings = Math.max(0, Math.round(annualSavings * PANEL_LIFE_YEARS));

  return {
    monthlyGeneration,
    monthlySavings,
    annualSavings,
    subsidyAmount,
    actualInvestment: Math.round(actualInvestment),
    paybackYears,
    paybackMonths,
    totalSavings,
    loanAmount: 0,
    loanEmi: 0,
    loanPayable: 0,
    amount: (systemCost).toString(),
  };
}

export function calculateROI(
  systemKw: number,
  systemCost: number,
  unitRate: number,
  subsidyAmount: number = DEFAULT_SUBSIDY
) {
  const monthlyGeneration = Math.round(systemKw * PEAK_SUN_HOURS * DAYS_PER_MONTH * PERFORMANCE_RATIO);
  const monthlySavings = Math.round(monthlyGeneration * unitRate);
  const annualSavings = monthlySavings * 12;
  const actualInvestment = systemCost - subsidyAmount;
  const paybackTotalMonths = annualSavings > 0 ? (actualInvestment / annualSavings) * 12 : 0;

  const paybackYears = Math.floor(paybackTotalMonths / 12);
  const paybackMonths = Math.round(paybackTotalMonths % 12);
  const totalSavings = Math.max(0, Math.round(annualSavings * PANEL_LIFE_YEARS));
  const co2Saved = (systemKw * PEAK_SUN_HOURS * 365 * PERFORMANCE_RATIO * CO2_FACTOR_KG_PER_KWH / 1000).toFixed(2);

  return {
    monthlyGeneration,
    monthlySavings,
    annualSavings,
    actualInvestment: Math.round(actualInvestment),
    paybackYears,
    paybackMonths,
    totalSavings,
    co2Saved,
  };
}

export function calculateEMI(principal: number, annualRate: number, years: number) {
  const monthlyRate = annualRate / 100 / 12;
  const months = years * 12;

  let emi: number;
  if (monthlyRate <= 0) {
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

export function calculatePanelRequirements(
  systemKw: number,
  panelType: string,
  areaLength?: number,
  areaWidth?: number
) {
  const wattage = PANEL_WATTAGE[panelType] || 540;
  const areaSqFt = PANEL_AREA[panelType] || 22;
  const numPanels = Math.ceil((systemKw * 1000) / wattage);
  const systemArea = numPanels * areaSqFt;

  let availableArea = 0;
  let shortfall = 0;

  if (areaLength && areaWidth) {
    availableArea = Math.round(areaLength * areaWidth * 10.764);
    shortfall = Math.max(0, systemArea - availableArea);
  }

  return {
    numPanels,
    panelWattage: wattage,
    systemArea,
    availableArea,
    shortfall,
    isFeasible: shortfall === 0,
  };
}