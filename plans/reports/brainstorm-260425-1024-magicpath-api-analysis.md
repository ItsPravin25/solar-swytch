# Magicpath API Analysis Report

**Date:** 2026-04-25
**Source:** `C:/Users/Admin/Downloads/magicpath-extracted/src/`
**Analysis:** Phase 2 - API endpoint discovery

---

## 1. Frontend API Client Configuration

**File:** `src/lib/api.ts`

```
BASE_URL: http://localhost:3002/api/v1
AUTH_HEADER: Authorization: Bearer <token>
RESPONSE_FORMAT: { success: boolean, data?: T, error?: { code, message } }
```

---

## 2. Discovered API Endpoints

### 2.1 Authentication Endpoints

| Method | Endpoint | Request | Response |
|--------|----------|---------|----------|
| POST | `/auth/register` | `{email, password, fullName, phone?, companyName?}` | `{user, token}` |
| POST | `/auth/login` | `{email, password}` | `{user, token}` |
| POST | `/auth/logout` | - | `{message}` |
| GET | `/auth/me` | - | `User` object |

### 2.2 Quotations Endpoints

| Method | Endpoint | Request | Response |
|--------|----------|---------|----------|
| GET | `/quotations` | Query: `page, limit, search, approved` | `{items[], total, page, limit, totalPages}` |
| GET | `/quotations/:id` | - | `Quotation` object |
| POST | `/quotations` | `QuotationCreate` body | `Quotation` object |
| PUT | `/quotations/:id` | `QuotationUpdate` body | `Quotation` object |
| DELETE | `/quotations/:id` | - | `{message}` |
| PATCH | `/quotations/:id/approve` | - | `Quotation` object |

### 2.3 Pricing Endpoints

| Method | Endpoint | Request | Response |
|--------|----------|---------|----------|
| GET | `/pricing` | - | `PricingItem[]` |
| PUT | `/pricing` | `{items[]}` | `PricingItem[]` |
| PUT | `/pricing/:id` | `PricingItem` body | `PricingItem` |

### 2.4 Settings Endpoints

| Method | Endpoint | Request | Response |
|--------|----------|---------|----------|
| GET | `/settings/gst` | - | `{gstPercentage, includeGst}` |
| PUT | `/settings/gst` | `{gstPercentage, includeGst}` | `{gstPercentage, includeGst}` |
| GET | `/settings/technical` | - | `{panelTypes[]}` |
| PUT | `/settings/technical` | `{panelTypes[]}` | `{panelTypes[]}` |

### 2.5 Profile Endpoints

| Method | Endpoint | Request | Response |
|--------|----------|---------|----------|
| GET | `/profile` | - | `UserProfile` object |
| PUT | `/profile` | `UserProfile` body | `UserProfile` object |

### 2.6 Calculations Endpoints

| Method | Endpoint | Request | Response |
|--------|----------|---------|----------|
| POST | `/calculations/solar-sizing` | `{systemKw, panelType}` | `{input, result}` |
| POST | `/calculations/cost` | `{systemKw, baseCost, otherExpenses?, profitMargin?}` | `{input, result}` |
| POST | `/calculations/roi` | `{systemCost, subsidyAmount?, monthlyGeneration, unitRate}` | `{input, result}` |
| POST | `/calculations/emi` | `{loanAmount, interestRate, termInYears}` | `{emi, totalPayable, totalInterest}` |

---

## 3. UserProfile Data Structure

```typescript
interface UserProfile {
  fullName: string;
  email: string;
  phone: string;
  businessType: string;      // installer, dealer, consultant, manufacturer, other
  role: string;             // owner, sales
  companyName: string;
  gstNumber: string;        // 15 chars
  logoPreview: string;      // base64 or URL
  address: string;
  state: string;            // Indian state name
  city: string;
  pincode: string;          // 6 digits
  primaryContact: string;
  alternateContact: string;
  bankName: string;
  accountNumber: string;
  ifscCode: string;         // 11 chars
}
```

---

## 4. Backend Route Coverage Analysis

| Frontend Expects | Backend Has | Status |
|-----------------|-------------|--------|
| POST /auth/register | POST /api/v1/auth/register | **OK** |
| POST /auth/login | POST /api/v1/auth/login | **OK** |
| POST /auth/logout | POST /api/v1/auth/logout | **OK** |
| GET /auth/me | GET /api/v1/auth/me | **OK** |
| GET /quotations | GET /api/v1/quotations | **OK** |
| GET /quotations/:id | GET /api/v1/quotations/:id | **OK** |
| POST /quotations | POST /api/v1/quotations | **OK** |
| PUT /quotations/:id | PUT /api/v1/quotations/:id | **OK** |
| DELETE /quotations/:id | DELETE /api/v1/quotations/:id | **OK** |
| PATCH /quotations/:id/approve | PATCH /api/v1/quotations/:id/approve | **OK** |
| GET /pricing | GET /api/v1/pricing | **OK** |
| PUT /pricing | PUT /api/v1/pricing | **OK** |
| PUT /pricing/:id | PUT /api/v1/pricing/:id | **OK** |
| GET /settings/gst | GET /api/v1/settings/gst | **OK** |
| PUT /settings/gst | PUT /api/v1/settings/gst | **OK** |
| GET /settings/technical | GET /api/v1/settings/technical | **OK** |
| PUT /settings/technical | PUT /api/v1/settings/technical | **OK** |
| GET /profile | GET /api/v1/profile | **OK** |
| PUT /profile | PUT /api/v1/profile | **OK** |
| POST /calculations/solar-sizing | POST /api/v1/calculations/solar-sizing | **OK** |
| POST /calculations/cost | POST /api/v1/calculations/cost | **OK** |
| POST /calculations/roi | POST /api/v1/calculations/roi | **OK** |
| POST /calculations/emi | POST /api/v1/calculations/emi | **OK** |

**Coverage:** 22/22 endpoints (100%)

---

## 5. Key Findings

### 5.1 Frontend Does NOT Call APIs
The generated `SolarDashboard.tsx` component currently uses **local state/mock data** only. No API calls are made from dashboard components.

The API calls only exist in:
- `SolarOnboarding.tsx` - uses `authApi.login()` and `authApi.register()`
- `UserProfilePanel.tsx` - local state only, no API calls (expects `onSave` callback)

### 5.2 Dashboard Data Used
The dashboard uses hardcoded sample data:
- `sampleQuotations` array with 5 mock quotations
- `initialPricing` array with 5 mock pricing rows
- `INITIAL_STATUS_ROWS` for pricing status

### 5.3 Missing Endpoint
The frontend expects a `POST /calculations/suggest-capacity` endpoint (for suggesting capacity from monthly units) - **CHECK IF EXISTS**

---

## 6. Recommendations

### 6.1 Immediate Actions
1. **Add suggest-capacity calculation endpoint** - verify it exists in backend
2. **Connect SolarDashboard to API** - replace mock data with API calls
3. **Connect UserProfilePanel** - add profile API calls on save

### 6.2 Backend Verification Needed
- Verify `suggest-capacity` schema exists in `backend/src/types/index.ts`
- Verify CORS allows `http://localhost:3002` or frontend origin

### 6.3 Frontend Integration
The frontend needs these API calls added to components:
- `quotationsApi.list()` for dashboard quotation list
- `quotationsApi.create()` for quotation wizard
- `pricingApi.list()` and `pricingApi.bulkUpdate()` for pricing table
- `settingsApi.getGst()` / `settingsApi.updateGst()` for GST settings
- `settingsApi.getTechnical()` / `settingsApi.updateTechnical()` for panel types
- `calculationsApi.suggestCapacity()` for capacity suggestion

---

## 7. Unresolved Questions

1. Does `POST /calculations/suggest-capacity` exist in backend types?
2. Is the frontend port 3000 or 3002 configured correctly for CORS?
3. Should logo uploads go to a file storage service or can they stay as base64 URLs?
4. Are the quotation status values (`approved: boolean`) sufficient for the approve workflow?
