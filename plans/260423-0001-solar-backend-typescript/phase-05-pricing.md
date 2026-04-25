# Phase 5: Pricing Management

**Context:** Phase 4 (Quotations) complete  
**Depends on:** Phase 4

## Overview
| Item | Value |
|------|-------|
| Priority | HIGH |
| Status | PENDING |
| Effort | Medium |

Manage pricing for 10 capacity options (1-10kW) with 1-phase and 3-phase variants.

---

## Requirements

### Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | /api/v1/pricing | Get all pricing entries |
| PUT | /api/v1/pricing | Bulk update pricing |
| PUT | /api/v1/pricing/:id | Update single pricing |

### Pricing Structure
```
1kW: 1-Phase only
2kW: 1-Phase only
3kW: 1-Phase only
4kW: 1-Phase only
5kW: Both (1-Phase, 3-Phase)
6kW: Both
7kW: Both
8kW: 3-Phase only
9kW: 3-Phase only
10kW: 3-Phase only
```

### Request Format
```typescript
{
  capacity: string;    // '1kW' to '10kW'
  phase: 'single' | 'three';
  panelCost: number;
  inverterCost: number;
  structureCost: number;
  cableCost: number;
  otherCost: number;
}
```

### Response Format
```typescript
{
  id: string;
  capacity: string;
  phase: string;
  panelCost: number;
  inverterCost: number;
  structureCost: number;
  cableCost: number;
  otherCost: number;
  totalCost: number;    // sum of all costs
  status: 'pending' | 'complete';
}
```

---

## Auto-calculations

- **totalCost** = panelCost + inverterCost + structureCost + cableCost + otherCost
- **status** = 'complete' if all costs > 0, else 'pending'

---

## Architecture

### File Structure
```
backend/src/
├── routes/pricing.ts
├── services/pricing.service.ts
└── validators/pricing.validator.ts
```

---

## Implementation Steps

1. **Create pricing types**
2. **Create Zod validators**
3. **Create pricing service**
4. **Create pricing routes**
5. **Implement bulk update**
6. **Implement total calculation**

---

## Todo List

- [ ] Create pricing types
- [ ] Create Zod validators
- [ ] Create pricing service
- [ ] Create GET /pricing
- [ ] Create PUT /pricing (bulk)
- [ ] Create PUT /pricing/:id (single)
- [ ] Auto-calculate totals
- [ ] Set status based on completion

---

## Success Criteria

1. GET returns all 10+ pricing entries for user
2. Bulk update handles multiple entries
3. Total auto-calculates
4. Status reflects completion state

---

## Next Steps

→ Phase 6: User Profile
