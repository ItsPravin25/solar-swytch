# Solar Swytch Backend - TypeScript Implementation Plan

**Project:** Solar Swytch Backend API  
**Stack:** Node.js + Express + TypeScript + Prisma + PostgreSQL  
**Date:** 2026-04-23  
**Mode:** Hard (Parallel Research + Red Team)  
**Frontend:** Next.js 16 + shadcn/ui (existing at `frontnend/`)

---

## Overview

Create a production-ready TypeScript backend for the Solar Swytch B2B solar business management platform. The backend will handle authentication, quotation management, pricing, user profiles, and financial calculations with PostgreSQL database.

## Key Features

- **Authentication:** JWT-based auth with login/register, password hashing
- **Quotation Management:** Full CRUD for quotations with workflow states
- **Pricing Management:** 10 capacity options (1-10kW) with phase types
- **User Profile:** Company info, GST, bank details, location
- **Financial Calculations:** ROI, EMI, GST, CO2 savings (server-side)
- **Settings:** GST percentage, panel types, loan calculator

---

## Phases

| Phase | Description | Status |
|-------|-------------|--------|
| [phase-01-setup.md](phase-01-setup.md) | Project init, dependencies, database config | COMPLETED |
| [phase-02-schema.md](phase-02-schema.md) | Prisma schema for all entities | COMPLETED |
| [phase-03-auth.md](phase-03-auth.md) | Authentication API routes | COMPLETED |
| [phase-04-quotations.md](phase-04-quotations.md) | Quotation CRUD endpoints | COMPLETED |
| [phase-05-pricing.md](phase-05-pricing.md) | Pricing management endpoints | COMPLETED |
| [phase-06-profile.md](phase-06-profile.md) | User profile endpoints | COMPLETED |
| [phase-07-calculations.md](phase-07-calculations.md) | Server-side financial calculations | COMPLETED |
| [phase-08-settings.md](phase-08-settings.md) | Settings endpoints | COMPLETED |
| [phase-09-integration.md](phase-09-integration.md) | Frontend-backend integration | COMPLETED |

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Runtime | Node.js 20+ |
| Framework | Express.js |
| Language | TypeScript |
| ORM | Prisma |
| Database | PostgreSQL |
| Auth | JWT + bcrypt |
| Validation | Zod |
| Docs | Swagger/OpenAPI |
| Tests | Jest + Supertest |

---

## API Design

### Base URL
```
/api/v1
```

### Endpoints

| Method | Path | Description |
|--------|------|-------------|
| POST | /auth/register | User registration |
| POST | /auth/login | User login |
| POST | /auth/logout | Logout |
| GET | /auth/me | Get current user |
| GET | /quotations | List quotations |
| POST | /quotations | Create quotation |
| GET | /quotations/:id | Get quotation |
| PUT | /quotations/:id | Update quotation |
| DELETE | /quotations/:id | Delete quotation |
| PATCH | /quotations/:id/approve | Approve quotation |
| GET | /pricing | Get pricing list |
| PUT | /pricing | Update pricing |
| GET | /profile | Get user profile |
| PUT | /profile | Update user profile |
| GET | /settings/gst | Get GST settings |
| PUT | /settings/gst | Update GST settings |
| GET | /settings/technical | Get panel types |
| PUT | /settings/technical | Update panel types |
| POST | /calculations/roi | Calculate ROI |
| POST | /calculations/emi | Calculate EMI |

---

## File Structure

```
backend/
├── src/
│   ├── index.ts                 # Express app entry
│   ├── config/
│   │   └── database.ts          # Prisma client
│   ├── middleware/
│   │   ├── auth.ts              # JWT verification
│   │   ├── error.ts             # Error handler
│   │   └── validation.ts        # Zod validation
│   ├── routes/
│   │   ├── auth.ts
│   │   ├── quotations.ts
│   │   ├── pricing.ts
│   │   ├── profile.ts
│   │   ├── settings.ts
│   │   └── calculations.ts
│   ├── services/
│   │   ├── auth.service.ts
│   │   ├── quotation.service.ts
│   │   ├── pricing.service.ts
│   │   ├── profile.service.ts
│   │   └── calculations.service.ts
│   ├── validators/
│   │   ├── auth.validator.ts
│   │   ├── quotation.validator.ts
│   │   └── profile.validator.ts
│   └── types/
│       └── index.ts
├── prisma/
│   └── schema.prisma
├── tests/
│   └── *.test.ts
├── package.json
└── tsconfig.json
```

---

## Next Steps

→ Run `planner` subagent to create detailed phase files  
→ Red team review  
→ Validation  
→ Cook command: `/ck:cook --parallel --auto C:/Pravin/Project/Solar/plans/260423-0001-solar-backend-typescript/plan.md`
