# SolarDashboard Mock Data Analysis Report

**Generated:** 2026-04-25
**Analyzed File:** `magicpath-frontend/src/components/generated/SolarDashboard.tsx`
**Backend API Base:** `http://localhost:3001/api`

---

## 1. Mock Data Found

### 1.1 `sampleQuotations` (Line 486-570)
**Type:** `QuotationDetail[]`
**Initialized at:** Line 1833
```typescript
const [quotations, setQuotations] = useState<QuotationDetail[]>(sampleQuotations);
```
**Sample count:** 3 records (q1, q2, q3)

### 1.2 `initialPricing` (Line 430-475)
**Type:** `PricingRow[]`
**Initialized at:** Line 1835
```typescript
const [pricingRows, setPricingRows] = useState<PricingRow[]>(initialPricing);
```
**Sample count:** 5 records (3kW single, 5kW single, 5kW three, 7kW three, 10kW three)

### 1.3 `INITIAL_EXPENSE_ITEMS` (Line 286-305)
**Type:** `ExpenseItem[]`
**Initialized at:** Line 1871
```typescript
const [expenseItems, setExpenseItems] = useState<ExpenseItem[]>(INITIAL_EXPENSE_ITEMS);
```
**Contains:** installation, transport, liaison, structureInstall, other

### 1.4 `INITIAL_STATUS_ROWS` (Line 359-?)
**Type:** `PricingStatusRow[]`
**Initialized at:** Line 1840
```typescript
const [statusRows, setStatusRows] = useState<PricingStatusRow[]>(INITIAL_STATUS_ROWS);
```

### 1.5 `PRICING_SETUP_ROWS` (Line 328-?)
**Type:** `PricingSetupRow[]`
**Initialized at:** Line 1839
```typescript
const [setupRows, setSetupRows] = useState<PricingSetupRow[]>(PRICING_SETUP_ROWS);
```

---

## 2. Data Structures

### 2.1 `QuotationDetail` Interface (Lines 28-56)
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
  suggestedCapacity: string;
  systemCapacity: string;
  systemType: SystemType;  // 'on-grid' | 'off-grid' | 'hybrid'
  panelType: string;
  roofType: string;
  areaLength: string;
  areaWidth: string;
  buildingHeight: string;
  numPanels: number;
  availableArea: string;
  systemArea: string;
  shortfall: string;
  uploadedBill: string | null;
  dateTime: string;
  amount: string;
  approved: boolean;
}
```

### 2.2 `PricingRow` Interface (Lines 18-26)
```typescript
interface PricingRow {
  id: string;
  capacity: string;
  phase: PhaseType;  // 'single' | 'three'
  panelCost: number;
  inverterCost: number;
  structureCost: number;
  cableCost: number;
  otherCost: number;
}
```

### 2.3 `ExpenseItem` Interface (Lines 81-95)
```typescript
interface ExpenseItem {
  key: string;
  label: string;
  isDefault: boolean;
}
```

---

## 3. Backend API Endpoints Available

### 3.1 Quotations (`/api/quotations`)
| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/` | List quotations (paginated, filterable by approved, search, sort) |
| POST | `/` | Create quotation |
| GET | `/:id` | Get single quotation |
| PUT | `/:id` | Update quotation |
| DELETE | `/:id` | Delete quotation |
| PATCH | `/:id/approve` | Toggle approval status |

### 3.2 Pricing (`/api/pricing`)
| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/` | Get all pricing rows |
| PUT | `/` | Bulk update pricing |
| PUT | `/:id` | Update single pricing row |

### 3.3 Settings (`/api/settings`)
| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET/PUT | `/gst` | GST settings |
| GET/PUT | `/technical` | Technical settings |

---

## 4. Data Structure Mismatch Analysis

### 4.1 Quotation Mismatch (CRITICAL)

**Frontend `QuotationDetail` vs Backend `IQuotation`:**

| Frontend Field | Backend Field | Status |
|---------------|---------------|--------|
| firstName | customer.firstName | Nested - needs mapping |
| lastName | customer.lastName | Nested - needs mapping |
| phone | customer.phone | Nested - needs mapping |
| address | customer.address | Nested - needs mapping |
| location | customer.city + customer.state | Flat to nested - needs split |
| consumerNo | customer.consumerNo | Nested - needs mapping |
| avgMonthlyUnits | MISSING | Not in backend |
| suggestedCapacity | MISSING | Not in backend |
| uploadedBill | MISSING | Not in backend |
| dateTime | createdAt | Different names |
| amount | financial.amount | Nested - needs mapping |
| panelType | technical.panelType | Nested - needs mapping |
| numPanels | technical.numPanels | Nested - needs mapping |
| availableArea | technical.availableArea | Nested - needs mapping |
| systemArea | technical.systemArea | Nested - needs mapping |
| shortfall | technical.shortfall | Nested - needs mapping |
| siteType | customer.siteType | Nested - needs mapping |
| billingType | customer.billingType | Nested - needs mapping |
| sanctionLoad | customer.sanctionLoad | Nested - needs mapping |
| buildingHeight | technical.buildingHeight | Nested - needs mapping |

**Key Missing Fields in Backend:**
- `avgMonthlyUnits` - monthly consumption average
- `suggestedCapacity` - capacity recommendation
- `uploadedBill` - bill file reference
- `dateTime` / `createdAt` (different naming only)

### 4.2 Settings Mismatch

**Frontend expects:**
- GST percentage and toggle
- Panel type configurations
- Loan defaults (amount, interest, term)
- Profit threshold
- Expense defaults

**Backend `ISettings` provides:**
- `gstPercentage` (number)
- `includeGst` (boolean)
- `panelTypes` (array with id, name, wattage, dimensions, areaSqFt, active)

**Missing in Backend:**
- Loan default values
- Profit threshold
- Expense configuration

---

## 5. Where API Calls Need to Be Added

### 5.1 Component Mount (No useEffect Found)
**CRITICAL:** The component has NO `useEffect` hooks currently. All data is initialized from mock data.

**Add at component mount (after line 1827):**
```typescript
// Load quotations from API
useEffect(() => {
  const fetchQuotations = async () => {
    try {
      const res = await fetch(`${API_BASE}/quotations`);
      const data = await res.json();
      if (data.success) setQuotations(data.data.docs);
    } catch (err) {
      console.error('Failed to fetch quotations:', err);
    }
  };
  fetchQuotations();
}, []);
```

### 5.2 Load Pricing Data
```typescript
// Load pricing from API
useEffect(() => {
  const fetchPricing = async () => {
    try {
      const res = await fetch(`${API_BASE}/pricing`);
      const data = await res.json();
      if (data.success) setPricingRows(data.data);
    } catch (err) {
      console.error('Failed to fetch pricing:', err);
    }
  };
  fetchPricing();
}, []);
```

### 5.3 Load Settings
```typescript
// Load GST settings
useEffect(() => {
  const fetchGstSettings = async () => {
    try {
      const res = await fetch(`${API_BASE}/settings/gst`);
      const data = await res.json();
      if (data.success) {
        setGstPercentage(data.data.gstPercentage);
        setIncludeGst(data.data.includeGst);
      }
    } catch (err) {
      console.error('Failed to fetch GST settings:', err);
    }
  };
  fetchGstSettings();
}, []);
```

### 5.4 Create/Update/Delete Operations
Replace local state operations:

| Operation | Current (Local) | Replace With |
|-----------|-----------------|--------------|
| Create quotation | `setQuotations([...quotations, newQ])` | `POST /api/quotations` |
| Update quotation | `setQuotations(qs => qs.map(...))` | `PUT /api/quotations/:id` |
| Delete quotation | `setQuotations(qs => qs.filter(...))` | `DELETE /api/quotations/:id` |
| Approve quotation | `setQuotations(qs => qs.map(...))` | `PATCH /api/quotations/:id/approve` |
| Save pricing | `setPricingRows(...)` | `PUT /api/pricing` |
| Save GST | `setGstSettings(...)` | `PUT /api/settings/gst` |

---

## 6. API Integration Checklist

### Phase A: Backend Updates (Required First)
- [ ] Add `avgMonthlyUnits` to quotation schema
- [ ] Add `suggestedCapacity` to quotation schema
- [ ] Add `uploadedBill` file reference to quotation schema
- [ ] Consider adding settings for loan defaults and profit threshold

### Phase B: Frontend API Integration
- [ ] Add `useEffect` to load quotations on mount
- [ ] Add `useEffect` to load pricing on mount
- [ ] Add `useEffect` to load GST settings on mount
- [ ] Add `useEffect` to load technical settings on mount
- [ ] Replace `setQuotations` calls with API calls
- [ ] Replace `setPricingRows` calls with API calls
- [ ] Replace settings save calls with API calls
- [ ] Add loading states for each data fetch
- [ ] Add error handling for failed API calls

### Phase C: Data Mapping Layer
- [ ] Create mapper functions to transform:
  - Frontend `QuotationDetail` -> Backend `IQuotation` format
  - Backend `IQuotation` -> Frontend `QuotationDetail` format
- [ ] Handle nested vs flat structure differences

---

## 7. Mock Data Variables Summary

| Variable | Line | Type | Records | Replace With |
|----------|------|------|---------|-------------|
| `sampleQuotations` | 486 | `QuotationDetail[]` | 3 | `GET /api/quotations` |
| `initialPricing` | 430 | `PricingRow[]` | 5 | `GET /api/pricing` |
| `INITIAL_STATUS_ROWS` | 359 | `PricingStatusRow[]` | 2+ | `GET /api/pricing/status` (new) |
| `INITIAL_EXPENSE_ITEMS` | 286 | `ExpenseItem[]` | 5 | `GET /api/settings/expenses` (new) |

---

## 8. Recommendations

1. **Priority 1:** Add missing fields to backend quotation schema before frontend integration
2. **Priority 2:** Create data mapping utility layer for frontend
3. **Priority 3:** Replace mock data initialization with API calls
4. **Priority 4:** Replace CRUD operations with API calls
5. **Priority 5:** Add proper loading/error states throughout

---

**End of Report**
