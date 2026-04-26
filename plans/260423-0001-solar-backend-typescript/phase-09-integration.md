# Phase 9: Frontend Integration

**Context:** Phase 8 (Settings) complete  
**Depends on:** Phase 8

## Overview
| Item | Value |
|------|-------|
| Priority | CRITICAL |
| Status | PENDING |
| Effort | High |

Connect frontend to backend API with proper error handling and authentication.

---

## Requirements

### Frontend API Layer

Create `frontnend/src/lib/api.ts` with:

```typescript
// API client with JWT handling
const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

class ApiClient {
  private token: string | null = null;

  setToken(token: string) { ... }
  clearToken() { ... }

  async get<T>(path: string): Promise<T>
  async post<T>(path: string, data?: unknown): Promise<T>
  async put<T>(path: string, data?: unknown): Promise<T>
  async patch<T>(path: string, data?: unknown): Promise<T>
  async delete<T>(path: string): Promise<T>
}
```

### API Modules

| Module | File | Purpose |
|--------|------|---------|
| Auth | `lib/api/auth.ts` | Login, register, logout |
| Quotations | `lib/api/quotations.ts` | CRUD operations |
| Pricing | `lib/api/pricing.ts` | Pricing management |
| Profile | `lib/api/profile.ts` | User profile |
| Settings | `lib/api/settings.ts` | GST, technical |
| Calculations | `lib/api/calculations.ts` | ROI, EMI |

### Environment Variables

Create `frontnend/.env.local`:
```bash
NEXT_PUBLIC_API_URL=http://localhost:3001/api/v1
```

### Auth Context

Update `frontnend/src/contexts/auth-context.tsx`:
- Store JWT token
- Include token in API requests
- Handle token refresh/expiry

---

## Integration Points

### Login Page
- POST to `/auth/login`
- Store token in context
- Redirect to dashboard

### Dashboard
- Fetch quotations on load
- Display data from API

### Create Quotation
- POST to `/quotations`
- Calculate server-side before save

### Settings
- Read/write GST settings
- Read/write panel types

---

## Error Handling

### API Error Format
```typescript
{
  success: false;
  error: {
    code: string;
    message: string;
    details?: unknown;
  }
}
```

### Frontend Error States
- 401: Redirect to login
- 400: Show validation errors
- 500: Show generic error toast

---

## Architecture

### File Structure
```
frontnend/src/
├── lib/
│   ├── api/
│   │   ├── index.ts         # ApiClient
│   │   ├── auth.ts
│   │   ├── quotations.ts
│   │   ├── pricing.ts
│   │   ├── profile.ts
│   │   ├── settings.ts
│   │   └── calculations.ts
│   └── api.ts               # Exports
├── contexts/
│   └── auth-context.tsx     # Updated
└── .env.local
```

---

## Implementation Steps

1. **Create API client**
2. **Create auth API module**
3. **Create quotation API module**
4. **Create pricing API module**
5. **Create profile API module**
6. **Create settings API module**
7. **Create calculations API module**
8. **Update auth context**
9. **Update frontend pages**
10. **Add error handling**

---

## Todo List

- [ ] Create ApiClient class
- [ ] Create auth API module
- [ ] Create quotation API module
- [ ] Create pricing API module
- [ ] Create profile API module
- [ ] Create settings API module
- [ ] Create calculations API module
- [ ] Update auth context
- [ ] Update login page
- [ ] Update dashboard
- [ ] Add error handling
- [ ] Test integration

---

## Success Criteria

1. Frontend talks to backend
2. Auth flow works end-to-end
3. All CRUD operations work
4. Calculations match frontend-only mode

---

## Next Steps

→ Finalize and test
