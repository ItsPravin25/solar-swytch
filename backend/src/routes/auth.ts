import { Router } from 'express';
import { authService } from '../services/auth.service.js';
import { authenticate, getUserById } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { registerSchema, loginSchema } from '../types/index.js';
import { asyncHandler } from '../middleware/error-handler.js';
import type { ApiResponse } from '../types/index.js';

const router = Router();

router.post('/register',
  validate(registerSchema),
  asyncHandler(async (req, res) => {
    const result = await authService.register(req.body);
    res.status(201).json({
      success: true,
      data: result,
    } as ApiResponse<typeof result>);
  })
);

router.post('/login',
  validate(loginSchema),
  asyncHandler(async (req, res) => {
    const result = await authService.login(req.body);
    res.json({
      success: true,
      data: result,
    } as ApiResponse<typeof result>);
  })
);

router.post('/logout',
  authenticate,
  asyncHandler(async (_req, res) => {
    res.json({
      success: true,
      data: { message: 'Logged out successfully' },
    });
  })
);

router.get('/me',
  authenticate,
  asyncHandler(async (req, res) => {
    const user = await getUserById(req.user!.id);
    res.json({
      success: true,
      data: user,
    } as ApiResponse<typeof user>);
  })
);

export { router as authRouter };