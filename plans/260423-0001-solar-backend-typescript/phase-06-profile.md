# Phase 6: User Profile

**Context:** Phase 5 (Pricing) complete  
**Depends on:** Phase 5

## Overview
| Item | Value |
|------|-------|
| Priority | HIGH |
| Status | PENDING |
| Effort | Medium |

Manage user profile including personal info, company details, and bank information.

---

## Requirements

### Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | /api/v1/profile | Get user profile |
| PUT | /api/v1/profile | Update user profile |
| POST | /api/v1/profile/photo | Upload profile photo |

### Profile Fields

**Personal Info:**
- fullName: string
- email: string (read-only)
- phone: string
- businessType: string
- role: string

**Company Info:**
- companyName: string
- gstNumber: string
- logoUrl: string

**Location:**
- address: string
- state: string
- city: string
- pincode: string

**Contact:**
- primaryContact: string
- alternateContact: string

**Bank Details:**
- bankName: string
- accountNumber: string
- ifscCode: string

---

## Architecture

### File Structure
```
backend/src/
├── routes/profile.ts
├── services/profile.service.ts
└── validators/profile.validator.ts
```

---

## Implementation Steps

1. **Create profile types**
2. **Create Zod validators**
3. **Create profile service**
4. **Create profile routes**
5. **Implement file upload for photo**

---

## Todo List

- [ ] Create profile types
- [ ] Create Zod validators
- [ ] Create profile service
- [ ] Create GET /profile
- [ ] Create PUT /profile
- [ ] Create POST /profile/photo

---

## Success Criteria

1. GET returns all profile fields
2. PUT updates non-email fields
3. Photo upload stores file URL

---

## Next Steps

→ Phase 7: Financial Calculations
