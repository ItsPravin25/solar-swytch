export type SystemType = "on-grid" | "off-grid" | "hybrid";

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
  numPanels: number;
  dateTime: string;
  amount: string;
  approved: boolean;
}
