---
title: "Phase 3 - Migrate Frontend Components"
description: "Adapt magicpath React components to Next.js with purple theme"
status: completed
priority: P1
effort: 5h
phase: 3
completed: 2026-04-23
---

# Phase 3: Migrate Frontend Components

## Overview

Adapt magicpath-extracted React components to Next.js with shadcn/ui. Preserve exact UI/UX, colors (#7C5CFC purple theme), and all magicpath interactions.

## Context Links

- Source: `C:\Users\Admin\Downloads\magicpath-extracted\src\components\generated\`
- [Phase 1](./phase-01-setup-mongodb.md) - Models needed
- [Phase 2](./phase-02-formula-apis.md) - API endpoints needed
- Reports: [Magicpath Analysis](../reports/brainstorm-260423-2313-solar-magicpath-migration.md)

## Key Insights

- SolarDashboard.tsx is ~47K lines - split into modular components
- Keep same color scheme: Primary #7C5CFC, Navy #0B1E3D
- Use existing shadcn/ui component patterns
- Replace magicpath sample data with API calls

## Color Theme (Exact)

```css
/* Primary */
--primary: #7C5CFC;
--primary-hover: #6B4DEB;

/* Navy/Dark */
--navy: #0B1E3D;
--navy-light: #133366;

/* Success */
--success: #22C55E;
--success-dark: #16A34A;

/* Warning */
--warning: #FFB800;
--warning-dark: #FF8C00;

/* Error */
--error: #E8533A;
--error-dark: #DC2626;

/* Background */
--bg-primary: #F8FAFC;
--bg-card: #FFFFFF;

/* Text */
--text-primary: #0B1E3D;
--text-secondary: #64748B;
--text-muted: #94A3B8;

/* Border */
--border: #E2E8F0;
--border-light: #F1F5F9;
```

## Requirements

### Functional
- Dashboard with KPI cards (total quotations, approved, pending, revenue)
- Donut chart for quotation status
- Quotation table with filters
- Quotation wizard (3-step: customer, technical, financial)
- Pricing table with editable cells
- Settings pages (GST, payment, technical)

### Non-functional
- Responsive design (mobile sidebar)
- Framer Motion animations
- Loading states for API calls
- Error handling UI

## Architecture

```
frontnend/src/
├── app/dashboard/
│   ├── page.tsx              # MODIFY: Main dashboard
│   ├── quotation/new/
│   │   └── page.tsx          # MODIFY: Quotation wizard
│   └── pricing/
│       └── page.tsx          # MODIFY: Pricing table
├── components/dashboard/
│   ├── kpi-card.tsx         # CREATE: KPI card component
│   ├── kpi-grid.tsx          # CREATE: KPI grid layout
│   ├── donut-chart.tsx       # CREATE: Status chart
│   ├── quotation-table.tsx  # CREATE: Quotation list
│   ├── quotation-row.tsx    # CREATE: Single row
│   ├── step-customer.tsx    # MODIFY: Customer step
│   ├── step-technical.tsx    # MODIFY: Technical step
│   ├── step-financial.tsx  # MODIFY: Financial step
│   ├── loan-calculator.tsx  # CREATE: EMI calculator
│   ├── pdf-preview.tsx      # CREATE: PDF modal
│   └── sidebar.tsx          # MODIFY: Navigation
└── lib/
    ├── api.ts               # MODIFY: Add endpoints
    └── calculations.ts       # MODIFY: Match formulas
```

## Related Code Files

### Modify
- `frontnend/src/app/dashboard/page.tsx` - Dashboard page
- `frontnend/src/app/dashboard/quotation/new/page.tsx` - Quotation wizard
- `frontnend/src/app/dashboard/pricing/page.tsx` - Pricing page
- `frontnend/src/components/dashboard/sidebar.tsx` - Navigation
- `frontnend/src/lib/api.ts` - API client
- `frontnend/src/lib/calculations.ts` - Formula sync
- `frontnend/tailwind.config.ts` - Add color variables
- `frontnend/src/app/globals.css` - CSS variables

### Create
- `frontnend/src/components/dashboard/kpi-card.tsx`
- `frontnend/src/components/dashboard/kpi-grid.tsx`
- `frontnend/src/components/dashboard/donut-chart.tsx`
- `frontnend/src/components/dashboard/quotation-table.tsx`
- `frontnend/src/components/dashboard/quotation-row.tsx`
- `frontnend/src/components/dashboard/loan-calculator.tsx`
- `frontnend/src/components/dashboard/pdf-preview.tsx`

## Implementation Steps

1. **Update Tailwind config with magicpath colors**
   ```typescript
   // tailwind.config.ts
   extend: {
     colors: {
       primary: '#7C5CFC',
       navy: '#0B1E3D',
       success: '#22C55E',
       warning: '#FFB800',
       error: '#E8533A',
     }
   }
   ```

2. **Create KPI card component**
   - Props: title, value, change, icon, color
   - Gradient background option
   - Framer Motion hover effect

3. **Create KPI grid layout**
   - 4-column grid (responsive: 2 on tablet, 1 on mobile)
   - Cards: Total Quotations, Approved, Pending, Total Revenue

4. **Create donut chart component**
   - Use Recharts PieChart
   - Show approved vs pending
   - Center text with total count
   - Colors: success (approved), warning (pending)

5. **Create quotation table**
   - Columns: Customer, System, Location, Date, Amount, Status, Actions
   - Row click → view details
   - Action buttons: View, Edit, Delete, Download PDF
   - Status chip with color coding

6. **Migrate quotation wizard steps**
   - Step 1 Customer: name, phone, address, location, consumerNo
   - Step 2 Technical: systemSize, panelType, roofType, roofDimensions
   - Step 3 Financial: unitRate, subsidy, otherExpenses, profitMargin
   - Use API to calculate on each step change

7. **Update calculations.ts**
   - Sync with backend formula constants
   - Export same functions used in frontend
   - Validate before API calls

8. **Update API client**
   - Add calculation endpoints
   - Add quotation CRUD
   - Add pricing endpoints
   - Handle loading states

## Component Mappings

| Magicpath | Next.js |
|-----------|---------|
| SolarDashboard KPI section | kpi-grid.tsx |
| SolarDashboard chart | donut-chart.tsx |
| SolarDashboard table | quotation-table.tsx |
| Quotation wizard 3 steps | step-customer/technical/financial.tsx |
| Loan calculator | loan-calculator.tsx |

## Todo List

- [x] Update Tailwind with magicpath colors (via globals.css)
- [x] Create kpi-card.tsx (existed)
- [x] Create kpi-grid.tsx (existed, updated gradients)
- [x] Create donut-chart.tsx (existed)
- [x] Create quotation-table.tsx (existed)
- [x] Migrate quotation wizard steps (existed)
- [x] Create loan-calculator.tsx (existed)
- [x] Update calculations.ts (verified, all formulas correct)
- [x] Update API client (verified, all endpoints present)
- [x] Test dashboard display (updated dashboard-view.tsx with real API)

## Success Criteria

- [x] Dashboard shows real data from MongoDB (updated dashboard-view.tsx)
- [x] KPI cards display correct totals
- [x] Chart renders quotation status
- [x] Quotation wizard creates records in database (integrated with API)
- [x] Theme colors match magicpath exactly (#7C5CFC primary)

## Security Considerations

- Auth checks on all dashboard routes
- Input validation on all forms
- Sanitize user inputs before API calls

## Next Steps

Phase 4 depends on: Frontend components migrated, APIs ready