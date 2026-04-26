# Phase 4: Quotation CRUD

**Context:** Phase 3 (Auth) complete  
**Depends on:** Phase 3

## Overview
| Item | Value |
|------|-------|
| Priority | HIGH |
| Status | PENDING |
| Effort | High |

Full CRUD for quotations with filtering, pagination, and approval workflow.

---

## Requirements

### Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | /api/v1/quotations | List quotations (paginated) |
| POST | /api/v1/quotations | Create quotation |
| GET | /api/v1/quotations/:id | Get single quotation |
| PUT | /api/v1/quotations/:id | Update quotation |
| DELETE | /api/v1/quotations/:id | Delete quotation |
| PATCH | /api/v1/quotations/:id/approve | Approve quotation |

### Query Parameters (GET list)
```typescript
{
  page?: number;      // default 1
  limit?: number;     // default 10
  search?: string;     // search by name/phone
  approved?: boolean;  // filter by approval status
  sortBy?: string;     // field to sort by
  sortOrder?: 'asc' | 'desc';
}
```

### Create Request
```typescript
{
  // Customer Info
  firstName: string;
  lastName: string;
  phone: string;
  address: string;
  location: string;
  consumerNo: string;
  sanctionLoad: string;
  siteType: string;
  billingType: string;

  // Technical Info
  systemCapacity: string;
  systemType: SystemType;
  panelType: PanelType;
  roofType: string;
  phase: PhaseType;
  areaLength?: string;
  areaWidth?: string;
  buildingHeight?: string;

  // Financial Info
  unitRate?: number;
}
```

---

## Architecture

### File Structure
```
backend/src/
├── routes/quotations.ts
├── services/quotation.service.ts
└── validators/quotation.validator.ts
```

### Service Methods
```typescript
class QuotationService {
  findAll(userId: string, filters: QuotationFilters): Promise<PaginatedResult>
  findById(id: string, userId: string): Promise<Quotation | null>
  create(userId: string, data: CreateQuotationDTO): Promise<Quotation>
  update(id: string, userId: string, data: UpdateQuotationDTO): Promise<Quotation>
  delete(id: string, userId: string): Promise<void>
  approve(id: string, userId: string): Promise<Quotation>
}
```

---

## Implementation Steps

1. **Create quotation types**
2. **Create Zod validators**
3. **Create quotation service**
4. **Create quotation routes**
5. **Implement pagination**
6. **Implement search/filter**

---

## Todo List

- [ ] Create quotation types
- [ ] Create Zod validators
- [ ] Create quotation service
- [ ] Create GET /quotations (list)
- [ ] Create POST /quotations
- [ ] Create GET /quotations/:id
- [ ] Create PUT /quotations/:id
- [ ] Create DELETE /quotations/:id
- [ ] Create PATCH /quotations/:id/approve

---

## Success Criteria

1. List returns paginated results
2. Create calculates all financial fields
3. Update respects ownership
4. Delete removes from database
5. Approve sets approved=true

---

## Next Steps

→ Phase 5: Pricing Management
