import { Router } from 'express';
import { profileService } from '../services/profile.service.js';
import { authenticate } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { profileUpdateSchema } from '../types/index.js';
import { asyncHandler } from '../middleware/error-handler.js';
import type { ApiResponse } from '../types/index.js';

const router = Router();

router.use(authenticate);

router.get('/',
  asyncHandler(async (req, res) => {
    const profile = await profileService.get(req.user!.id);
    res.json({
      success: true,
      data: profile,
    } as ApiResponse<typeof profile>);
  })
);

router.put('/',
  validate(profileUpdateSchema),
  asyncHandler(async (req, res) => {
    const profile = await profileService.update(req.user!.id, req.body);
    res.json({
      success: true,
      data: profile,
    } as ApiResponse<typeof profile>);
  })
);

router.post('/photo',
  asyncHandler(async (req, res) => {
    // Photo upload would be handled by multer or similar
    // For now, accept a URL directly
    const { photoUrl } = req.body;
    if (!photoUrl) {
      res.status(400).json({
        success: false,
        error: { code: '400', message: 'photoUrl is required' },
      });
      return;
    }
    const profile = await profileService.updatePhoto(req.user!.id, photoUrl);
    res.json({
      success: true,
      data: profile,
    } as ApiResponse<typeof profile>);
  })
);

export { router as profileRouter };