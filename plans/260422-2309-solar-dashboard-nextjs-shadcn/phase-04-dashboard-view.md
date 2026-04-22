# Phase 4: Dashboard View - KPIs & Quotations Table

**Context:** Previous research report `research/dashboard-analysis-report.md`  
**Depends on:** Phase 3 (Dashboard Layout)

## Overview
| Item | Value |
|------|-------|
| Priority | HIGH |
| Status | COMPLETED |
| Effort | High |

Implement the main dashboard view with KPI cards, donut chart, and recent quotations table.

## Key Insights

- **4 KPI Cards:** Total Quotations, Approved, Total Savings, CO2 Saved
- **Donut Chart:** Approved vs Pending ratio visualization
- **Quotations Table:** Filterable list with actions
- **Data-driven:** Components only show when data exists

## Requirements

### KPI Cards
1. **Total Quotations**
   - Value: Number count
   - Label: "Quotations"
   - Gradient: Dark navy (#0B1E3D to #133366)

2. **Approved**
   - Value: Number count
   - Label: "Approved"
   - Gradient: Green (#22C55E to #16A34A)

3. **Total Savings**
   - Value: INR formatted (₹X,XX,XXX)
   - Label: "Total Savings"
   - Gradient: Green (#22C55E to #16A34A)

4. **CO2 Saved**
   - Value: Tonnes (e.g., "12.5")
   - Label: "tonnes CO2/yr"
   - Icon: Leaf
   - Gradient: Green (#22C55E to #16A34A)

### Donut Chart (Custom SVG)
- Size: 110x110px
- Center text: Total count
- Green segment: Approved (calculated percentage)
- Blue segment: Pending
- Legend below with counts

### Quotations Table

**Filter Tabs:**
- All
- Approved
- Pending

**Table Columns:**
| Column | Content |
|--------|---------|
| Customer | First + Last name with avatar |
| System | Capacity + System type |
| Amount | INR formatted |
| Status | Chip (Approved=green, Pending=blue) |
| Date | Formatted date + time |
| Actions | Eye, Download, Edit icons |

**Pagination:**
- 10 items per page
- Previous/Next buttons
- Page number display

**Empty State:**
- "No quotations yet" message
- "Create your first quotation" CTA

## Architecture

### File Structure
```
app/dashboard/
├── page.tsx               # Dashboard view (main content)

components/dashboard/
├── dashboard-view.tsx      # Main dashboard container
├── kpi-card.tsx           # Single KPI card
├── kpi-grid.tsx           # 4-card grid layout
├── donut-chart.tsx        # SVG donut chart
├── quotations-table.tsx   # Table with filters
├── quotation-row.tsx      # Single table row
├── status-chip.tsx        # Approved/Pending badge
├── empty-state.tsx        # No data state
└── pagination.tsx         # Pagination controls
```

### Data Model
```typescript
interface QuotationDetail {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  address: string;
  location: string;
  consumerNo: string;
  sanctionLoad: string;
  siteType: string;
  billingType: string;
  avgMonthlyUnits: number;
  systemCapacity: string;
  systemType: SystemType;
  panelType: string;
  roofType: string;
  numPanels: number;
  dateTime: string;
  amount: string;
  approved: boolean;
}

type SystemType = 'on-grid' | 'off-grid' | 'hybrid';
```

### Calculations
```typescript
// CO2 Saved = Capacity * 4.5 * 0.75 * 365 * 0.71 / 1000 tonnes
const calcCO2 = (capacityKw: number) => {
  return (capacityKw * 4.5 * 0.75 * 365 * 0.71 / 1000).toFixed(2);
};

// INR formatting
const formatINR = (n: number) => `₹${n.toLocaleString('en-IN')}`;
```

## Implementation Steps

1. **Create KPI Grid**
   - 4 cards in responsive grid (2x2 on mobile, 4x1 on desktop)
   - Each card with gradient background
   - Icon + label + value

2. **Build Donut Chart**
   - Custom SVG component (no external lib)
   - Calculate percentages from data
   - Animated stroke-dasharray transition

3. **Create Quotations Table**
   - Filter tabs at top
   - Table with sticky header
   - Row actions (view, download, edit)
   - Pagination at bottom

4. **Add Empty State**
   - Show when no quotations
   - CTA button to create quotation

5. **Wire Up Data**
   - Mock data for demo
   - Real calculations for savings/CO2

## Related Code Files

| File | Action |
|------|--------|
| `components/dashboard/kpi-card.tsx` | Create |
| `components/dashboard/kpi-grid.tsx` | Create |
| `components/dashboard/donut-chart.tsx` | Create |
| `components/dashboard/quotations-table.tsx` | Create |
| `components/dashboard/quotation-row.tsx` | Create |
| `components/dashboard/status-chip.tsx` | Create |
| `components/dashboard/pagination.tsx` | Create |
| `components/dashboard/empty-state.tsx` | Create |
| `app/dashboard/page.tsx` | Create |

## Todo List

- [x] Create KPI card component with gradient
- [x] Build KPI grid with 4 cards
- [x] Implement SVG donut chart
- [x] Create quotations table with filters
- [x] Add status chips (Approved/Pending)
- [x] Implement pagination
- [x] Add empty state
- [x] Wire up mock data
- [x] Test responsive at 375px, 768px, 1024px

## Success Criteria

1. 4 KPI cards display with correct values
2. Donut chart shows accurate percentages
3. Table filters work (All/Approved/Pending)
4. Pagination functional
5. Row actions trigger modals
6. Empty state shows when no data
7. Responsive at all breakpoints

## Risk Assessment

| Risk | Mitigation |
|------|------------|
| Complex calculations | Create utility functions in `lib/calculations.ts` |
| Table performance | Virtual scrolling if >100 rows |
| Responsive table | Horizontal scroll or card view on mobile |

## Next Steps

→ Phase 5: Create Quotation wizard  
→ Phase 6: Pricing Setup (can run parallel)