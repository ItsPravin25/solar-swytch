export type Theme = 'light' | 'dark';
export type Container = 'centered' | 'none';

export type BoqRowType = 'main' | 'highlight' | 'alert';

export interface BoqRow {
  srNo: number;
  itemName: string;
  particulars: string;
  quantity: number;
  unit: string;
  pricePerUnit: number;
  taxableAmount: number;
  gstPercent: number;
  gstAmount: number;
  totalAmount: number;
  perWatt: number;
  withGstPerWatt: number;
  dcr: boolean;
  nonDcr: boolean;
  rowType: BoqRowType;
}

export interface BoqDocument {
  boqKey: string;
  rows: BoqRow[];
}
