import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { prisma } from '../config/database.js';
import { AppError } from './error-handler.js';

export interface JwtPayload {
  userId: string;
  email: string;
  iat: number;
  exp: number;
}

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
      };
    }
  }
}

export function authenticate(req: Request, _res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    throw new AppError('No token provided', 401);
  }

  const token = authHeader.split(' ')[1];

  try {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new AppError('JWT_SECRET not configured', 500);
    }

    const decoded = jwt.verify(token, secret) as JwtPayload;
    req.user = {
      id: decoded.userId,
      email: decoded.email,
    };
    next();
  } catch {
    throw new AppError('Invalid or expired token', 401);
  }
}

export function optionalAuth(req: Request, _res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    return next();
  }

  const token = authHeader.split(' ')[1];

  try {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      return next();
    }

    const decoded = jwt.verify(token, secret) as JwtPayload;
    req.user = {
      id: decoded.userId,
      email: decoded.email,
    };
  } catch {
    // Token invalid, continue without user
  }

  next();
}

export async function getUserById(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      fullName: true,
      phone: true,
      businessType: true,
      role: true,
      companyName: true,
      gstNumber: true,
      address: true,
      state: true,
      city: true,
      pincode: true,
      primaryContact: true,
      alternateContact: true,
      bankName: true,
      accountNumber: true,
      ifscCode: true,
      logoUrl: true,
      profilePhoto: true,
      createdAt: true,
    },
  });

  if (!user) {
    throw new AppError('User not found', 404);
  }

  return user;
}