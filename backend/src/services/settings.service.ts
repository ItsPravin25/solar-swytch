import { Settings } from '../models/settings.model.js';
import type { GstSettingsInput, TechnicalSettingsInput } from '../types/index.js';

const DEFAULT_PANEL_TYPES = [
  { id: 'mono-standard', name: 'Monocrystalline (Standard)', wattage: 540, dimensions: '2256×1134mm', areaSqFt: 22, active: true },
  { id: 'mono-large', name: 'Monocrystalline (Large)', wattage: 585, dimensions: '2278×1134mm', areaSqFt: 24, active: true },
  { id: 'topcon', name: 'TOPCon (N-Type)', wattage: 590, dimensions: '2172×1303mm', areaSqFt: 22, active: true },
];

export class SettingsService {
  async getGstSettings(userId: string) {
    let settings = await Settings.findOne({ userId });

    if (!settings) {
      settings = await Settings.create({
        userId,
        gstPercentage: 18,
        includeGst: true,
        panelTypes: DEFAULT_PANEL_TYPES,
      });
    }

    return {
      gstPercentage: settings.gstPercentage,
      includeGst: settings.includeGst,
    };
  }

  async updateGstSettings(userId: string, data: GstSettingsInput) {
    await Settings.findOneAndUpdate(
      { userId },
      { $set: { gstPercentage: data.gstPercentage, includeGst: data.includeGst } },
      { upsert: true, new: true }
    );

    return {
      gstPercentage: data.gstPercentage,
      includeGst: data.includeGst,
    };
  }

  async getTechnicalSettings(userId: string) {
    let settings = await Settings.findOne({ userId });

    if (!settings) {
      settings = await Settings.create({
        userId,
        gstPercentage: 18,
        includeGst: true,
        panelTypes: DEFAULT_PANEL_TYPES,
      });
    }

    return { panelTypes: settings.panelTypes || DEFAULT_PANEL_TYPES };
  }

  async updateTechnicalSettings(userId: string, data: TechnicalSettingsInput) {
    await Settings.findOneAndUpdate(
      { userId },
      { $set: { panelTypes: data.panelTypes } },
      { upsert: true, new: true }
    );

    return { panelTypes: data.panelTypes };
  }
}

export const settingsService = new SettingsService();
