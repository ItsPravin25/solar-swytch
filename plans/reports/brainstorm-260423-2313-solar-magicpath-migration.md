---
name: solar-magicpath-migration
description: Full migration from magicpath frontend + MongoDB backend
type: report
---

# Solar Swytch - Magicpath Migration Brainstorm

**Date:** 2026-04-23  
**Scope:** Full migration (frontend + backend)  
**Database:** MongoDB (switching from PostgreSQL)  
**Approach:** Backend APIs + adapted frontend together

---

## Source Analysis

### Magicpath Frontend (Vite + React + TypeScript)
- **Dashboard:** SolarDashboard.tsx (~47K lines) with multiple sections
- **Onboarding:** 4-step registration flow (account, role, profile, location)
- **Quotation Wizard:** 3-step (customer, technical, financial)
- **Formulas:** All solar calculations embedded in React components

### Existing Solar Backend (Express + TypeScript + PostgreSQL/Prisma)
- API structure already in place (auth, quotations, pricing, settings, calculations)
- JWT authentication
- Zod validation

---

## Key Formulas from Magicpath

| Formula | Description |
|---------|-------------|
| `monthlyGeneration = systemKw * 4.5 * 0.75 * 30` | Energy generation per month |
| `areaCalc = panelCount * panelArea` | Roof area requirement |
| `systemCost = basePrice + otherExpenses` | Total system cost |
| `quotedPrice = systemCost * 1.2` | 20% profit margin |
| `monthlySavings = monthlyGeneration * unitRate` | Monthly savings |
| `paybackMonths = (cost - subsidy) / annualSavings * 12` | ROI payback period |
| `co2Saved = capacityKw * 4.5 * 0.75 * 365 * 0.71 / 1000` | CO2 in tonnes |
| `emi = P * r * (1+r)^n / ((1+r)^n - 1)` | EMI calculation |
| `suggestedCapacity = avgMonthlyUnits / (30 * 4.5)` | From bill data |

---

## Color Scheme (To Preserve)

| Role | Hex |
|------|-----|
| Primary Purple | `#7C5CFC` |
| Navy Blue | `#0B1E3D` |
| Success Green | `#22C55E` |
| Warning Orange | `#FFB800` |
| Error Red | `#E8533A` |
| Background | `#F8FAFC` |

---

## Recommended Architecture

### Backend (MongoDB)
```
backend/src/
├── index.ts
├── config/
│   └── mongodb.ts
├── models/              # Mongoose models
│   ├── User.ts
│   ├── Quotation.ts
│   ├── Pricing.ts
│   └── Settings.ts
├── routes/              # Express routes
├── services/            # Business logic + formulas
└── middleware/
```

### Frontend (Next.js - keep existing structure)
```
frontnend/src/
├── app/dashboard/
│   ├── page.tsx          # Main dashboard
│   ├── quotation/new/    # Quotation wizard
│   └── settings/        # Settings pages
├── components/
│   ├── dashboard/        # Migrated components
│   └── auth/
└── lib/
    ├── api.ts           # API client
    └── calculations.ts   # Shared formula constants
```

---

## Implementation Strategy

### Phase 1: MongoDB Backend Setup
- Switch Prisma to Mongoose
- Define schemas matching magicpath data model
- Migrate all formulas to service layer
- Keep API structure consistent

### Phase 2: Formula API Endpoints
- `POST /api/calculations/solar` - system size, area, panel count
- `POST /api/calculations/cost` - pricing with profit margin
- `POST /api/calculations/roi` - payback, savings, CO2
- `POST /api/calculations/emi` - loan EMI
- `POST /api/calculations/suggested-capacity` - from bill data

### Phase 3: Frontend Migration
- Adapt SolarDashboard.tsx logic to React components
- Replace sample data with API calls
- Update color scheme to magicpath theme
- Keep shadcn/ui structure

---

## Key Decisions

| Decision | Rationale |
|----------|-----------|
| Keep Next.js frontend | Existing project structure is solid |
| Switch to MongoDB | User requirement + flexible schema for quotation data |
| Migrate all magicpath sections | Dashboard, Quotation, Pricing, Settings, Profile |
| Preserve purple theme | User explicitly requested same colors/theme |

---

## Risks & Mitigations

| Risk | Mitigation |
|------|------------|
| Large component (47K lines) | Split into smaller, modular components |
| Formula discrepancies | Create shared `calculations.ts` used by both |
| Theme inconsistency | Define CSS variables for all colors |
| Data migration | Re-seed data from magicpath sample data |

---

## Success Metrics

- All magicpath formulas working via API
- Dashboard KPIs load from MongoDB
- Quotation wizard creates records in database
- Theme colors match magicpath exactly
- All existing tests pass

---

## Next Steps

1. Create detailed implementation plan with phases
2. Start MongoDB setup and schema design
3. Build formula API endpoints
4. Migrate frontend components section by section
5. Test end-to-end flow with real data