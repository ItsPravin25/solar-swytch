---
title: "Phase 1 - Setup MongoDB + Mongoose"
description: "Switch backend from PostgreSQL/Prisma to MongoDB/Mongoose"
status: pending
priority: P1
effort: 2h
phase: 1
---

# Phase 1: Setup MongoDB + Mongoose

## Overview

Switch backend from PostgreSQL/Prisma to MongoDB/Mongoose. Remove Prisma dependencies, install Mongoose, define schemas, and update connection config.

## Key Insights

- Mongoose provides flexible schema modeling
- Keep TypeScript interfaces for type safety
- Preserve existing Express routes structure
- No PostgreSQL-specific queries to rewrite (was using Prisma ORM abstraction)

## Requirements

### Functional
- MongoDB connection via Mongoose
- User schema with profile, GST, bank details
- Quotation schema with customer, technical, financial info
- Pricing schema for component costs
- Settings schema for GST/panel configurations

### Non-functional
- Connection string via environment variable
- Graceful reconnection handling
- Indexes for query performance

## Architecture

```
backend/src/
├── config/
│   └── mongodb.ts          # NEW: Mongoose connection
├── models/
│   ├── user.model.ts       # NEW: User Mongoose model
│   ├── quotation.model.ts  # NEW: Quotation Mongoose model
│   ├── pricing.model.ts    # NEW: Pricing Mongoose model
│   └── settings.model.ts   # NEW: Settings Mongoose model
├── routes/                 # EXISTING: Update to use models
├── services/               # EXISTING: Update to use models
└── index.ts                # EXISTING: Update connection
```

## Related Code Files

### Create
- `backend/src/config/mongodb.ts` - Mongoose connection config
- `backend/src/models/user.model.ts` - User schema
- `backend/src/models/quotation.model.ts` - Quotation schema
- `backend/src/models/pricing.model.ts` - Pricing schema
- `backend/src/models/settings.model.ts` - Settings schema

### Modify
- `backend/src/index.ts` - Update database connection
- `backend/src/types/index.ts` - Add MongoDB types
- `backend/package.json` - Remove Prisma, add Mongoose
- `backend/.env.example` - Update DATABASE_URL for MongoDB

### Delete
- `backend/src/config/database.ts` - Remove Prisma client
- `backend/prisma/schema.prisma` - Remove Prisma schema
- `backend/prisma/migrations/` - Remove migrations

## Implementation Steps

1. **Update dependencies**
   ```bash
   cd backend
   npm uninstall prisma @prisma/client
   npm install mongoose @types/mongoose
   ```

2. **Create MongoDB connection config**
   - New file: `config/mongodb.ts`
   - Connect to MongoDB URI
   - Handle connection events (connected, error, disconnected)
   - Export Mongoose instance

3. **Create User model**
   - Fields: email, password, firstName, lastName, phone, address, companyName, gstNo, logo, bankName, accountNo, ifsc, panelTypes[], createdAt, updatedAt
   - Indexes on email (unique)

4. **Create Quotation model**
   - Fields: userId, customer (firstName, lastName, phone, address, location, consumerNo), technical (systemCapacity, systemType, panelType, roofType, roofLength, roofWidth, phase), financial (monthlyGeneration, monthlySavings, annualSavings, subsidyAmount, actualInvestment, paybackYears, amount, unitRate, profitMargin, profitPct), status, createdAt, updatedAt

5. **Create Pricing model**
   - Fields: userId, capacity, phase, components (module, inverter, structure, wiring, installation), totalCost, createdAt, updatedAt

6. **Create Settings model**
   - Fields: userId, gstPercentage, subsidyAmount, panelTypes[], createdAt, updatedAt

7. **Update index.ts**
   - Remove Prisma client import
   - Add MongoDB connection import
   - Connect on app startup

8. **Update environment files**
   - Update `.env.example` with MongoDB URI format
   - Remove DATABASE_URL PostgreSQL format

## Todo List

- [ ] Update backend/package.json dependencies
- [ ] Create mongodb.ts connection config
- [ ] Create user.model.ts
- [ ] Create quotation.model.ts
- [ ] Create pricing.model.ts
- [ ] Create settings.model.ts
- [ ] Update index.ts connection
- [ ] Update .env.example

## Success Criteria

- Backend connects to MongoDB on startup
- All models have proper indexes
- Existing routes structure preserved
- Environment variables updated

## Security Considerations

- MongoDB connection string not logged
- Password hashing with bcrypt (existing)
- Input validation with Zod (existing)

## Next Steps

Phase 2 depends on: MongoDB connection working, models defined