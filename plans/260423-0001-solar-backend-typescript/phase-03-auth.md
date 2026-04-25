# Phase 3: Authentication API

**Context:** Phase 2 (Schema) complete  
**Depends on:** Phase 2

## Overview
| Item | Value |
|------|-------|
| Priority | CRITICAL |
| Status | PENDING |
| Effort | Medium |

JWT-based authentication with register, login, logout, and session management.

---

## Requirements

### Endpoints

| Method | Path | Description |
|--------|------|-------------|
| POST | /api/v1/auth/register | Create new user |
| POST | /api/v1/auth/login | Authenticate user |
| POST | /api/v1/auth/logout | Invalidate session |
| GET | /api/v1/auth/me | Get current user |

### Register Request
```typescript
{
  email: string;
  password: string;
  fullName: string;
  phone?: string;
  companyName?: string;
}
```

### Register Response
```typescript
{
  success: true;
  data: {
    user: { id, email, fullName, ... };
    token: string;
  }
}
```

### Login Request
```typescript
{
  email: string;
  password: string;
}
```

### Login Response
```typescript
{
  success: true;
  data: {
    user: { id, email, fullName, ... };
    token: string;
  }
}
```

---

## Security

- Password hashing with bcrypt (10 rounds)
- JWT with 7-day expiry
- HTTP-only cookies for web client
- Rate limiting on login endpoint

---

## Architecture

### File Structure
```
backend/src/
├── routes/auth.ts          # Auth routes
├── services/auth.service.ts # Auth business logic
├── validators/auth.validator.ts # Zod schemas
├── middleware/auth.ts     # JWT verification
└── types/index.ts         # Type definitions
```

### JWT Payload
```typescript
{
  userId: string;
  email: string;
  iat: number;
  exp: number;
}
```

---

## Implementation Steps

1. **Create type definitions**
2. **Create Zod validators**
3. **Create auth service**
4. **Create auth routes**
5. **Create auth middleware**
6. **Add JWT utilities**

---

## Todo List

- [ ] Create type definitions
- [ ] Create Zod validators
- [ ] Create auth service
- [ ] Create auth routes
- [ ] Create JWT middleware
- [ ] Implement register
- [ ] Implement login
- [ ] Implement logout
- [ ] Implement /me endpoint

---

## Success Criteria

1. Register creates user with hashed password
2. Login returns valid JWT
3. Protected routes reject invalid tokens
4. Logout invalidates session

---

## Next Steps

→ Phase 4: Quotation CRUD
