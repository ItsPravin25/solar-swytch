---
title: "Magicpath Frontend Integration"
description: "Integrate magicpath Vite/React frontend (port 5173) with existing MongoDB backend (port 5000)"
status: completed
priority: P1
effort: 4h
created: 2026-04-25
---

# Magicpath Frontend Integration Plan

## Overview

Replace current Next.js frontnend with magicpath Vite/React frontend. Magicpath runs on `localhost:5173`, backend on `localhost:5000`. Backend already has MongoDB models, we need to ensure API matches magicpath frontend expectations.

## Current State

**Magicpath Frontend** (`C:/Users/Admin/Downloads/magicpath-extracted/`)
- Framework: Vite + React + TypeScript
- Port: 5173
- Components:
  - `SolarDashboard.tsx` - Main dashboard (167KB)
  - `SolarOnboarding.tsx` - Onboarding
  - `SolarSwytch.tsx` - Main wrapper
  - `UserProfilePanel.tsx` - User profile

**Backend** (`C:/Pravin/Project/Solar/backend/`)
- Framework: Express + TypeScript
- Port: 5000
- Database: MongoDB (Mongoose)
- Models: User, Quotation, Pricing, Settings

## Phases

| # | Phase | Status | Effort |
|---|-------|--------|--------|
| 1 | Copy magicpath to project | Pending | 15m |
| 2 | Analyze magicpath API calls | Pending | 30m |
| 3 | Update backend API routes | Pending | 2h |
| 4 | Connect frontend to backend | Pending | 1h |
| 5 | Test end-to-end flow | Pending | 15m |

## Implementation Steps

### Phase 1: Copy Magicpath to Project

1. Copy `magicpath-extracted/` to `C:/Pravin/Project/Solar/magicpath-frontend/`
2. Keep existing `frontnend/` as backup
3. Update `package.json` name to `magicpath-frontend`

### Phase 2: Analyze Magicpath API Calls

Read magicpath components to find all API calls:
- Search for `fetch`, `axios`, `/api`, `localhost` patterns
- Identify which endpoints magicpath expects
- Map to existing backend routes or plan new ones

Expected API patterns from magicpath:
```
POST /api/auth/login
POST /api/auth/register
GET /api/dashboard
POST /api/quotations
GET /api/quotations/:id
PUT /api/quotations/:id
GET /api/settings
PUT /api/settings
POST /api/calculations/solar-sizing
```

### Phase 3: Update Backend API Routes

Ensure backend has all routes magicpath needs:

1. **Auth routes** (already exist)
   - POST /api/v1/auth/login
   - POST /api/v1/auth/register
   - GET /api/v1/auth/me

2. **Dashboard/Quotation routes** (need to verify/create)
   - GET /api/v1/quotations (list with userId filter)
   - POST /api/v1/quotations (create)
   - GET /api/v1/quotations/:id
   - PUT /api/v1/quotations/:id
   - DELETE /api/v1/quotations/:id

3. **Settings routes** (already exist)
   - GET /api/v1/settings
   - PUT /api/v1/settings

4. **Calculation routes** (already exist from Phase 2)
   - POST /api/v1/calculations/solar-sizing
   - POST /api/v1/calculations/cost
   - POST /api/v1/calculations/roi
   - POST /api/v1/calculations/emi

### Phase 4: Connect Frontend to Backend

1. Update magicpath `src/lib/api.ts` or create one
2. Set base URL to `http://localhost:5000/api/v1`
3. Add JWT token handling
4. Update CORS in backend to allow localhost:5173

### Phase 5: Test

1. Run backend: `cd backend && npm run dev` (port 5000)
2. Run frontend: `cd magicpath-frontend && yarn dev` (port 5173)
3. Test registration/login flow
4. Test quotation creation
5. Verify data in MongoDB

## Database Structure (Already Good)

User model has: email, password, fullName, phone, companyName, gstNumber, address, bank details
Quotation model has: customer info, technical info, financial info

## Success Criteria

- Frontend runs on localhost:5173
- Backend runs on localhost:5000
- User can register/login
- Quotation creation saves to MongoDB
- Data flows correctly between frontend and backend