import { z } from 'zod';

// Auth
export const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  fullName: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().optional(),
  companyName: z.string().optional(),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;

// Quotation
export const quotationCreateSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  phone: z.string().min(1, 'Phone is required'),
  email: z.string().email().optional(),
  address: z.string().min(1, 'Address is required'),
  location: z.string().optional(),
  state: z.string().min(1, 'State is required'),
  city: z.string().min(1, 'City is required'),
  consumerNo: z.string().optional(),
  sanctionLoad: z.string().optional(),
  siteType: z.string().optional(),
  billingType: z.string().optional(),
  systemCapacity: z.string().min(1, 'System capacity is required'),
  systemType: z.enum(['on-grid', 'off-grid', 'hybrid']).optional(),
  panelType: z.enum(['mono-standard', 'mono-large', 'topcon']),
  roofType: z.string().optional(),
  phase: z.enum(['1-Phase', '3-Phase', 'single', 'three']).optional(),
  areaLength: z.string().optional(),
  areaWidth: z.string().optional(),
  buildingHeight: z.string().optional(),
  unitRate: z.number().optional(),
});

export const quotationUpdateSchema = quotationCreateSchema.partial();
export const quotationFiltersSchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
  search: z.string().optional(),
  approved: z.coerce.boolean().optional(),
  sortBy: z.string().default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

export type QuotationCreateInput = z.infer<typeof quotationCreateSchema>;
export type QuotationUpdateInput = z.infer<typeof quotationUpdateSchema>;
export type QuotationFilters = z.infer<typeof quotationFiltersSchema>;

// Pricing
export const pricingUpdateSchema = z.object({
  capacity: z.string(),
  phase: z.enum(['single', 'three']),
  panelCost: z.number().min(0),
  inverterCost: z.number().min(0),
  structureCost: z.number().min(0),
  cableCost: z.number().min(0),
  otherCost: z.number().min(0),
});

export const pricingBulkUpdateSchema = z.object({
  items: z.array(pricingUpdateSchema),
});

export type PricingUpdateInput = z.infer<typeof pricingUpdateSchema>;
export type PricingBulkUpdateInput = z.infer<typeof pricingBulkUpdateSchema>;

// Profile
export const profileUpdateSchema = z.object({
  fullName: z.string().min(2).optional(),
  phone: z.string().optional(),
  businessType: z.string().optional(),
  role: z.string().optional(),
  companyName: z.string().optional(),
  gstNumber: z.string().optional(),
  address: z.string().optional(),
  state: z.string().optional(),
  city: z.string().optional(),
  pincode: z.string().optional(),
  primaryContact: z.string().optional(),
  alternateContact: z.string().optional(),
  bankName: z.string().optional(),
  accountNumber: z.string().optional(),
  ifscCode: z.string().optional(),
});

export type ProfileUpdateInput = z.infer<typeof profileUpdateSchema>;

// Settings
export const gstSettingsSchema = z.object({
  gstPercentage: z.number().min(0).max(100),
  includeGst: z.boolean(),
});

export const panelTypeSchema = z.object({
  id: z.enum(['mono-standard', 'mono-large', 'topcon']),
  name: z.string(),
  wattage: z.number(),
  dimensions: z.string(),
  areaSqFt: z.number(),
  active: z.boolean(),
});

export const technicalSettingsSchema = z.object({
  panelTypes: z.array(panelTypeSchema),
});

export type GstSettingsInput = z.infer<typeof gstSettingsSchema>;
export type TechnicalSettingsInput = z.infer<typeof technicalSettingsSchema>;
export type PanelTypeInput = z.infer<typeof panelTypeSchema>;

// Calculations - Phase 2 schemas
export const solarSizingSchema = z.object({
  systemKw: z.number().min(0.1, 'System capacity must be at least 0.1 kW'),
  panelType: z.enum(['mono-standard', 'mono-large', 'topcon']),
});

export const costCalculationSchema = z.object({
  systemKw: z.number().min(0.1, 'System capacity must be at least 0.1 kW'),
  baseCost: z.number().min(0, 'Base cost cannot be negative'),
  otherExpenses: z.number().min(0, 'Other expenses cannot be negative').default(0),
  profitMargin: z.number().min(0).max(100, 'Profit margin must be 0-100%').default(20),
});

export const roiCalculationSchema = z.object({
  systemCost: z.number().min(1, 'System cost must be at least 1'),
  subsidyAmount: z.number().min(0).default(0),
  monthlyGeneration: z.number().min(0, 'Monthly generation cannot be negative'),
  unitRate: z.number().min(0.1, 'Unit rate must be positive'),
});

export const emiCalculationSchema = z.object({
  loanAmount: z.number().min(1, 'Loan amount must be at least 1'),
  interestRate: z.number().min(0.1, 'Interest rate must be at least 0.1%'),
  termInYears: z.number().min(1).max(30, 'Term must be 1-30 years'),
});

export const suggestCapacitySchema = z.object({
  monthlyUnits: z.array(z.number().min(0, 'Units cannot be negative')).min(1, 'At least one month required'),
});

export type SolarSizingInput = z.infer<typeof solarSizingSchema>;
export type CostCalculationInput = z.infer<typeof costCalculationSchema>;
export type RoiCalculationInput = z.infer<typeof roiCalculationSchema>;
export type EmiCalculationInput = z.infer<typeof emiCalculationSchema>;
export type SuggestCapacityInput = z.infer<typeof suggestCapacitySchema>;

// Legacy schema aliases for backwards compatibility
export const solarCalculationSchema = solarSizingSchema;

export type SolarCalculationInput = z.infer<typeof solarCalculationSchema>;

// API Response types
export interface ApiResponse<T = unknown> {
  success: true;
  data: T;
}

export interface PaginatedResponse<T = unknown> {
  success: true;
  data: {
    items: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface ErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
}
