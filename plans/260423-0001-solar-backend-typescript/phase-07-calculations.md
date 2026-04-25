# Phase 7: Financial Calculations

**Context:** Phase 6 (Profile) complete  
**Depends on:** Phase 6

## Overview
| Item | Value |
|------|-------|
| Priority | HIGH |
| Status | PENDING |
| Effort | Medium |

Server-side financial calculations for ROI, EMI, and solar metrics.

---

## Requirements

### Endpoints

| Method | Path | Description |
|--------|------|-------------|
| POST | /api/v1/calculations/roi | Calculate ROI metrics |
| POST | /api/v1/calculations/emi | Calculate EMI |
| POST | /api/v1/calculations/solar | Calculate solar generation |
| POST | /api/v1/calculations/panels | Calculate panel requirements |

### ROI Calculation
```typescript
// Request
{
  systemKw: number;
  systemCost: number;
  unitRate: number;       // default 6.0
  subsidyAmount?: number;  // default 78000
}

// Response
{
  monthlyGeneration: number;
  monthlySavings: number;
  annualSavings: number;
  actualInvestment: number;
  paybackYears: number;
  paybackMonths: number;
  totalSavings: number;
  co2Saved: string;
}
```

### EMI Calculation
```typescript
// Request
{
  principal: number;
  annualRate: number;
  years: number;
}

// Response
{
  emi: number;
  totalPayable: number;
  totalInterest: number;
}
```

### Solar Calculation
```typescript
// Request
{
  systemKw: number;
  panelType: PanelType;
  unitRate: number;
}

// Response
{
  monthlyGeneration: number;
  monthlySavings: number;
  annualSavings: number;
  numPanels: number;
  systemArea: number;
  availableArea: number;
  shortfall: number;
}
```

### Panel Calculation
```typescript
// Request
{
  systemKw: number;
  panelType: PanelType;
  areaLength?: number;
  areaWidth?: number;
}

// Response
{
  numPanels: number;
  panelWattage: number;
  systemArea: number;
  availableArea: number;
  shortfall: number;
  isFeasible: boolean;
}
```

---

## Constants

```typescript
const PEAK_SUN_HOURS = 4.5;
const PERFORMANCE_RATIO = 0.75;
const DAYS_PER_MONTH = 30;
const CO2_FACTOR_KG_PER_KWH = 0.71;
const PANEL_LIFE_YEARS = 25;
const DEFAULT_SUBSIDY = 78000;
```

---

## Architecture

### File Structure
```
backend/src/
├── routes/calculations.ts
└── services/calculations.service.ts
```

---

## Implementation Steps

1. **Create calculation types**
2. **Create calculations service**
3. **Implement ROI calculation**
4. **Implement EMI calculation**
5. **Implement solar generation**
6. **Implement panel requirements**
7. **Create calculation routes**

---

## Todo List

- [ ] Create calculation types
- [ ] Create calculations service
- [ ] Implement ROI formula
- [ ] Implement EMI formula
- [ ] Implement CO2 calculation
- [ ] Implement panel sizing
- [ ] Create POST /calculations/roi
- [ ] Create POST /calculations/emi
- [ ] Create POST /calculations/solar
- [ ] Create POST /calculations/panels

---

## Success Criteria

1. ROI calculation matches frontend exactly
2. EMI calculation matches frontend exactly
3. Solar generation uses correct constants
4. Panel sizing accounts for area constraints

---

## Next Steps

→ Phase 8: Settings Endpoints
