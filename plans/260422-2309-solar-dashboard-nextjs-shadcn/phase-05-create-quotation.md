# Phase 5: Create Quotation - 3-Step Wizard

**Context:** Previous research report `research/dashboard-analysis-report.md`  
**Depends on:** Phase 4 (Dashboard View) + Phase 6 (Pricing)

## Overview
| Item | Value |
|------|-------|
| Priority | HIGH |
| Status | COMPLETED |
| Effort | Very High |

Implement the 3-step quotation creation wizard with customer info, technical details, and financial calculation.

## Key Insights

- **Step 1:** Customer information (personal details)
- **Step 2:** Technical details (system configuration)
- **Step 3:** Financial calculation (ROI, savings, PDF download)

### Conditional Visibility
- Step 3 shows calculations only after capacity entered in Step 2
- Pricing data comes from Phase 6 (Pricing Setup)
- System capacity determines available phase options

### Sanction Load → Phase Rules
- 1-4 kW: 1-Phase only
- 5-8 kW: Both 1-Phase and 3-Phase
- 9-10 kW: 3-Phase only

## Requirements

### Step 1 - Customer Information

**Fields:**
| Field | Type | Validation |
|-------|------|------------|
| First Name | text | Required |
| Last Name | text | Required |
| Phone | tel | Required, +91 format |
| Address | textarea | Required |
| Location | text | Required |
| Consumer No | text | Optional |
| Sanction Load | select | Required, options 1-10 kW |
| Site Type | select | Required, Residential/Commercial/Industrial |
| Billing Type | select | Required, 5 options |

### Step 2 - Technical Details

**Fields:**
| Field | Type | Dynamic |
|-------|------|---------|
| System Capacity | select | Based on pricing setup |
| System Type | radio | On-Grid, Off-Grid, Hybrid |
| Panel Type | select | Mono Standard, Mono Large, TOPCon |
| Roof Type | select | RCC, Sheet, Ground |
| Area Length | number | Auto-calculates |
| Area Width | number | Auto-calculates |
| Building Height | number | Optional |

**Auto-calculations:**
- Available Area = Length × Width
- System Area = Panels × Panel area (from technical settings)
- Shortfall = Available - System (shows warning if negative)

**Phase Selection:**
- Based on Sanction Load (Step 1)
- 1-Phase / 3-Phase toggle

### Step 3 - Financial Calculation

**Auto-populated fields:**
- Monthly Generation (units)
- Monthly Savings (INR)
- Annual Savings (INR)
- Subsidy calculation
- Payback period
- ROI details

**Manual inputs:**
- Discount percentage
- Final offer amount

**Actions:**
- Download PDF (Business / Customer)
- Print

## Architecture

### File Structure
```
app/dashboard/quotation/
├── new/
│   └── page.tsx          # Quotation wizard page
└── [id]/
    └── page.tsx          # Edit existing quotation

components/dashboard/
├── quotation-wizard.tsx    # Main wizard container
├── step-customer.tsx       # Step 1
├── step-technical.tsx      # Step 2
├── step-financial.tsx      # Step 3
├── step-indicator.tsx      # Progress indicator
├── area-calculator.tsx    # Auto-calculate area
├── roi-display.tsx        # ROI calculation display
└── pdf-preview.tsx        # PDF preview modal
```

### Data Model
```typescript
interface QuotationForm {
  // Step 1
  firstName: string;
  lastName: string;
  phone: string;
  address: string;
  location: string;
  consumerNo: string;
  sanctionLoad: string;
  siteType: string;
  billingType: string;
  
  // Step 2
  systemCapacity: string;
  systemType: SystemType;
  panelType: string;
  roofType: string;
  phase: '1-Phase' | '3-Phase';
  areaLength: string;
  areaWidth: string;
  buildingHeight: string;
  numPanels: number;
  
  // Calculated
  availableArea: string;
  systemArea: string;
  shortfall: string;
  
  // Step 3
  monthlyGeneration: number;
  monthlySavings: number;
  annualSavings: number;
  subsidyAmount: number;
  actualInvestment: number;
  paybackYears: number;
  paybackMonths: number;
}
```

## Implementation Steps

1. **Create quotation wizard container**
   - Step indicator at top
   - Step content area
   - Back/Next buttons
   - Form state management

2. **Build Step 1 - Customer Info**
   - All input fields
   - Sanction load → phase mapping
   - Real-time validation

3. **Build Step 2 - Technical Details**
   - Dynamic capacity options from pricing
   - Area calculator with auto-calculate
   - Panel count estimation
   - Phase selection based on sanction load

4. **Build Step 3 - Financial**
   - Pull pricing from pricing setup
   - Calculate monthly generation: Capacity × 4.5 × 0.75 × 30
   - Calculate savings: Monthly units × Avg unit price
   - Subsidy: Based on government rates
   - ROI: Payback period calculation

5. **Create PDF Preview Modal**
   - Business document (cost breakdown)
   - Customer quote (friendly format)
   - Discount calculation
   - Download/Print buttons

6. **Add loan calculator (optional)**
   - Only shows when loan amount > 0
   - EMI calculation

## Related Code Files

| File | Action |
|------|--------|
| `components/dashboard/quotation-wizard.tsx` | Create |
| `components/dashboard/step-customer.tsx` | Create |
| `components/dashboard/step-technical.tsx` | Create |
| `components/dashboard/step-financial.tsx` | Create |
| `components/dashboard/step-indicator.tsx` | Create |
| `components/dashboard/pdf-preview.tsx` | Create |
| `app/dashboard/quotation/new/page.tsx` | Create |

## Todo List

- [x] Create quotation wizard container
- [x] Build step 1 customer form
- [x] Build step 2 technical form
- [x] Build step 3 financial calculations
- [x] Add area auto-calculate
- [x] Create PDF preview modal
- [x] Implement PDF generation
- [x] Add loan calculator
- [x] Test step navigation
- [x] Test all calculations

## Success Criteria

1. 3-step wizard navigates correctly
2. Sanction load determines phase options
3. Area auto-calculates on input
4. Financial calculations are accurate
5. PDF preview shows correct data
6. Download generates PDF
7. All validation works

## Risk Assessment

| Risk | Mitigation |
|------|------------|
| Complex calculations | Create `lib/calculations.ts` with all formulas |
| PDF generation | Use browser print or html2pdf library |
| Form state | Use react-hook-form with zod validation |

## Next Steps

→ Phase 7: Settings views (GST, Payment, Technical)  
→ Phase 8: Profile panel