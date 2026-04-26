import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { config } from 'dotenv';
import { connectDatabase } from './config/mongodb.ts';
import { errorHandler } from './middleware/error-handler.ts';
import { apiLogger, getApiLogs } from './middleware/api-logger.ts';
import { authRouter } from './routes/auth.ts';
import { quotationRouter } from './routes/quotations.ts';
import { pricingRouter } from './routes/pricing.ts';
import { profileRouter } from './routes/profile.ts';
import { settingsRouter } from './routes/settings.ts';
import { calculationsRouter } from './routes/calculations.ts';

config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(helmet());
// Parse CORS_ORIGIN env var (comma-separated) into array
const corsOrigins = (process.env.CORS_ORIGIN || 'http://localhost:3000').split(',').map(s => s.trim());
app.use(cors({
  origin: corsOrigins,
  credentials: true,
}));
app.use(morgan('dev'));
app.use(apiLogger);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (_, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API Logs endpoint (for debugging)
app.get('/api/v1/logs', (_, res) => {
  res.json({ success: true, data: getApiLogs() });
});

// API Routes
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/quotations', quotationRouter);
app.use('/api/v1/pricing', pricingRouter);
app.use('/api/v1/profile', profileRouter);
app.use('/api/v1/settings', settingsRouter);
app.use('/api/v1/calculations', calculationsRouter);

// Error handler
app.use(errorHandler);

// Start server
async function start() {
  await connectDatabase();
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`API: http://localhost:${PORT}/api/v1`);
  });
}

start();

export default app;