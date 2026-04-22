# Code Review: Solar Swytch Dashboard

**Reviewer:** code-reviewer
**Date:** 2026-04-23
**Scope:** All components, pages, and types in `frontnend/src/`

---

## Summary Score

**Overall Score: 7.5 / 10**

The implementation is solid with good architectural patterns, but has some critical issues that need fixing.

---

## Critical Issues (Must Fix)

### 1. Type Mismatch in QuotationFormData

**File:** `frontnend/src/components/dashboard/quotation-wizard.tsx`
**Severity:** HIGH

```typescript
// Line 19-22: QuotationFormData expects string for panelType
export interface QuotationFormData {
  customer: QuotationCustomerForm;
  technical: QuotationTechnicalForm;
}

// But QuotationTechnicalForm has panelType as string union
panelType: PanelType;  // "mono-standard" | "mono-large" | "topcon"
```

**Issue:** `step-financial.tsx` imports `QuotationTechnicalForm` but uses `technicalForm.panelType` as string key in `panelTypeLabels` record (line 114-118). This works because `PanelType` is a string literal type, but the type definition in `quotation-form.ts` line 19 shows `panelType: PanelType` while step-technical.tsx passes it through correctly.

**Fix:** Ensure consistent typing across all quotation form components.

---

### 2. Hardcoded Magic Number in New Quotation Page

**File:** `frontnend/src/app/dashboard/quotation/new/page.tsx`
**Lines:** 14-22

```typescript
const baseCost = systemKw * 45000; // Magic number - cost per kW
const numPanels = Math.ceil(systemKw * 1000 / 540); // Magic number - default 540W panels
const systemArea = Math.ceil(numPanels * 22); // Magic number - panel area
```

**Issue:** Should use constants from `lib/calculations.ts` or at least define these at the top of the file.

---

### 3. Inconsistent Panel Area Calculation

**Files:**
- `frontnend/src/app/dashboard/quotation/new/page.tsx` (line 21): `numPanels * 22`
- `frontnend/src/lib/calculations.ts` (line 93): `numPanels * panel.areaSqFt` (from PANEL_TYPES)

**Issue:** Hardcoded 22 sq.ft vs dynamic lookup from PANEL_TYPES. This will cause inconsistency if panel type changes.

---

### 4. Missing Error Boundaries / Fallback Data

**File:** `frontnend/src/app/dashboard/quotation/new/page.tsx`
**Lines:** 24-50

```typescript
const newQuotation: QuotationDetail = {
  // ...
  numPanels,  // Can be NaN if systemKw is 0
  // ...
};
```

**Issue:** No validation before creating QuotationDetail. If systemKw is 0, `parseFloat("")` returns NaN, leading to NaN calculations.

---

## High Priority Issues

### 5. Duplicate Type Definitions

**Files:**
- `frontnend/src/types/quotation.ts` - Defines `QuotationDetail` interface
- `frontnend/src/types/quotation-form.ts` - Also defines `QuotationDetail` interface (lines 49-75)

**Issue:** Two different `QuotationDetail` types exist with slightly different fields. The one in `quotation-form.ts` has additional fields (areaLength, areaWidth, etc.) while `quotation.ts` is simpler.

**Fix:** Consolidate into single source of truth, export from one file, import in others.

---

### 6. Inline Styles vs Tailwind Classes

**Files:** Multiple components use inline styles extensively:
- `frontnend/src/components/auth/branding-panel.tsx` (lines 29-43)
- `frontnend/src/components/auth/login-form.tsx` (lines 26-30)
- `frontnend/src/components/auth/step-*.tsx` files
- `frontnend/src/components/shared/profile-panel.tsx` (lines 82-86, 128-134)

**Issue:** While not technically wrong, inline styles bypass Tailwind's purging and make theme consistency harder. Some colors like `#0B1E3D`, `#7C5CFC`, `#E2E8F0` are repeated across files.

**Recommendation:** Extract common color values to CSS variables and use Tailwind classes where possible.

---

### 7. Accessibility Issues

**Files:** Multiple components

**Issues found:**
1. `login-form.tsx` (lines 54-61): Native `<input>` elements lack `id` attributes for proper label association
2. `step-customer.tsx` (line 113): Uses native `<textarea>` without `id` association
3. `branding-panel.tsx` (lines 124-125): `<span>` with `animate-pulse` for pulse effect - should use `<span aria-hidden="true">` for decorative elements
4. `header.tsx` (line 30): Button with notification badge lacks `aria-label`

---

### 8. Missing ARIA Labels on Interactive Elements

**Files:**
- `branding-panel.tsx`: Custom toggle-like elements not labeled
- `step-role.tsx`: Business type selection buttons lack aria labels
- `pricing-table.tsx`: Edit/Save/Cancel button group needs aria-labels

---

## Medium Priority Issues

### 9. Magic Numbers in Calculations

**File:** `frontnend/src/components/dashboard/dashboard-view.tsx`
**Line:** 121

```typescript
// Formula: Capacity * 4.5 units/day * 0.75 * 365 days * 0.71 kg CO2/unit / 1000
return (capacityKw * 4.5 * 0.75 * 365 * 0.71) / 1000;
```

**Issue:** Same calculation exists in `lib/calculations.ts` (`calculateCO2Saved`) but duplicated here. Should import and use the library function.

---

### 10. Inconsistent Button Component Usage

**Files:** Auth components use native `<button>` elements with custom styling instead of shadcn `<Button>` component.

**Example:** `login-form.tsx` uses native `<button>` with inline styles while other components use shadcn `<Button>`.

**Recommendation:** Standardize on shadcn Button component for consistency.

---

### 11. Console.log for Debugging

**Files:**
- `frontnend/src/app/(auth)/onboarding/page.tsx` (line 42): `console.log("Login:", loginForm)`
- `frontnend/src/app/(auth)/login/page.tsx` (line 37): `console.log("Login:", form)`
- `frontnend/src/app/dashboard/quotation/new/page.tsx` (implied)
- `frontnend/src/components/dashboard/dashboard-view.tsx` (lines 144-154): Several console.log statements

**Issue:** Debug logs should be removed or replaced with proper logging/monitoring.

---

### 12. Incomplete Page Routing

**Files:** `frontnend/src/app/(dashboard)/page.tsx`

```typescript
export default function DashboardPage() {
  return <DashboardView />;
}
```

**Issue:** Route group `(dashboard)` creates `/dashboard` path, but there's also `frontnend/src/app/dashboard/page.tsx` that redirects to `/dashboard`. This creates a circular redirect. The main dashboard should be at one canonical location.

---

## Low Priority Issues

### 13. Unused Import

**File:** `frontnend/src/components/dashboard/pricing-summary.tsx`
**Line:** 5

```typescript
import { PricingRow } from "./pricing-table";
// PricingRow is used but the type itself isn't explicitly used in the interface
```

**Minor:** Type-only import should use `import type`.

---

### 14. Inconsistent Date Formatting

**File:** `frontnend/src/components/dashboard/quotation-row.tsx`

```typescript
const formattedDate = new Date(quotation.dateTime).toLocaleDateString("en-IN", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});
```

**Issue:** Uses native `toLocaleDateString` instead of a utility function. Consider creating a `formatDate` utility.

---

### 15. Missing Loading States

**Files:** Multiple components

**Issue:** The onboarding wizard and quotation wizard don't show loading states during async operations (simulated with `setTimeout`). For production, these should be connected to actual API calls with proper loading feedback.

---

## Positive Observations

### Well-Organized Structure
- Clear separation of concerns (auth, dashboard, shared components)
- Proper use of route groups in Next.js App Router
- Consistent file naming convention (kebab-case)

### Strong TypeScript Usage
- Good use of interfaces and types
- Proper use of union types for SystemType, PanelType, etc.
- Type exports are well-organized

### Good Calculations Logic
- `lib/calculations.ts` is well-structured with single-responsibility functions
- Constants are defined at the top with descriptive names
- Formula explanations in comments

### Responsive Design
- Good use of Tailwind responsive prefixes (lg:, md:, sm:)
- Mobile-first approach in most components

### Clean Component Composition
- Small, focused components that do one thing
- Good use of composition over complex state management

### Accessibility Foundation
- Most form inputs have proper labels
- Screen reader text (sr-only) used appropriately
- Focus states are present in interactive elements

---

## Recommendations

### Immediate Actions (Critical)
1. Fix type mismatch and consolidate duplicate type definitions
2. Remove magic numbers, use constants
3. Add input validation before creating quotation data
4. Fix circular redirect issue in dashboard routes

### Short-term Fixes (High Priority)
5. Replace inline styles with Tailwind classes where possible
6. Add proper aria-labels to all interactive elements
7. Remove debug console.log statements
8. Standardize on shadcn Button component

### Medium-term Improvements (Medium Priority)
9. Create shared utility for color constants
10. Add date formatting utility
11. Implement proper loading states for async operations
12. Add error boundaries for component failures

---

## Compliance Checklist

| Requirement | Status | Notes |
|-------------|--------|-------|
| YAGNI/KISS/DRY | PARTIAL | Some duplication exists |
| No hardcoded magic numbers | FAIL | Several found in calculations |
| shadcn compliance | PARTIAL | Some components use native HTML |
| TypeScript typing | PASS | Well-typed overall |
| Accessibility | PARTIAL | Missing aria-labels on some elements |

---

## Unresolved Questions

1. **API Integration:** When will the actual authentication API be connected? The current login is mock-only.
2. **Data Persistence:** How should quotation data be stored? Currently it's in-memory only.
3. **PDF Generation:** The PDF preview uses `window.print()` - is this the intended approach or should a library be used?
4. **Theme Variables:** Are CSS variables for colors defined in globals.css? Some components use hardcoded hex values.

---

**Review Complete**