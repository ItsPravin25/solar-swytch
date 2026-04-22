import { Router } from 'express';
import { quotationService } from '../services/quotation.service.js';
import { authenticate } from '../middleware/auth.js';
import { validate, validateQuery } from '../middleware/validate.js';
import {
  quotationCreateSchema,
  quotationUpdateSchema,
  quotationFiltersSchema,
} from '../types/index.js';
import { asyncHandler } from '../middleware/error-handler.js';
import type { ApiResponse, PaginatedResponse } from '../types/index.js';
import type { Quotation } from '@prisma/client';

const router = Router();

router.use(authenticate);

router.get('/',
  validateQuery(quotationFiltersSchema),
  asyncHandler(async (req, res) => {
    const filters = {
      page: Number(req.query.page) || 1,
      limit: Number(req.query.limit) || 10,
      search: req.query.search as string | undefined,
      approved: req.query.approved === 'true' ? true : req.query.approved === 'false' ? false : undefined,
      sortBy: req.query.sortBy as string || 'createdAt',
      sortOrder: req.query.sortOrder as 'asc' | 'desc' || 'desc',
    };
    const result = await quotationService.findAll(req.user!.id, filters);
    res.json({
      success: true,
      data: result,
    } as PaginatedResponse<Quotation>);
  })
);

router.post('/',
  validate(quotationCreateSchema),
  asyncHandler(async (req, res) => {
    const quotation = await quotationService.create(req.user!.id, req.body);
    res.status(201).json({
      success: true,
      data: quotation,
    } as ApiResponse<Quotation>);
  })
);

router.get('/:id',
  asyncHandler(async (req, res) => {
    const quotation = await quotationService.findById(req.params.id, req.user!.id);
    if (!quotation) {
      res.status(404).json({
        success: false,
        error: { code: '404', message: 'Quotation not found' },
      });
      return;
    }
    res.json({
      success: true,
      data: quotation,
    } as ApiResponse<Quotation>);
  })
);

router.put('/:id',
  validate(quotationUpdateSchema),
  asyncHandler(async (req, res) => {
    const quotation = await quotationService.update(req.params.id, req.user!.id, req.body);
    res.json({
      success: true,
      data: quotation,
    } as ApiResponse<Quotation>);
  })
);

router.delete('/:id',
  asyncHandler(async (req, res) => {
    await quotationService.delete(req.params.id, req.user!.id);
    res.json({
      success: true,
      data: { message: 'Quotation deleted successfully' },
    });
  })
);

router.patch('/:id/approve',
  asyncHandler(async (req, res) => {
    const quotation = await quotationService.approve(req.params.id, req.user!.id);
    res.json({
      success: true,
      data: quotation,
    } as ApiResponse<Quotation>);
  })
);

export { router as quotationRouter };