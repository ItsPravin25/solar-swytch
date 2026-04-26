import mongoose, { Document, Schema } from 'mongoose';

export interface IPricing extends Document {
  userId: string;
  capacity: string;
  phase: string;
  panelCost: number;
  inverterCost: number;
  structureCost: number;
  cableCost: number;
  otherCost: number;
  totalCost: number;
  status: 'pending' | 'complete';
  createdAt: Date;
  updatedAt: Date;
}

const pricingSchema = new Schema<IPricing>(
  {
    userId: { type: String, required: true },
    capacity: { type: String, required: true },
    phase: { type: String, required: true },
    panelCost: { type: Number, default: 0 },
    inverterCost: { type: Number, default: 0 },
    structureCost: { type: Number, default: 0 },
    cableCost: { type: Number, default: 0 },
    otherCost: { type: Number, default: 0 },
    totalCost: { type: Number, default: 0 },
    status: { type: String, enum: ['pending', 'complete'], default: 'pending' },
  },
  { timestamps: true }
);

pricingSchema.index({ userId: 1, capacity: 1, phase: 1 }, { unique: true });

export const Pricing = mongoose.model<IPricing>('Pricing', pricingSchema);
