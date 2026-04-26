import { Router } from 'express';
import { asyncHandler } from '../middleware/error-handler.js';
import { validate } from '../middleware/validate.js';
import {
  solarSizingSchema,
  costCalculationSchema,
  roiCalculationSchema,
  emiCalculationSchema,
  suggestCapacitySchema,
} from '../types/index.js';
import {
  calculateSystemSizing,
  calculateSystemCost,
  calculateSystemROI,
  calculateLoanEMI,
  suggestSystemCapacity,
} from '../services/calculations.service.js';
import type { ApiResponse } from '../types/index.js';

const router = Router();

/**
 * POST /api/v1/calculations/solar-sizing
 * Calculate system size, panel count, and area requirement
 */
router.post('/solar-sizing',
  validate(solarSizingSchema),
  asyncHandler(async (req, res) => {
    const { systemKw, panelType } = req.body;
    const result = calculateSystemSizing(systemKw, panelType);
    res.json({
      success: true,
      data: { input: { systemKw, panelType }, result },
    } as ApiResponse<typeof result>);
  })
);

/**
 * POST /api/v1/calculations/cost
 * Calculate pricing with profit margin and GST
 */
router.post('/cost',
  validate(costCalculationSchema),
  asyncHandler(async (req, res) => {
    const { systemKw, baseCost, otherExpenses, profitMargin } = req.body;
    const result = calculateSystemCost(systemKw, baseCost, otherExpenses, profitMargin);
    res.json({
      success: true,
      data: { input: { systemKw, baseCost, otherExpenses, profitMargin }, result },
    } as ApiResponse<typeof result>);
  })
);

/**
 * POST /api/v1/calculations/roi
 * Calculate payback, savings, and CO2 impact
 */
router.post('/roi',
  validate(roiCalculationSchema),
  asyncHandler(async (req, res) => {
    const { systemCost, subsidyAmount, monthlyGeneration, unitRate } = req.body;
    const result = calculateSystemROI(systemCost, subsidyAmount, monthlyGeneration, unitRate);
    res.json({
      success: true,
      data: { input: { systemCost, subsidyAmount, monthlyGeneration, unitRate }, result },
    } as ApiResponse<typeof result>);
  })
);

/**
 * POST /api/v1/calculations/emi
 * Calculate loan EMI
 */
router.post('/emi',
  validate(emiCalculationSchema),
  asyncHandler(async (req, res) => {
    const { loanAmount, interestRate, termInYears } = req.body;
    const result = calculateLoanEMI(loanAmount, interestRate, termInYears);
    res.json({
      success: true,
      data: { input: { loanAmount, interestRate, termInYears }, result },
    } as ApiResponse<typeof result>);
  })
);

/**
 * POST /api/v1/calculations/suggest-capacity
 * Suggest capacity from monthly bill units
 */
router.post('/suggest-capacity',
  validate(suggestCapacitySchema),
  asyncHandler(async (req, res) => {
    const { monthlyUnits, unitRate } = req.body;
    const result = suggestSystemCapacity(monthlyUnits, unitRate);
    res.json({
      success: true,
      data: { input: { monthlyUnits, unitRate }, result },
    } as ApiResponse<typeof result>);
  })
);

export { router as calculationsRouter };
