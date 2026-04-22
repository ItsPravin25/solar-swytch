# Phase 6: Pricing Setup

**Context:** Previous research report `research/dashboard-analysis-report.md`  
**Depends on:** Phase 3 (Dashboard Layout)

## Overview
| Item | Value |
|------|-------|
| Priority | MEDIUM |
| Status | COMPLETED |
| Effort | Medium |

Implement pricing management for solar systems with inline editing for different capacities and phases.

## Key Insights

- **10 Capacity Options:** 1kW to 10kW
- **2 Phase Types:** 1-Phase, 3-Phase
- **Inline Editing:** Edit rows directly in the table
- **Phase Rules:** 1-4kW = 1-Phase, 8-10kW = 3-Phase, 5-7kW = Both

## Requirements

### Pricing Table

**Columns:**
| Column | Description |
|--------|-------------|
| Capacity | kW value (1-10) |
| Phase | 1-Phase or 3-Phase indicator |
| Panel Cost | INR |
| Inverter Cost | INR |
| Structure Cost | INR |
| Cable Cost | INR |
| Other Cost | INR |
| Total | Sum of all costs |
| Status | Pending/Complete badge |
| Actions | Edit/Save/Cancel |

### Phase Configuration
```
1kW: 1-Phase only
2kW: 1-Phase only
3kW: 1-Phase only (3-Phase pending)
4kW: 1-Phase only (3-Phase pending)
5kW: Both (1-Phase, 3-Phase)
6kW: Both
7kW: Both
8kW: 3-Phase only
9kW: 3-Phase only
10kW: 3-Phase only
```

### Features
- Edit button → inline editing mode
- Save/Cancel in editing mode
- Total auto-calculates
- Status badge shows completion
- Filter by phase (All, 1-Phase, 3-Phase)

## Architecture

### File Structure
```
app/dashboard/pricing/
└── page.tsx               # Pricing page

components/dashboard/
├── pricing-table.tsx        # Main table with inline editing
├── pricing-row.tsx         # Single row with edit mode
├── pricing-cell.tsx        # Editable cell
└── pricing-summary.tsx     # Summary at bottom
```

### Data Model
```typescript
interface PricingRow {
  id: string;
  capacity: string;      // '1kW', '2kW', etc.
  phase: 'single' | 'three';
  panelCost: number;
  inverterCost: number;
  structureCost: number;
  cableCost: number;
  otherCost: number;
}

interface PricingState {
  rows: PricingRow[];
  editingId: string | null;
  filter: 'all' | 'single' | 'three';
}
```

## Implementation Steps

1. **Create pricing table component**
   - Filter tabs (All, 1-Phase, 3-Phase)
   - Scrollable table body
   - Sticky header

2. **Build pricing row with edit mode**
   - Display mode: formatted values
   - Edit mode: input fields
   - Total auto-calculate

3. **Add phase status indicators**
   - Green checkmark for complete
   - Gray clock for pending

4. **Implement save functionality**
   - Validate all fields
   - Update state
   - Show success toast

5. **Add filter functionality**
   - Filter by phase type
   - Maintain editing state across filters

## Related Code Files

| File | Action |
|------|--------|
| `components/dashboard/pricing-table.tsx` | Create |
| `components/dashboard/pricing-row.tsx` | Create |
| `components/dashboard/pricing-summary.tsx` | Create |
| `app/dashboard/pricing/page.tsx` | Create |

## Todo List

- [x] Create pricing table with columns
- [x] Build editable row component
- [x] Add inline editing mode
- [x] Implement phase filtering
- [x] Add status badges
- [x] Create summary row
- [x] Test edit/save flow

## Success Criteria

1. Table displays all 10 capacity options
2. Inline editing works for all cost fields
3. Total auto-calculates correctly
4. Phase filter works
5. Status shows completion state
6. Save persists changes

## Next Steps

→ Phase 5: Create Quotation (uses pricing data)  
→ Phase 7: Settings views