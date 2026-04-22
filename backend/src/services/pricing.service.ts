import { prisma } from '../config/database.js';
import type { PricingUpdateInput, PricingBulkUpdateInput } from '../types/index.js';

export class PricingService {
  async findAll(userId: string) {
    const items = await prisma.pricing.findMany({
      where: { userId },
      orderBy: [{ capacity: 'asc' }, { phase: 'asc' }],
    });

    return items;
  }

  async findById(id: string, userId: string) {
    const pricing = await prisma.pricing.findFirst({
      where: { id, userId },
    });

    return pricing;
  }

  async bulkUpdate(userId: string, data: PricingBulkUpdateInput) {
    const results = await Promise.all(
      data.items.map(async (item) => {
        const totalCost = item.panelCost + item.inverterCost + item.structureCost + item.cableCost + item.otherCost;
        const status = totalCost > 0 ? 'complete' : 'pending';

        return prisma.pricing.upsert({
          where: {
            userId_capacity_phase: {
              userId,
              capacity: item.capacity,
              phase: item.phase,
            },
          },
          update: {
            panelCost: item.panelCost,
            inverterCost: item.inverterCost,
            structureCost: item.structureCost,
            cableCost: item.cableCost,
            otherCost: item.otherCost,
            totalCost,
            status,
          },
          create: {
            userId,
            capacity: item.capacity,
            phase: item.phase,
            panelCost: item.panelCost,
            inverterCost: item.inverterCost,
            structureCost: item.structureCost,
            cableCost: item.cableCost,
            otherCost: item.otherCost,
            totalCost,
            status,
          },
        });
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

    const pricing = await prisma.pricing.update({
      where: { id },
      data: {
        ...data,
        totalCost,
        status,
      },
    });

    return pricing;
  }
}

export const pricingService = new PricingService();