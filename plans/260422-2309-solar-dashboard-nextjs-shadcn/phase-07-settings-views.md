# Phase 7: Settings Views

**Context:** Previous research report `research/dashboard-analysis-report.md`  
**Depends on:** Phase 3 (Dashboard Layout)

## Overview
| Item | Value |
|------|-------|
| Priority | MEDIUM |
| Status | COMPLETED |
| Effort | Low |

Implement three settings views: GST Settings, Payment Settings, Technical Settings.

---

## 7.1 GST Settings

### Requirements
- **GST Percentage Input:** Number input (0-100%)
- **Include in Quotes Toggle:** Switch to enable/disable GST in quotations
- **Default:** 18% GST

### UI
```
┌─────────────────────────────────┐
│ GST Settings                    │
├─────────────────────────────────┤
│ GST Percentage                  │
│ [    18    ] %                 │
│                                 │
│ [✓] Include GST in quotations  │
│                                 │
│ Save Changes                    │
└─────────────────────────────────┘
```

---

## 7.2 Payment Settings (Loan Calculator)

### Requirements
- **Loan Amount:** INR input
- **Interest Rate (%):** Number input
- **Term (Years):** Number input (1-30)
- **Calculated Fields (read-only):**
  - Total Payable to Bank
  - EMI per month

### Calculations
```typescript
const calculateEMI = (principal: number, rate: number, years: number) => {
  const monthlyRate = rate / 12 / 100;
  const months = years * 12;
  return (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) / 
         (Math.pow(1 + monthlyRate, months) - 1);
};

const totalPayable = emi * months;
```

### UI
```
┌─────────────────────────────────┐
│ Payment Settings                │
├─────────────────────────────────┤
│ Loan Amount (₹)                │
│ [  100000  ]                   │
│                                 │
│ Interest Rate (%)               │
│ [    8.5   ]                   │
│                                 │
│ Term (Years)                   │
│ [    5     ]                   │
│                                 │
│ ──────────────────────────────  │
│ Total Payable to Bank           │
│ ₹ 1,26,000                     │
│                                 │
│ EMI (per month)                 │
│ ₹ 2,100                         │
└─────────────────────────────────┘
```

---

## 7.3 Technical Settings (Panel Types)

### Requirements
- **Panel Types List:**
  1. Monocrystalline (Standard) - 300-400W, ~1.65m × 1.0m
  2. Monocrystalline (Large) - 450-600W+, ~2.0m × 1.1m
  3. TOPCon (N-Type) - 550-630W+, ~2.27m × 1.13m

- **Per Panel Type:**
  - Name
  - Wattage Range
  - Dimensions
  - Area (sqft)
  - Status toggle (active/inactive)

### Panel Data Model
```typescript
interface PanelType {
  id: 'mono-standard' | 'mono-large' | 'topcon';
  name: string;
  wattageRange: string;
  dimensions: string;
  areaSqFt: number;
  active: boolean;
}
```

### UI
```
┌─────────────────────────────────┐
│ Technical Settings              │
│ Panel Types                    │
├─────────────────────────────────┤
│ ┌─────────────────────────────┐│
│ │ Monocrystalline (Standard)  ││
│ │ 300W – 400W | 17.8 sqft   ││
│ │ [Active] [Edit]            ││
│ └─────────────────────────────┘│
│ ┌─────────────────────────────┐│
│ │ Monocrystalline (Large)     ││
│ │ 450W – 600W+ | 23.7 sqft  ││
│ │ [Active] [Edit]            ││
│ └─────────────────────────────┘│
│ ┌─────────────────────────────┐│
│ │ TOPCon (N-Type)            ││
│ │ 550W – 630W+ | 27.6 sqft  ││
│ │ [Active] [Edit]            ││
│ └─────────────────────────────┘│
└─────────────────────────────────┘
```

## Architecture

### File Structure
```
app/dashboard/settings/
├── gst/
│   └── page.tsx              # GST settings
├── payment/
│   └── page.tsx              # Payment settings
└── technical/
    └── page.tsx              # Technical settings

components/dashboard/
├── gst-settings.tsx
├── payment-settings.tsx
├── loan-calculator.tsx
├── technical-settings.tsx
└── panel-type-card.tsx
```

## Implementation Steps

1. **Create GST Settings page**
   - Number input for percentage
   - Toggle switch for include in quotes
   - Save button

2. **Create Payment Settings page**
   - Loan calculator form
   - Real-time EMI calculation
   - Clear results display

3. **Create Technical Settings page**
   - Panel types list
   - Edit mode for each type
   - Status toggle

## Related Code Files

| File | Action |
|------|--------|
| `components/dashboard/gst-settings.tsx` | Create |
| `components/dashboard/payment-settings.tsx` | Create |
| `components/dashboard/loan-calculator.tsx` | Create |
| `components/dashboard/technical-settings.tsx` | Create |
| `components/dashboard/panel-type-card.tsx` | Create |
| `app/dashboard/settings/gst/page.tsx` | Create |
| `app/dashboard/settings/payment/page.tsx` | Create |
| `app/dashboard/settings/technical/page.tsx` | Create |

## Todo List

- [x] Create GST settings with percentage input
- [x] Add include GST toggle
- [x] Build loan calculator with EMI
- [x] Implement panel types management
- [x] Add status toggle for panels
- [x] Test all settings pages

## Success Criteria

1. GST percentage saves correctly
2. Toggle enables/disables GST in quotes
3. EMI calculates accurately
4. Panel types list displays correctly
5. Status toggle works

## Next Steps

→ Phase 8: Profile Panel (shared component)