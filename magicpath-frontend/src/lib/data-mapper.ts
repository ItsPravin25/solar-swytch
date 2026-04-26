// Backend types (inline - no cross-project imports)
// These should match the backend IQuotation and IPricing interfaces

interface BackendQuotation {
  _id?: string;
  customer?: {
    firstName?: string;
    lastName?: string;
    phone?: string;
    address?: string;
    city?: string;
    state?: string;
    consumerNo?: string;
    sanctionLoad?: string;
    siteType?: string;
    billingType?: string;
  };
  technical?: {
    systemCapacity?: string;
    systemType?: string;
    panelType?: string;
    roofType?: string;
    areaLength?: string;
    areaWidth?: string;
    buildingHeight?: string;
    numPanels?: number;
    availableArea?: string;
    systemArea?: string;
    shortfall?: string;
  };
  financial?: {
    amount?: string;
  };
  createdAt?: Date;
  approved?: boolean;
}

interface BackendPricing {
  _id?: string;
  capacity?: string;
  phase?: string;
  panelCost?: number;
  inverterCost?: number;
  structureCost?: number;
  cableCost?: number;
  otherCost?: number;
}

// ─── Quotation Mappers ─────────────────────────────────────────────────────────

interface QuotationDetail {
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
  suggestedCapacity: string;
  systemCapacity: string;
  systemType: string;
  panelType: string;
  roofType: string;
  areaLength: string;
  areaWidth: string;
  buildingHeight: string;
  numPanels: number;
  availableArea: string;
  systemArea: string;
  shortfall: string;
  uploadedBill: string | null;
  dateTime: string;
  amount: string;
  approved: boolean;
}

interface PricingRow {
  id: string;
  capacity: string;
  phase: 'single' | 'three';
  panelCost: number;
  inverterCost: number;
  structureCost: number;
  cableCost: number;
  otherCost: number;
}

/**
 * Map backend quotation to frontend QuotationDetail structure.
 */
export function mapQuotationFromBackend(backend: BackendQuotation): QuotationDetail {
  const customer = backend.customer || {};
  const technical = backend.technical || {};
  const financial = backend.financial || {};

  const fmtDT = (d: Date) => {
    const date = new Date(d);
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    }) + ', ' + date.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  return {
    id: (backend._id as unknown as string) || '',
    firstName: customer.firstName || '',
    lastName: customer.lastName || '',
    phone: customer.phone || '',
    address: customer.address || '',
    location: [customer.city, customer.state].filter(Boolean).join(', '),
    consumerNo: customer.consumerNo || '',
    sanctionLoad: customer.sanctionLoad || '',
    siteType: customer.siteType || '',
    billingType: customer.billingType || '',
    avgMonthlyUnits: 0,
    suggestedCapacity: '0',
    systemCapacity: technical.systemCapacity || '',
    systemType: technical.systemType || 'on-grid',
    panelType: technical.panelType || '',
    roofType: technical.roofType || '',
    areaLength: technical.areaLength || '',
    areaWidth: technical.areaWidth || '',
    buildingHeight: technical.buildingHeight || '',
    numPanels: technical.numPanels || 0,
    availableArea: technical.availableArea || '',
    systemArea: technical.systemArea || '',
    shortfall: technical.shortfall || '',
    uploadedBill: null,
    dateTime: fmtDT(backend.createdAt || new Date()),
    amount: financial.amount || '₹0',
    approved: backend.approved || false,
  };
}

/**
 * Map frontend quotation to backend create input format.
 */
export function mapQuotationToBackend(frontend: QuotationDetail): Record<string, unknown> {
  const [city, ...stateParts] = (frontend.location || '').split(', ');
  const state = stateParts.join(', ');

  return {
    firstName: frontend.firstName,
    lastName: frontend.lastName,
    phone: frontend.phone,
    address: frontend.address,
    city: city || '',
    state: state || '',
    consumerNo: frontend.consumerNo,
    sanctionLoad: frontend.sanctionLoad,
    siteType: frontend.siteType,
    billingType: frontend.billingType,
    systemCapacity: frontend.systemCapacity,
    panelType: frontend.panelType,
    roofType: frontend.roofType,
    phase: frontend.billingType?.includes('3-Phase') ? '3-Phase' : '1-Phase',
    areaLength: frontend.areaLength,
    areaWidth: frontend.areaWidth,
    buildingHeight: frontend.buildingHeight,
  };
}

// ─── Pricing Mappers ───────────────────────────────────────────────────────────

/**
 * Map backend pricing item to frontend PricingRow structure.
 */
export function mapPricingFromBackend(backend: BackendPricing): PricingRow {
  return {
    id: (backend._id as unknown as string) || '',
    capacity: backend.capacity || '',
    phase: backend.phase === '3-Phase' ? 'three' : 'single',
    panelCost: backend.panelCost || 0,
    inverterCost: backend.inverterCost || 0,
    structureCost: backend.structureCost || 0,
    cableCost: backend.cableCost || 0,
    otherCost: backend.otherCost || 0,
  };
}

/**
 * Map frontend pricing row to backend bulk update format.
 */
export function mapPricingToBackend(frontend: PricingRow): Record<string, unknown> {
  return {
    capacity: frontend.capacity,
    phase: frontend.phase === 'three' ? '3-Phase' : '1-Phase',
    panelCost: frontend.panelCost,
    inverterCost: frontend.inverterCost,
    structureCost: frontend.structureCost,
    cableCost: frontend.cableCost,
    otherCost: frontend.otherCost,
  };
}
