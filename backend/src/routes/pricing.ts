import { Router } from 'express';
import { pricingService } from '../services/pricing.service.js';
import { authenticate } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { pricingBulkUpdateSchema, pricingUpdateSchema } from '../types/index.js';
import { asyncHandler } from '../middleware/error-handler.js';
import type { ApiResponse } from '../types/index.js';
import type { Pricing } from '@prisma/client';

const router = Router();

router.use(authenticate);

router.get('/',
  asyncHandler(async (req, res) => {
    const items = await pricingService.findAll(req.user!.id);
    res.json({
      success: true,
      data: items,
    } as ApiResponse<typeof items>);
  })
);

router.put('/',
  validate(pricingBulkUpdateSchema),
  asyncHandler(async (req, res) => {
    const items = await pricingService.bulkUpdate(req.user!.id, req.body);
    res.json({
      success: true,
      data: items,
    } as ApiResponse<typeof items>);
  })
);

router.put('/:id',
  validate(pricingUpdateSchema),
  asyncHandler(async (req, res) => {
    const item = await pricingService.update(req.params.id, req.user!.id, req.body);
    res.json({
      success: true,
      data: item,
    } as ApiResponse<Pricing>);
  })
);

export { router as pricingRouter };