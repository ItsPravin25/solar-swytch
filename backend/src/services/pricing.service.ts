import { Pricing } from '../models/pricing.model.js';
import type { PricingUpdateInput, PricingBulkUpdateInput } from '../types/index.js';

export class PricingService {
  async findAll(userId: string) {
    return Pricing.find({ userId })
      .sort({ capacity: 'asc', phase: 'asc' })
      .lean();
  }

  async findById(id: string, userId: string) {
    return Pricing.findOne({ _id: id, userId }).lean();
  }

  async bulkUpdate(userId: string, data: PricingBulkUpdateInput) {
    const results = await Promise.all(
      data.items.map(async (item) => {
        const totalCost = item.panelCost + item.inverterCost + item.structureCost + item.cableCost + item.otherCost;
        const status = totalCost > 0 ? 'complete' : 'pending';

        return Pricing.findOneAndUpdate(
          { userId, capacity: item.capacity, phase: item.phase },
          {
            $set: {
              panelCost: item.panelCost,
              inverterCost: item.inverterCost,
              structureCost: item.structureCost,
              cableCost: item.cableCost,
              otherCost: item.otherCost,
              totalCost,
              status,
            },
          },
          { upsert: true, new: true }
        );
      })
    );

    return results;
  }

  async update(id: string, userId: string, data: PricingUpdateInput) {
    const existing = await this.findById(id, userId);
    if (!existing) {
      throw new Error('Pricing not found');
    }

    const totalCost = data.panelCost + data.inverterCost + data.structureCost + data.cableCost + data.otherCost;
    const status = totalCost > 0 ? 'complete' : 'pending';

    return Pricing.findByIdAndUpdate(id, {
      $set: {
        ...data,
        totalCost,
        status,
      },
    }, { new: true });
  }
}

export const pricingService = new PricingService();
