import { Router } from 'express';
import { Boq } from '../models/boq.model.js';
import { asyncHandler } from '../middleware/error-handler.js';

const router = Router();

router.get(
  '/',
  asyncHandler(async (_req, res) => {
    const items = await Boq.find({}).select('boqKey').sort({ boqKey: 'asc' }).lean();
    res.json({ success: true, data: items });
  })
);

router.get(
  '/:key',
  asyncHandler(async (req, res) => {
    const item = await Boq.findOne({ boqKey: req.params.key }).lean();
    if (!item) {
      res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: `BOQ not found for key: ${req.params.key}` },
      });
      return;
    }
    res.json({ success: true, data: item });
  })
);

router.post(
  '/',
  asyncHandler(async (req, res) => {
    const { boqKey, rows } = req.body as { boqKey: string; rows: unknown[] };
    if (!boqKey) {
      res.status(400).json({
        success: false,
        error: { code: 'BAD_REQUEST', message: 'boqKey is required' },
      });
      return;
    }
    const item = await Boq.findOneAndUpdate(
      { boqKey },
      { $set: { rows: rows || [] } },
      { upsert: true, new: true, lean: true }
    );
    res.json({ success: true, data: item });
  })
);

export { router as boqRouter };
