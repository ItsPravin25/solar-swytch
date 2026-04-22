export type SystemType = "on-grid" | "off-grid" | "hybrid";
export type PhaseType = "1-Phase" | "3-Phase";

export interface QuotationCustomerForm {
  firstName: string;
  lastName: string;
  phone: string;
  address: string;
  location: string;
  consumerNo: string;
  sanctionLoad: string;
  siteType: string;
  billingType: string;
}

export interface QuotationTechnicalForm {
  systemCapacity: string;
  systemType: SystemType;
  panelType: PanelType;
  roofType: string;
  phase: PhaseType;
  areaLength: string;
  areaWidth: string;
  buildingHeight: string;
}

export type PanelType = "mono-standard" | "mono-large" | "topcon";

export interface QuotationFinancialForm {
  monthlyGeneration: number;
  monthlySavings: number;
  annualSavings: number;
  subsidyAmount: number;
  actualInvestment: number;
  paybackYears: number;
  paybackMonths: number;
  totalSavings: number;
  loanAmount: number;
  loanEmi: number;
  loanPayable: number;
}

export interface QuotationForm {
  customer: QuotationCustomerForm;
  technical: QuotationTechnicalForm;
  financial: QuotationFinancialForm;
}

export interface QuotationDetail {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  address: string;
  location: string;
  consumerNo: string;
  sanctionLoad: string;
  siteType: string;
  billingType: string;
  avgMonthlyUnits: number;
  systemCapacity: string;
  systemType: SystemType;
  panelType: string;
  roofType: string;
  areaLength: string;
  areaWidth: string;
  buildingHeight: string;
  numPanels: number;
  availableArea: string;
  systemArea: string;
  shortfall: string;
  dateTime: string;
  amount: string;
  approved: boolean;
}

export const SITE_TYPES = [
  { value: "residential", label: "Residential" },
  { value: "commercial", label: "Commercial" },
  { value: "industrial", label: "Industrial" },
] as const;

export const BILLING_TYPES = [
  { value: "res-1-phase", label: "Res 1-Phase" },
  { value: "res-3-phase", label: "Res 3-Phase" },
  { value: "com-1-phase", label: "Com 1-Phase" },
  { value: "com-3-phase", label: "Com 3-Phase" },
  { value: "industrial", label: "Industrial" },
] as const;

export const SYSTEM_TYPES = [
  { value: "on-grid", label: "On-Grid" },
  { value: "off-grid", label: "Off-Grid" },
  { value: "hybrid", label: "Hybrid" },
] as const;

export const ROOF_TYPES = [
  { value: "rcc", label: "RCC" },
  { value: "sheet", label: "Sheet" },
  { value: "ground", label: "Ground" },
] as const;

export const PANEL_TYPES = [
  {
    id: "mono-standard" as PanelType,
    name: "Mono Standard",
    wattage: 540,
    areaSqFt: 22,
    dimensions: "2256×1134mm",
  },
  {
    id: "mono-large" as PanelType,
    name: "Mono Large",
    wattage: 585,
    areaSqFt: 24,
    dimensions: "2278×1134mm",
  },
  {
    id: "topcon" as PanelType,
    name: "TOPCon",
    wattage: 590,
    areaSqFt: 22,
    dimensions: "2172×1303mm",
  },
] as const;

// Sanction Load options with phase constraints
// 1-4kW: 1-phase only, 5-8kW: both, 9-10kW: 3-phase only
export const SANCTION_LOAD_OPTIONS = [
  { value: "1", label: "1 kW", phases: ["1-Phase"] as PhaseType[] },
  { value: "2", label: "2 kW", phases: ["1-Phase"] as PhaseType[] },
  { value: "3", label: "3 kW", phases: ["1-Phase"] as PhaseType[] },
  { value: "4", label: "4 kW", phases: ["1-Phase"] as PhaseType[] },
  { value: "5", label: "5 kW", phases: ["1-Phase", "3-Phase"] as PhaseType[] },
  { value: "6", label: "6 kW", phases: ["1-Phase", "3-Phase"] as PhaseType[] },
  { value: "7", label: "7 kW", phases: ["1-Phase", "3-Phase"] as PhaseType[] },
  { value: "8", label: "8 kW", phases: ["1-Phase", "3-Phase"] as PhaseType[] },
  { value: "9", label: "9 kW", phases: ["3-Phase"] as PhaseType[] },
  { value: "10", label: "10 kW", phases: ["3-Phase"] as PhaseType[] },
] as const;

export const CAPACITY_OPTIONS = [
  { value: "1kW", label: "1 kW" },
  { value: "2kW", label: "2 kW" },
  { value: "3kW", label: "3 kW" },
  { value: "4kW", label: "4 kW" },
  { value: "5kW", label: "5 kW" },
  { value: "6kW", label: "6 kW" },
  { value: "7kW", label: "7 kW" },
  { value: "8kW", label: "8 kW" },
  { value: "9kW", label: "9 kW" },
  { value: "10kW", label: "10 kW" },
] as const;

// Get allowed phase options based on sanction load
export function getAllowedPhases(
  sanctionLoad: string
): PhaseType[] {
  const load = parseInt(sanctionLoad) || 0;
  if (load >= 1 && load <= 4) return ["1-Phase"];
  if (load >= 5 && load <= 8) return ["1-Phase", "3-Phase"];
  if (load >= 9 && load <= 10) return ["3-Phase"];
  return ["1-Phase", "3-Phase"];
}
