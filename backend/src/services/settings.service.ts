import { prisma } from '../config/database.js';
import type { GstSettingsInput, TechnicalSettingsInput } from '../types/index.js';

const DEFAULT_PANEL_TYPES = [
  { id: 'mono-standard', name: 'Monocrystalline (Standard)', wattage: 540, dimensions: '2256×1134mm', areaSqFt: 22, active: true },
  { id: 'mono-large', name: 'Monocrystalline (Large)', wattage: 585, dimensions: '2278×1134mm', areaSqFt: 24, active: true },
  { id: 'topcon', name: 'TOPCon (N-Type)', wattage: 590, dimensions: '2172×1303mm', areaSqFt: 22, active: true },
];

export class SettingsService {
  async getGstSettings(userId: string) {
    let settings = await prisma.userSettings.findUnique({
      where: { userId },
    });

    if (!settings) {
      settings = await prisma.userSettings.create({
        data: {
          userId,
          gstPercentage: 18,
          includeGst: true,
        },
      });
    }

    return {
      gstPercentage: settings.gstPercentage,
      includeGst: settings.includeGst,
    };
  }

  async updateGstSettings(userId: string, data: GstSettingsInput) {
    const settings = await prisma.userSettings.upsert({
      where: { userId },
      update: data,
      create: {
        userId,
        ...data,
      },
    });

    return {
      gstPercentage: settings.gstPercentage,
      includeGst: settings.includeGst,
    };
  }

  async getTechnicalSettings(userId: string) {
    let settings = await prisma.userSettings.findUnique({
      where: { userId },
    });

    if (!settings) {
      settings = await prisma.userSettings.create({
        data: {
          userId,
          panelTypes: DEFAULT_PANEL_TYPES,
        },
      });
    }

    const panelTypes = (settings.panelTypes as typeof DEFAULT_PANEL_TYPES) || DEFAULT_PANEL_TYPES;

    return { panelTypes };
  }

  async updateTechnicalSettings(userId: string, data: TechnicalSettingsInput) {
    const settings = await prisma.userSettings.upsert({
      where: { userId },
      update: { panelTypes: data.panelTypes },
      create: {
        userId,
        panelTypes: data.panelTypes,
      },
    });

    return { panelTypes: settings.panelTypes as typeof DEFAULT_PANEL_TYPES };
  }
}

export const settingsService = new SettingsService();