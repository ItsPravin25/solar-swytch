import { Request, Response, NextFunction } from 'express';

interface LogEntry {
  timestamp: string;
  method: string;
  path: string;
  statusCode?: number;
  duration?: number;
  userId?: string;
  body?: unknown;
}

const logs: LogEntry[] = [];
const MAX_LOGS = 100;

export const apiLogger = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  const logEntry: LogEntry = {
    timestamp: new Date().toISOString(),
    method: req.method,
    path: req.path,
    userId: (req as any).user?.id,
  };

  res.on('finish', () => {
    logEntry.statusCode = res.statusCode;
    logEntry.duration = Date.now() - start;
    logs.unshift(logEntry);
    if (logs.length > MAX_LOGS) logs.pop();

    // Console output for dev visibility
    const statusColor = logEntry.statusCode && logEntry.statusCode < 400 ? '\x1b[32m' : '\x1b[31m';
    console.log(`${statusColor}${logEntry.method} ${logEntry.path} ${logEntry.statusCode} ${logEntry.duration}ms\x1b[0m`);
  });

  next();
};

// Endpoint to get logs (for debugging)
export const getApiLogs = (): LogEntry[] => logs.slice(0, 50);

export default apiLogger;
