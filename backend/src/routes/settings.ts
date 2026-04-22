import { Router } from 'express';
import { settingsService } from '../services/settings.service.js';
import { authenticate } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { gstSettingsSchema, technicalSettingsSchema } from '../types/index.js';
import { asyncHandler } from '../middleware/error-handler.js';
import type { ApiResponse } from '../types/index.js';

const router = Router();

router.use(authenticate);

router.get('/gst',
  asyncHandler(async (req, res) => {
    const settings = await settingsService.getGstSettings(req.user!.id);
    res.json({
      success: true,
      data: settings,
    } as ApiResponse<typeof settings>);
  })
);

router.put('/gst',
  validate(gstSettingsSchema),
  asyncHandler(async (req, res) => {
    const settings = await settingsService.updateGstSettings(req.user!.id, req.body);
    res.json({
      success: true,
      data: settings,
    } as ApiResponse<typeof settings>);
  })
);

router.get('/technical',
  asyncHandler(async (req, res) => {
    const settings = await settingsService.getTechnicalSettings(req.user!.id);
    res.json({
      success: true,
      data: settings,
    } as ApiResponse<typeof settings>);
  })
);

router.put('/technical',
  validate(technicalSettingsSchema),
  asyncHandler(async (req, res) => {
    const settings = await settingsService.updateTechnicalSettings(req.user!.id, req.body);
    res.json({
      success: true,
      data: settings,
    } as ApiResponse<typeof settings>);
  })
);

export { router as settingsRouter };