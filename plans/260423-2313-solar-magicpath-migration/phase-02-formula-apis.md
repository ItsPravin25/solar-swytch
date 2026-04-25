---
title: "Phase 2 - Build Formula API Endpoints"
description: "Create API endpoints for all solar calculation formulas"
status: pending
priority: P1
effort: 4h
phase: 2
---

# Phase 2: Build Formula API Endpoints

## Overview

Build backend API endpoints for all solar calculation formulas from magicpath. These endpoints will handle system sizing, cost calculations, ROI, EMI, and CO2 savings.

## Context Links

- [Phase 1](./phase-01-setup-mongodb.md) - MongoDB setup must complete first
- Reports: [Brainstorm Report](../reports/brainstorm-260423-2313-solar-magicpath-migration.md)

## Key Insights

- All formulas from magicpath are state-based React calculations
- Need to move them to backend service layer
- Create shared calculation utilities used by API endpoints
- Keep formulas consistent between frontend display and API validation

## Formulas from Magicpath

| Formula | Description | Code |
|---------|-------------|------|
| Monthly Generation | `systemKw * 4.5 * 0.75 * 30` | `monthlyKwh = systemKw * peakSunHours * days * pr` |
| Monthly Savings | `monthlyGeneration * unitRate` | `monthlySavings = monthlyKwh * unitRate` |
| Annual Savings | `monthlySavings * 12` | `annualSavings = monthlySavings * 12` |
| Payback Months | `(cost - subsidy) / annualSavings * 12` | `paybackMonths = (systemCost - subsidy) / annualSavings * 12` |
| CO2 Saved | `capacityKw * 4.5 * 0.75 * 365 * 0.71 / 1000` | tonnes per year |
| EMI | `P * r * (1+r)^n / ((1+r)^n - 1)` | standard amortization |
| Suggested Capacity | `avgMonthlyUnits / (30 * 4.5)` | from bill data |
| Panel Count | `systemKw * 1000 / panelWattage` | ceil result |
| System Area | `panelCount * panelAreaSqFt` | roof requirement |
| Quoted Price | `systemCost * 1.2` | 20% margin |

## Requirements

### Functional
- `POST /api/v1/calculations/solar` - System size, panel count, area
- `POST /api/v1/calculations/cost` - Pricing with profit margin
- `POST /api/v1/calculations/roi` - Payback, savings, CO2
- `POST /api/v1/calculations/emi` - Loan EMI
- `POST /api/v1/calculations/suggest-capacity` - From bill data

### Non-functional
- Input validation with Zod
- Consistent decimal precision
- Error handling for edge cases (division by zero)

## Architecture

```
backend/src/
├── lib/
│   └── solar-calculations.ts    # NEW: Shared formula functions
├── routes/
│   └── calculations.ts          # MODIFY: Add new endpoints
├── services/
│   └── calculations.service.ts  # MODIFY: Implement formulas
└── types/
    └── index.ts                # MODIFY: Add Zod schemas
```

## Related Code Files

### Create
- `backend/src/lib/solar-calculations.ts` - Pure calculation functions

### Modify
- `backend/src/routes/calculations.ts` - Add new routes
- `backend/src/services/calculations.service.ts` - Business logic
- `backend/src/types/index.ts` - Zod input/output schemas

## Implementation Steps

1. **Create solar-calculations.ts**
   - Export pure functions for each formula
   - Use constants: PEAK_SUN_HOURS=4.5, PR=0.75, CO2_FACTOR=0.71
   - Handle edge cases (zero values, negative inputs)

2. **Add calculation schemas (types/index.ts)**
   ```typescript
   // Solar sizing input
   const SolarSizingSchema = z.object({
     systemKw: z.number().positive(),
     panelWattage: z.number().positive(),
     panelAreaSqFt: z.number().positive()
   });

   // Cost calculation input
   const CostCalculationSchema = z.object({
     systemKw: z.number().nonnegative(),
     baseCost: z.number().nonnegative(),
     otherExpenses: z.number().nonnegative(),
     profitMargin: z.number().min(0).max(100).default(20)
   });

   // ROI calculation input
   const ROICalculationSchema = z.object({
     systemCost: z.number().positive(),
     subsidyAmount: z.number().nonnegative(),
     monthlyGeneration: z.number().nonnegative(),
     unitRate: z.number().positive()
   });

   // EMI calculation input
   const EMICalculationSchema = z.object({
     loanAmount: z.number().positive(),
     interestRate: z.number().positive(),
     termInYears: z.number().positive()
   });

   // Suggested capacity input
   const SuggestCapacitySchema = z.object({
     monthlyUnits: z.array(z.number().nonnegative())
   });
   ```

3. **Update calculations.service.ts**
   - Import solar-calculations.ts functions
   - Implement service methods for each calculation type
   - Return structured response with all calculated values

4. **Update calculations routes**
   - Add POST /solar-sizing route
   - Add POST /cost route
   - Add POST /roi route
   - Add POST /emi route
   - Add POST /suggest-capacity route

## Constants to Define

```typescript
// In solar-calculations.ts
export const SOLAR_CONSTANTS = {
  PEAK_SUN_HOURS: 4.5,
  PERFORMANCE_RATIO: 0.75,
  DAYS_PER_MONTH: 30,
  DAYS_PER_YEAR: 365,
  CO2_FACTOR_KG_PER_KWH: 0.71,
  PANEL_LIFE_YEARS: 25,
  DEFAULT_SUBSIDY: 78000,
  DEFAULT_PROFIT_MARGIN: 20, // percent
  DEFAULT_UNIT_RATE: 10, // INR per kWh
  PANEL_WATTAGE: {
    'mono-standard': 550,
    'mono-large': 585,
    'topcon': 590
  },
  PANEL_AREA_SQFT: {
    'mono-standard': 17.8,
    'mono-large': 23.7,
    'topcon': 27.6
  }
} as const;
```

## Output Format

All calculation endpoints return:
```typescript
{
  success: true,
  data: {
    // Input echo for verification
    input: { ... },
    // Calculated values
    result: { ... }
  }
}
```

## Todo List

- [ ] Create lib/solar-calculations.ts with pure functions
- [ ] Add Zod schemas to types/index.ts
- [ ] Update calculations.service.ts
- [ ] Add new routes to calculations.ts
- [ ] Test all endpoints

## Success Criteria

- All formulas produce identical results to magicpath frontend
- Input validation rejects invalid data
- Edge cases handled gracefully (zero division, negative values)
- Response format consistent with existing API pattern

## Security Considerations

- Validate all numeric inputs
- Reject extreme values that could cause overflow
- Rate limit calculation endpoints

## Next Steps

Phase 3 depends on: Formula endpoints working, models ready (Phase 1)