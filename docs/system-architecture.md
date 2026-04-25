# System Architecture - Solar Dashboard

## Overview

Solar Dashboard is a full-stack application with Next.js 14 frontend and Express.js backend, using MongoDB for data persistence. The system manages solar quotations, pricing, and ROI calculations with API-driven calculations.

## Technology Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 14 (App Router) |
| UI Components | shadcn/ui + Radix UI |
| Styling | Tailwind CSS |
| Forms | React Hook Form + Zod |
| State | React hooks (useState, useReducer) |
| Icons | Lucide React |
| Charts | Recharts |
| PDF | @react-pdf/renderer |
| Backend | Express.js + TypeScript |
| Database | MongoDB |
| ODM | Mongoose |

## Backend Architecture

```
backend/
├── src/
│   ├── routes/                  # Express route handlers
│   │   ├── formula-routes.ts   # Solar calculation APIs
│   │   └── user-routes.ts      # User management APIs
│   ├── models/                  # Mongoose schemas
│   │   ├── user.ts
│   │   ├── quotation.ts
│   │   ├── pricing.ts
│   │   └── settings.ts
│   ├── lib/
│   │   ├── db.ts              # MongoDB connection
│   │   └── solar-calculations.ts # Formula constants
│   └── index.ts               # Express app entry
└── package.json
```

## API Endpoints (Formula Calculations)

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/formula/solar-sizing` | POST | Calculate system size from load |
| `/api/formula/cost` | POST | Calculate system cost |
| `/api/formula/roi` | POST | Calculate ROI metrics |
| `/api/formula/emi` | POST | Calculate loan EMI |
| `/api/formula/suggest-capacity` | POST | Suggest capacity based on budget |

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
    ├── api.ts                  # API client functions
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

### Frontend → API → MongoDB Flow

```
┌─────────────┐     POST      ┌─────────────┐     CRUD      ┌─────────────┐
│   Frontend  │ ──────────►  │   Backend   │ ──────────►  │   MongoDB   │
│  (Next.js)  │   JSON       │  (Express)  │   Mongoose  │  (Database) │
│             │ ◄──────────  │             │ ◄─────────  │             │
└─────────────┘  Response    └─────────────┘  Document   └─────────────┘
```

### Formula API Flow

1. Frontend collects user inputs (load, budget, location)
2. POST request to formula endpoint
3. Backend validates and calculates using constants from `solar-calculations.ts`
4. Returns `{ success: boolean, data: {...} }` response
5. Frontend updates UI with calculated values

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

## MongoDB Collections

| Collection | Purpose |
|------------|---------|
| `users` | User accounts and profiles |
| `quotations` | Solar system quotations |
| `pricing` | Panel/module pricing data |
| `settings` | User preferences and configurations |

## API Response Format

All API responses follow this structure:

```typescript
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}
```

Example:
```json
{
  "success": true,
  "data": {
    "systemSize": 10,
    "monthlyGeneration": 1012.5,
    "annualSavings": 608000
  }
}
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
