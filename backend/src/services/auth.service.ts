import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/user.model.js';
import { Settings } from '../models/settings.model.js';
import { Pricing } from '../models/pricing.model.js';
import type { RegisterInput, LoginInput } from '../types/index.js';

export class AuthService {
  async register(data: RegisterInput) {
    const existingUser = await User.findOne({ email: data.email.toLowerCase() });

    if (existingUser) {
      throw new Error('Email already registered');
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = await User.create({
      email: data.email.toLowerCase(),
      password: hashedPassword,
      fullName: data.fullName,
      phone: data.phone,
      companyName: data.companyName,
    });

    // Create default settings for user
    await Settings.create({
      userId: user._id.toString(),
      panelTypes: [
        { id: 'mono-standard', name: 'Monocrystalline (Standard)', wattage: 540, dimensions: '2256×1134mm', areaSqFt: 22, active: true },
        { id: 'mono-large', name: 'Monocrystalline (Large)', wattage: 585, dimensions: '2278×1134mm', areaSqFt: 24, active: true },
        { id: 'topcon', name: 'TOPCon (N-Type)', wattage: 590, dimensions: '2172×1303mm', areaSqFt: 22, active: true },
      ],
    });

    // Create default pricing for user
    const capacities = ['1kW', '2kW', '3kW', '4kW', '5kW', '6kW', '7kW', '8kW', '9kW', '10kW'];
    const phases: Record<string, string[]> = {
      '1kW': ['single'], '2kW': ['single'], '3kW': ['single'], '4kW': ['single'],
      '5kW': ['single', 'three'], '6kW': ['single', 'three'], '7kW': ['single', 'three'], '8kW': ['three'],
      '9kW': ['three'], '10kW': ['three'],
    };

    const pricingData = capacities.flatMap((capacity) =>
      phases[capacity].map((phase) => ({
        userId: user._id.toString(),
        capacity,
        phase,
        panelCost: 0,
        inverterCost: 0,
        structureCost: 0,
        cableCost: 0,
        otherCost: 0,
        totalCost: 0,
        status: 'pending',
      }))
    );

    await Pricing.insertMany(pricingData);

    const token = this.generateToken(user._id.toString(), user.email);

    return {
      user: {
        id: user._id.toString(),
        email: user.email,
        fullName: user.fullName,
        phone: user.phone,
        companyName: user.companyName,
        createdAt: user.createdAt,
      },
      token,
    };
  }

  async login(data: LoginInput) {
    const user = await User.findOne({ email: data.email.toLowerCase() });

    if (!user) {
      throw new Error('Invalid email or password');
    }

    const isPasswordValid = await bcrypt.compare(data.password, user.password);

    if (!isPasswordValid) {
      throw new Error('Invalid email or password');
    }

    const token = this.generateToken(user._id.toString(), user.email);

    return {
      user: {
        id: user._id.toString(),
        email: user.email,
        fullName: user.fullName,
        phone: user.phone,
        companyName: user.companyName,
        createdAt: user.createdAt,
      },
      token,
    };
  }

  generateToken(userId: string, email: string): string {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error('JWT_SECRET not configured');
    }

    return jwt.sign({ userId, email }, secret, { expiresIn: '7d' });
  }
}

export const authService = new AuthService();
