# System Architecture - Solar Dashboard

## Overview

Solar Dashboard is a Next.js 14+ application with shadcn/ui components for managing solar quotations, pricing, and ROI calculations.

## Technology Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 14 (App Router) |
| UI Components | shadcn/ui + Radix UI |
| Styling | Tailwind CSS |
| Forms | React Hook Form + Zod |
| State | React hooks (useState, useReducer) |
| Icons | Lucide React |
| Charts | Recharts |
| PDF | @react-pdf/renderer |

## Frontend Architecture

```
frontnend/src/
├── app/                          # App Router structure
│   ├── (auth)/                   # Auth route group
│   │   ├── login/               # Login page
│   │   ├── onboarding/          # User onboarding
│   │   └── layout.tsx           # Auth layout (no sidebar)
│   ├── (dashboard)/             # Dashboard route group
│   │   ├── page.tsx            # Redirect to /dashboard
│   │   └── layout.tsx          # Dashboard shell layout
│   └── dashboard/               # Protected routes
│       ├── page.tsx            # Quotation list
│       ├── pricing/            # Pricing page
│       ├── quotation/new/       # New quotation wizard
│       └── settings/           # User settings
│           ├── gst/
│           ├── payment/
│           └── technical/
├── components/
│   ├── auth/                    # Auth-related components
│   ├── dashboard/               # Dashboard-specific
│   ├── shared/                  # Cross-feature shared
│   └── ui/                      # shadcn/ui primitives
└── lib/
    ├── calculations.ts         # Solar math
    └── utils.ts                # Utilities
```

## Route Groups

### (auth) Group
- `/login` - User login page
- `/onboarding` - Post-registration onboarding wizard
- Layout: Minimal, centered card with branding

### (dashboard) Group
- Shell layout with sidebar navigation
- Header with user menu
- Protected routes requiring authentication

### dashboard/ Sub-routes
- `/dashboard` - Main quotation list view
- `/dashboard/pricing` - Panel pricing table
- `/dashboard/quotation/new` - Quotation creation wizard
- `/dashboard/settings/*` - User configuration pages

## Component Hierarchy

```
App Shell
├── Sidebar (navigation)
│   ├── Logo/Brand
│   ├── Nav Items
│   │   ├── Quotations
│   │   ├── Pricing
│   │   └── Settings
│   └── User Profile
├── Header
│   ├── Page Title
│   └── Actions (New Quotation button)
└── Main Content
    ├── Dashboard View
    │   ├── KPI Grid
    │   ├── Quotation Table
    │   └── Pagination
    ├── Quotation Wizard
    │   ├── Step Indicator
    │   ├── Step Form (Customer/Financial/Technical)
    │   └── Navigation
    └── Settings Forms
```

## Data Flow

### Quotation Creation Flow

1. User navigates to `/dashboard/quotation/new`
2. Quotation wizard renders with step indicator
3. User completes steps sequentially:
   - Step 1: Customer Information
   - Step 2: Financial Details
   - Step 3: Technical Specifications
4. On submit: Form data sent to backend API
5. Redirect to quotation list on success

### KPI Calculation Flow

```
System kW → Monthly Generation → Monthly Savings → Annual Savings
                                        ↓
                            ROI Calculation (payback, total savings)
                                        ↓
                            CO2 Calculation (carbon offset)
```

## Key Calculations

### Solar Generation
```
Monthly kWh = System kW × Peak Sun Hours (4.5) × Days (30) × PR (0.75)
```

### ROI Metrics
```
Monthly Savings = Monthly Generation × Unit Rate
Annual Savings = Monthly Savings × 12
Actual Investment = System Cost - Subsidy (78,000)
Payback Period = (Actual Investment / Annual Savings) × 12 months
```

## shadcn/ui Components Used

| Component | Usage |
|-----------|-------|
| Button | Actions, navigation |
| Card | Container for forms/sections |
| Input | Text fields |
| Label | Form labels |
| Select | Dropdowns |
| Table | Data display |
| Dialog | Modals, PDF preview |
| Tabs | Settings sections |
| Sheet | Mobile navigation |
| Avatar | User profile images |
| Badge | Status indicators |
| Progress | Form progress |
| Toggle | Boolean options |
| Checkbox | Multi-select |

## Responsive Design

- Desktop: Full sidebar + content
- Tablet: Collapsible sidebar
- Mobile: Sheet-based navigation (hamburger menu)

## Authentication Flow

1. User lands on `/login`
2. After login, check onboarding status:
   - If incomplete: Redirect to `/onboarding`
   - If complete: Redirect to `/dashboard`
3. Dashboard routes protected by auth check
