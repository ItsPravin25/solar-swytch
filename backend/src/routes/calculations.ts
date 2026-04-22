import { Router } from 'express';
import { calculateROI, calculateEMI, calculatePanelRequirements } from '../services/calculations.service.js';
import { validate } from '../middleware/validate.js';
import { roiCalculationSchema, emiCalculationSchema, solarCalculationSchema } from '../types/index.js';
import { asyncHandler } from '../middleware/error-handler.js';
import type { ApiResponse } from '../types/index.js';

const router = Router();

router.post('/roi',
  validate(roiCalculationSchema),
  asyncHandler(async (req, res) => {
    const { systemKw, systemCost, unitRate, subsidyAmount } = req.body;
    const result = calculateROI(systemKw, systemCost, unitRate, subsidyAmount);
    res.json({
      success: true,
      data: result,
    } as ApiResponse<typeof result>);
  })
);

router.post('/emi',
  validate(emiCalculationSchema),
  asyncHandler(async (req, res) => {
    const { principal, annualRate, years } = req.body;
    const result = calculateEMI(principal, annualRate, years);
    res.json({
      success: true,
      data: result,
    } as ApiResponse<typeof result>);
  })
);

router.post('/panels',
  validate(solarCalculationSchema),
  asyncHandler(async (req, res) => {
    const { systemKw, panelType, areaLength, areaWidth } = req.body;
    const result = calculatePanelRequirements(systemKw, panelType, areaLength, areaWidth);
    res.json({
      success: true,
      data: result,
    } as ApiResponse<typeof result>);
  })
);

export { router as calculationsRouter };