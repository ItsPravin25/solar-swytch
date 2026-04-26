import mongoose, { Document, Schema } from 'mongoose';

export interface ISettings extends Document {
  userId: string;
  gstPercentage: number;
  includeGst: boolean;
  panelTypes: Array<{
    id: string;
    name: string;
    wattage: number;
    dimensions: string;
    areaSqFt: number;
    active: boolean;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

const settingsSchema = new Schema<ISettings>(
  {
    userId: { type: String, required: true, unique: true },
    gstPercentage: { type: Number, default: 18 },
    includeGst: { type: Boolean, default: true },
    panelTypes: { type: [new Schema({
      id: { type: String, required: true },
      name: { type: String, required: true },
      wattage: { type: Number, required: true },
      dimensions: { type: String, required: true },
      areaSqFt: { type: Number, required: true },
      active: { type: Boolean, default: true },
    }, { _id: false })], default: [] },
  },
  { timestamps: true }
);

export const Settings = mongoose.model<ISettings>('Settings', settingsSchema);
