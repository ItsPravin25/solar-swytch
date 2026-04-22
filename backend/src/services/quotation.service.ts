import { prisma } from '../config/database.js';
import { calculateSolarMetrics } from './calculations.service.js';
import type { QuotationCreateInput, QuotationFilters } from '../types/index.js';

const PANEL_WATTAGE: Record<string, number> = {
  'mono-standard': 540,
  'mono-large': 585,
  'topcon': 590,
};

const PANEL_AREA: Record<string, number> = {
  'mono-standard': 22,
  'mono-large': 24,
  'topcon': 22,
};

export class QuotationService {
  async findAll(userId: string, filters: QuotationFilters) {
    const { page, limit, search, approved, sortBy, sortOrder } = filters;
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = { userId };

    if (search) {
      where.OR = [
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (approved !== undefined) {
      where.approved = approved;
    }

    const [items, total] = await Promise.all([
      prisma.quotation.findMany({
        where,
        orderBy: { [sortBy]: sortOrder },
        skip,
        take: limit,
      }),
      prisma.quotation.count({ where }),
    ]);

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findById(id: string, userId: string) {
    const quotation = await prisma.quotation.findFirst({
      where: { id, userId },
    });

    return quotation;
  }

  async create(userId: string, data: QuotationCreateInput) {
    const systemKw = parseFloat(data.systemCapacity);
    const unitRate = data.unitRate || 6.0;

    // Calculate financial metrics
    const metrics = calculateSolarMetrics(systemKw, data.panelType, unitRate);
    const numPanels = Math.ceil((systemKw * 1000) / PANEL_WATTAGE[data.panelType]);
    const systemArea = numPanels * PANEL_AREA[data.panelType];
    const availableArea = Math.round(systemArea * 0.5);
    const shortfall = Math.max(0, systemArea - availableArea);

    const quotation = await prisma.quotation.create({
      data: {
        userId,
        ...data,
        numPanels,
        availableArea: availableArea.toString(),
        systemArea: systemArea.toString(),
        shortfall: shortfall.toString(),
        ...metrics,
        unitRate,
      },
    });

    return quotation;
  }

  async update(id: string, userId: string, data: Partial<QuotationCreateInput>) {
    const existing = await this.findById(id, userId);
    if (!existing) {
      throw new Error('Quotation not found');
    }

    type UpdateData = Record<string, unknown>;
    let updateData: UpdateData = { ...data };

    // Recalculate if technical fields change
    if (data.systemCapacity || data.panelType) {
      const systemKw = parseFloat(data.systemCapacity || existing.systemCapacity);
      const panelType = data.panelType || existing.panelType;
      const unitRate = data.unitRate || existing.unitRate || 6.0;

      const metrics = calculateSolarMetrics(systemKw, panelType, unitRate);
      const numPanels = Math.ceil((systemKw * 1000) / PANEL_WATTAGE[panelType]);
      const systemArea = numPanels * PANEL_AREA[panelType];
      const availableArea = Math.round(systemArea * 0.5);
      const shortfall = Math.max(0, systemArea - availableArea);

      updateData = {
        ...updateData,
        numPanels,
        availableArea: availableArea.toString(),
        systemArea: systemArea.toString(),
        shortfall: shortfall.toString(),
        monthlyGeneration: metrics.monthlyGeneration,
        monthlySavings: metrics.monthlySavings,
        annualSavings: metrics.annualSavings,
        subsidyAmount: metrics.subsidyAmount,
        actualInvestment: metrics.actualInvestment,
        paybackYears: metrics.paybackYears,
        paybackMonths: metrics.paybackMonths,
        totalSavings: metrics.totalSavings,
        loanAmount: metrics.loanAmount,
        loanEmi: metrics.loanEmi,
        loanPayable: metrics.loanPayable,
        amount: metrics.amount,
        unitRate,
      };
    }

    const quotation = await prisma.quotation.update({
      where: { id },
      data: updateData,
    });

    return quotation;
  }

  async delete(id: string, userId: string) {
    const existing = await this.findById(id, userId);
    if (!existing) {
      throw new Error('Quotation not found');
    }

    await prisma.quotation.delete({ where: { id } });
  }

  async approve(id: string, userId: string) {
    const existing = await this.findById(id, userId);
    if (!existing) {
      throw new Error('Quotation not found');
    }

    const quotation = await prisma.quotation.update({
      where: { id },
      data: { approved: true },
    });

    return quotation;
  }
}

export const quotationService = new QuotationService();