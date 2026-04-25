---
title: "Phase 4 - Connect Frontend to API"
description: "Wire up all frontend components to MongoDB-backed API"
status: pending
priority: P1
effort: 1h
phase: 4
---

# Phase 4: Connect Frontend to API

## Overview

Wire up all migrated frontend components to the MongoDB-backed API endpoints. Ensure end-to-end data flow from dashboard to database.

## Context Links

- [Phase 1](./phase-01-setup-mongodb.md) - MongoDB models
- [Phase 2](./phase-02-formula-apis.md) - API endpoints
- [Phase 3](./phase-03-migrate-frontend.md) - Migrated components

## Key Insights

- Most integration work in this phase
- Test all data flows: create, read, update, delete
- Ensure loading states during API calls
- Handle errors gracefully with user feedback

## Requirements

### Functional
- Dashboard fetches quotations from MongoDB
- KPI cards calculate from real data
- Quotation wizard saves to MongoDB
- Pricing table reads/writes to MongoDB
- Settings save to MongoDB

### Non-functional
- Loading skeletons during data fetch
- Error toast notifications
- Optimistic updates where appropriate
- Token refresh on 401

## Integration Points

| Component | API Endpoint | Method |
|-----------|-------------|--------|
| Dashboard KPI | GET /api/v1/quotations | Count & sum |
| Quotation Table | GET /api/v1/quotations | List |
| Quotation Wizard | POST /api/v1/quotations | Create |
| Pricing Table | GET/PUT /api/v1/pricing | Read/Write |
| Settings | GET/PUT /api/v1/settings | Read/Write |
| Calculations | POST /api/v1/calculations/* | Compute |

## Implementation Steps

1. **Update dashboard page**
   - Fetch quotations on mount
   - Calculate KPI totals from response
   - Pass data to kpi-grid and quotation-table

2. **Update quotation wizard**
   - Step transitions call calculation APIs
   - Final submit creates quotation record
   - Redirect to dashboard on success

3. **Update pricing page**
   - Fetch pricing on mount
   - Edit saves via PUT endpoint
   - Show loading during save

4. **Update settings pages**
   - Fetch current settings on mount
   - Save updates via PUT endpoint
   - Show success/error feedback

5. **Add error handling**
   - Wrap all API calls in try-catch
   - Show toast on errors
   - Retry option for network failures

6. **Add loading states**
   - Skeleton components while loading
   - Button loading states
   - Table row skeletons

## API Response Handling

```typescript
// Standard response format
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// Handle in components
const { data, isLoading, error } = useQuery({
  queryKey: ['quotations'],
  queryFn: () => api.get('/quotations')
});
```

## Todo List

- [ ] Update dashboard page to fetch data
- [ ] Wire up quotation wizard to API
- [ ] Connect pricing table to API
- [ ] Connect settings pages to API
- [ ] Add loading states
- [ ] Add error handling
- [ ] Test end-to-end flow

## Success Criteria

- Dashboard shows data from MongoDB
- Quotation creation saves to database
- Pricing edits persist
- Settings save correctly
- No console errors
- All forms functional

## Security Considerations

- JWT token validation on all requests
- User can only see their own data
- Input sanitization on server

## Next Steps

All phases complete. Ready for testing and review.