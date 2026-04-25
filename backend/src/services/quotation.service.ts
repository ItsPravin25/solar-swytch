import { Quotation } from '../models/quotation.model.js';
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
    const page = filters.page || 1;
    const limit = filters.limit || 10;
    const skip = (page - 1) * limit;

    const query: Record<string, unknown> = { userId };

    if (filters.search) {
      const searchRegex = new RegExp(filters.search, 'i');
      query['customer.firstName'] = searchRegex;
    }

    if (filters.approved !== undefined) {
      query.approved = filters.approved;
    }

    const sortField = filters.sortBy || 'createdAt';
    const sortOrder = filters.sortOrder === 'asc' ? 1 : -1;

    const [items, total] = await Promise.all([
      Quotation.find(query)
        .sort({ [sortField]: sortOrder })
        .skip(skip)
        .limit(limit)
        .lean(),
      Quotation.countDocuments(query),
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
    return Quotation.findOne({ _id: id, userId }).lean();
  }

  async create(userId: string, data: QuotationCreateInput) {
    const systemKw = parseFloat(data.systemCapacity);
    const unitRate = data.unitRate || 6.0;

    const metrics = calculateSolarMetrics(systemKw, data.panelType, unitRate);
    const numPanels = Math.ceil((systemKw * 1000) / PANEL_WATTAGE[data.panelType]);
    const systemArea = numPanels * PANEL_AREA[data.panelType];
    const availableArea = Math.round(systemArea * 0.5);
    const shortfall = Math.max(0, systemArea - availableArea);

    return Quotation.create({
      userId,
      customer: {
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
        address: data.address,
        state: data.state,
        city: data.city,
      },
      technical: {
        systemCapacity: data.systemCapacity,
        panelType: data.panelType,
        phase: data.phase,
        numPanels,
        availableArea: availableArea.toString(),
        systemArea: systemArea.toString(),
        shortfall: shortfall.toString(),
      },
      financial: {
        monthlyGeneration: metrics.monthlyGeneration,
        monthlySavings: metrics.monthlySavings,
        annualSavings: metrics.annualSavings,
        subsidyAmount: metrics.subsidyAmount,
        actualInvestment: metrics.actualInvestment,
        paybackYears: metrics.paybackYears,
        paybackMonths: metrics.paybackMonths,
        totalSavings: metrics.totalSavings,
        amount: metrics.amount.toString(),
        unitRate,
      },
      approved: false,
    });
  }

  async update(id: string, userId: string, data: Partial<QuotationCreateInput>) {
    const existing = await Quotation.findOne({ _id: id, userId });
    if (!existing) {
      throw new Error('Quotation not found');
    }

    let updateData: Record<string, unknown> = {};

    if (data.systemCapacity || data.panelType) {
      const systemKw = parseFloat(data.systemCapacity || existing.technical.systemCapacity);
      const panelType = data.panelType || existing.technical.panelType;
      const unitRate = data.unitRate || existing.financial.unitRate || 6.0;

      const metrics = calculateSolarMetrics(systemKw, panelType, unitRate);
      const numPanels = Math.ceil((systemKw * 1000) / PANEL_WATTAGE[panelType]);
      const systemArea = numPanels * PANEL_AREA[panelType];
      const availableArea = Math.round(systemArea * 0.5);
      const shortfall = Math.max(0, systemArea - availableArea);

      updateData = {
        'technical.systemCapacity': data.systemCapacity || existing.technical.systemCapacity,
        'technical.panelType': panelType,
        'technical.numPanels': numPanels,
        'technical.availableArea': availableArea.toString(),
        'technical.systemArea': systemArea.toString(),
        'technical.shortfall': shortfall.toString(),
        'financial.monthlyGeneration': metrics.monthlyGeneration,
        'financial.monthlySavings': metrics.monthlySavings,
        'financial.annualSavings': metrics.annualSavings,
        'financial.subsidyAmount': metrics.subsidyAmount,
        'financial.actualInvestment': metrics.actualInvestment,
        'financial.paybackYears': metrics.paybackYears,
        'financial.paybackMonths': metrics.paybackMonths,
        'financial.totalSavings': metrics.totalSavings,
        'financial.amount': metrics.amount.toString(),
        'financial.unitRate': unitRate,
      };
    }

    if (data.firstName) updateData['customer.firstName'] = data.firstName;
    if (data.lastName) updateData['customer.lastName'] = data.lastName;
    if (data.phone) updateData['customer.phone'] = data.phone;
    if (data.address) updateData['customer.address'] = data.address;
    if (data.state) updateData['customer.state'] = data.state;
    if (data.city) updateData['customer.city'] = data.city;

    return Quotation.findByIdAndUpdate(id, { $set: updateData }, { new: true });
  }

  async delete(id: string, userId: string) {
    const existing = await Quotation.findOne({ _id: id, userId });
    if (!existing) {
      throw new Error('Quotation not found');
    }

    await Quotation.findByIdAndDelete(id);
  }

  async approve(id: string, userId: string) {
    const existing = await Quotation.findOne({ _id: id, userId });
    if (!existing) {
      throw new Error('Quotation not found');
    }

    return Quotation.findByIdAndUpdate(id, { approved: true }, { new: true });
  }
}

export const quotationService = new QuotationService();
