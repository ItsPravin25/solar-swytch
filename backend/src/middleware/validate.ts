import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';
import { AppError } from './error-handler.js';

export function validate(schema: ZodSchema) {
  return async (req: Request, _res: Response, next: NextFunction) => {
    try {
      const data = schema.parse(req.body);
      req.body = data;
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const messages = error.errors.map((e) => `${e.path.join('.')}: ${e.message}`);
        throw new AppError(messages.join(', '), 400);
      }
      next(error);
    }
  };
}

export function validateQuery(schema: ZodSchema) {
  return async (req: Request, _res: Response, next: NextFunction) => {
    try {
      const data = schema.parse(req.query);
      req.query = data as Record<string, string>;
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const messages = error.errors.map((e) => `${e.path.join('.')}: ${e.message}`);
        throw new AppError(messages.join(', '), 400);
      }
      next(error);
    }
  };
}

export function validateParams(schema: ZodSchema) {
  return async (req: Request, _res: Response, next: NextFunction) => {
    try {
      const data = schema.parse(req.params);
      req.params = data as Record<string, string>;
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const messages = error.errors.map((e) => `${e.path.join('.')}: ${e.message}`);
        throw new AppError(messages.join(', '), 400);
      }
      next(error);
    }
  };
}