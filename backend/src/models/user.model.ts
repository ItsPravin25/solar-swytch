import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  email: string;
  password: string;
  fullName: string;
  phone?: string;
  businessType?: string;
  role?: string;
  companyName?: string;
  gstNumber?: string;
  address?: string;
  state?: string;
  city?: string;
  pincode?: string;
  primaryContact?: string;
  alternateContact?: string;
  bankName?: string;
  accountNumber?: string;
  ifscCode?: string;
  logoUrl?: string;
  profilePhoto?: string;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    fullName: { type: String, required: true },
    phone: { type: String },
    businessType: { type: String },
    role: { type: String },
    companyName: { type: String },
    gstNumber: { type: String },
    address: { type: String },
    state: { type: String },
    city: { type: String },
    pincode: { type: String },
    primaryContact: { type: String },
    alternateContact: { type: String },
    bankName: { type: String },
    accountNumber: { type: String },
    ifscCode: { type: String },
    logoUrl: { type: String },
    profilePhoto: { type: String },
  },
  { timestamps: true }
);

userSchema.index({ email: 1 });

export const User = mongoose.model<IUser>('User', userSchema);