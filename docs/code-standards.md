# Code Standards - Solar Dashboard

## Project Structure

```
frontnend/src/
├── app/                          # Next.js App Router pages
│   ├── (auth)/                   # Route group: Authentication
│   │   ├── login/page.tsx
│   │   ├── onboarding/page.tsx
│   │   └── layout.tsx
│   ├── (dashboard)/              # Route group: Dashboard shell
│   │   ├── page.tsx
│   │   └── layout.tsx
│   ├── dashboard/                # Dashboard sub-routes
│   │   ├── page.tsx              # Quotation list
│   │   ├── pricing/page.tsx      # Pricing
│   │   ├── quotation/new/page.tsx # New quotation wizard
│   │   └── settings/            # Settings sub-routes
│   │       ├── gst/page.tsx
│   │       ├── payment/page.tsx
│   │       └── technical/page.tsx
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Root redirect
├── components/
│   ├── auth/                     # Authentication components
│   │   ├── branding-panel.tsx
│   │   ├── login-form.tsx
│   │   ├── onboarding-wizard.tsx
│   │   └── step-*.tsx           # Onboarding steps
│   ├── dashboard/                # Dashboard components
│   │   ├── dashboard-view.tsx
│   │   ├── header.tsx
│   │   ├── sidebar.tsx
│   │   ├── kpi-*.tsx            # KPI cards/grid
│   │   ├── quotation-*.tsx       # Quotation components
│   │   ├── step-*.tsx           # Quotation wizard steps
│   │   └── *.tsx                # Various dashboard components
│   ├── shared/                   # Shared across features
│   │   ├── avatar-upload.tsx
│   │   ├── profile-panel.tsx
│   │   └── profile-section.tsx
│   └── ui/                       # shadcn/ui components
│       ├── button.tsx
│       ├── card.tsx
│       ├── dialog.tsx
│       ├── select.tsx
│       ├── table.tsx
│       └── ...
└── lib/
    ├── calculations.ts           # Solar/ROI calculations
    └── utils.ts                  # Utility functions
```

## Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| Files | kebab-case | `login-form.tsx`, `step-customer.tsx` |
| Components | PascalCase | `LoginForm`, `KpiGrid` |
| Functions | camelCase | `calculateMonthlyGeneration` |
| Constants | UPPER_SNAKE_CASE | `PEAK_SUN_HOURS`, `DEFAULT_SUBSIDY` |
| Types/Interfaces | PascalCase | `PanelType`, `QuotationForm` |

## shadcn/ui Patterns

### Component Usage

```tsx
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
```

### Form Patterns

```tsx
// Use Label component for accessibility
<Label htmlFor="field-id">Field Label</Label>
<Input id="field-id" placeholder="..." />

// Wrap with Card for form sections
<Card>
  <CardHeader>
    <CardTitle>Section Title</CardTitle>
  </CardHeader>
  <CardContent>
    {/* form fields */}
  </CardContent>
</Card>
```

### Table Patterns

```tsx
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
```

## Route Groups (App Router)

- `(auth)` - Authentication routes (no dashboard layout)
- `(dashboard)` - Dashboard shell with sidebar/header
- `dashboard/` - Protected routes requiring auth layout

## Calculations Library

Solar/ROI calculations in `lib/calculations.ts`:

| Function | Purpose |
|----------|---------|
| `calculateMonthlyGeneration` | System kW to monthly kWh |
| `calculateMonthlySavings` | Monthly kWh to INR savings |
| `calculatePaybackMonths` | ROI payback period |
| `calculateROI` | Full ROI metrics object |
| `calculateNumPanels` | Panels needed for system size |
| `calculateSystemArea` | Area required for panels |
| `calculateCO2Saved` | Carbon footprint saved (tonnes) |
| `calculateEMI` | Loan EMI calculation |
| `formatINR` | Currency formatting |

## Constants

```typescript
const PEAK_SUN_HOURS = 4.5;
const PERFORMANCE_RATIO = 0.75;
const DAYS_PER_MONTH = 30;
const CO2_FACTOR_KG_PER_KWH = 0.71;
const PANEL_LIFE_YEARS = 25;
const DEFAULT_SUBSIDY = 78000;
```

## Component Organization

### Dashboard Components

- `dashboard-view.tsx` - Main dashboard container
- `header.tsx` - Top navigation bar
- `sidebar.tsx` - Left navigation menu
- `kpi-*.tsx` - Key performance indicators
- `quotation-*.tsx` - Quotation management
- `step-*.tsx` - Quotation wizard steps
- `*-settings.tsx` - Settings forms

### Auth Components

- `branding-panel.tsx` - Login branding side
- `login-form.tsx` - Login form
- `onboarding-wizard.tsx` - Multi-step onboarding
- `step-*.tsx` - Onboarding form steps

## State Management

Use React Server Components where possible. Client components marked with `"use client"` directive.

## File Size Limits

- Components: Keep under 200 lines
- Complex logic: Extract to `lib/` utilities
- Wizard steps: Separate component files
