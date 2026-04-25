import mongoose, { Document, Schema } from 'mongoose';

export interface IQuotation extends Document {
  userId: string;
  customer: {
    firstName: string;
    lastName: string;
    phone: string;
    address: string;
    state: string;
    city: string;
    consumerNo?: string;
    sanctionLoad?: string;
    siteType?: string;
    billingType?: string;
  };
  technical: {
    systemCapacity: string;
    systemType?: string;
    panelType: string;
    roofType?: string;
    phase: string;
    areaLength?: string;
    areaWidth?: string;
    buildingHeight?: string;
    numPanels?: number;
    availableArea?: string;
    systemArea?: string;
    shortfall?: string;
  };
  financial: {
    monthlyGeneration: number;
    monthlySavings: number;
    annualSavings: number;
    subsidyAmount: number;
    actualInvestment: number;
    paybackYears: number;
    paybackMonths: number;
    totalSavings: number;
    loanAmount?: number;
    loanEmi?: number;
    loanPayable?: number;
    amount: string;
    unitRate: number;
  };
  approved: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const quotationSchema = new Schema<IQuotation>(
  {
    userId: { type: String, required: true },
    customer: {
      firstName: { type: String, required: true },
      lastName: { type: String, required: true },
      phone: { type: String, required: true },
      address: { type: String, required: true },
      state: { type: String, required: true },
      city: { type: String, required: true },
      consumerNo: { type: String },
      sanctionLoad: { type: String },
      siteType: { type: String },
      billingType: { type: String },
    },
    technical: {
      systemCapacity: { type: String, required: true },
      systemType: { type: String },
      panelType: { type: String, required: true },
      roofType: { type: String },
      phase: { type: String, required: true },
      areaLength: { type: String },
      areaWidth: { type: String },
      buildingHeight: { type: String },
      numPanels: { type: Number },
      availableArea: { type: String },
      systemArea: { type: String },
      shortfall: { type: String },
    },
    financial: {
      monthlyGeneration: { type: Number, required: true },
      monthlySavings: { type: Number, required: true },
      annualSavings: { type: Number, required: true },
      subsidyAmount: { type: Number, required: true },
      actualInvestment: { type: Number, required: true },
      paybackYears: { type: Number, required: true },
      paybackMonths: { type: Number, required: true },
      totalSavings: { type: Number, required: true },
      loanAmount: { type: Number },
      loanEmi: { type: Number },
      loanPayable: { type: Number },
      amount: { type: String, required: true },
      unitRate: { type: Number, default: 6.0 },
    },
    approved: { type: Boolean, default: false },
  },
  { timestamps: true }
);

quotationSchema.index({ userId: 1 });
quotationSchema.index({ approved: 1 });

export const Quotation = mongoose.model<IQuotation>('Quotation', quotationSchema);
