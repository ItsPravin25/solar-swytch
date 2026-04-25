import mongoose, { Document, Schema } from 'mongoose';

export type BoqRowType = 'main' | 'highlight' | 'alert';

export interface IBoqRow {
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

export interface IBoq extends Document {
  boqKey: string;
  rows: IBoqRow[];
  createdAt: Date;
  updatedAt: Date;
}

const boqRowSchema = new Schema<IBoqRow>(
  {
    srNo: { type: Number, required: true },
    itemName: { type: String, required: true },
    particulars: { type: String, default: '' },
    quantity: { type: Number, default: 0 },
    unit: { type: String, default: '' },
    pricePerUnit: { type: Number, default: 0 },
    taxableAmount: { type: Number, default: 0 },
    gstPercent: { type: Number, default: 0 },
    gstAmount: { type: Number, default: 0 },
    totalAmount: { type: Number, default: 0 },
    perWatt: { type: Number, default: 0 },
    withGstPerWatt: { type: Number, default: 0 },
    dcr: { type: Boolean, default: false },
    nonDcr: { type: Boolean, default: false },
    rowType: { type: String, enum: ['main', 'highlight', 'alert'], default: 'main' },
  },
  { _id: false }
);

const boqSchema = new Schema<IBoq>(
  {
    boqKey: { type: String, required: true },
    rows: { type: [boqRowSchema], default: [] },
  },
  { timestamps: true }
);

boqSchema.index({ boqKey: 1 }, { unique: true });

export const Boq = mongoose.model<IBoq>('Boq', boqSchema);
