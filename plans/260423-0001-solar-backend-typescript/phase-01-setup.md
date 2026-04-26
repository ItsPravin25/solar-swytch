# Phase 1: Project Setup

**Context:** Backend implementation plan  
**Depends on:** None

## Overview
| Item | Value |
|------|-------|
| Priority | CRITICAL |
| Status | PENDING |
| Effort | Low |

Initialize the Express + TypeScript backend project with all dependencies.

---

## Requirements

### Package.json
```json
{
  "name": "solar-swytch-backend",
  "version": "1.0.0",
  "description": "Backend API for Solar Swytch Dashboard",
  "main": "dist/index.js",
  "scripts": {
    "dev": "tsx watch src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js",
    "db:push": "prisma db push",
    "db:generate": "prisma generate",
    "db:migrate": "prisma migrate dev",
    "db:seed": "tsx prisma/seed.ts"
  }
}
```

### Dependencies
| Package | Purpose |
|---------|---------|
| express | Web framework |
| typescript | Type safety |
| prisma + @prisma/client | ORM + DB client |
| pg | PostgreSQL driver |
| bcryptjs | Password hashing |
| jsonwebtoken | JWT auth |
| zod | Request validation |
| cors | CORS middleware |
| helmet | Security headers |
| morgan | HTTP logging |
| dotenv | Environment config |

### Dev Dependencies
| Package | Purpose |
|---------|---------|
| tsx | TypeScript execution |
| @types/* | Type definitions |
| jest + supertest | Testing |
| prisma | CLI |

---

## Architecture

### File Structure
```
backend/
├── src/
│   ├── index.ts                 # App entry point
│   ├── config/
│   │   └── database.ts          # Prisma singleton
│   ├── middleware/
│   │   ├── auth.ts              # JWT middleware
│   │   ├── error-handler.ts     # Global error handler
│   │   └── validate.ts          # Zod middleware
│   └── routes/
│       └── index.ts             # Route aggregator
├── prisma/
│   └── schema.prisma
├── package.json
├── tsconfig.json
└── .env.example
```

### Database Connection
- PostgreSQL connection via Prisma
- Connection pooling
- Graceful shutdown handling

---

## Implementation Steps

1. **Create backend directory structure**
2. **Initialize package.json**
3. **Create tsconfig.json**
4. **Install dependencies**
5. **Create Prisma schema skeleton**
6. **Create Express app entry point**
7. **Add middleware (CORS, helmet, morgan)**
8. **Create .env.example**

---

## Todo List

- [ ] Create directory structure
- [ ] Initialize package.json
- [ ] Create tsconfig.json
- [ ] Install dependencies
- [ ] Create Prisma schema
- [ ] Create Express app
- [ ] Create .env.example

---

## Success Criteria

1. Backend compiles without errors
2. `npm run dev` starts server
3. Prisma connects to database
4. Health check endpoint works

---

## Risk Assessment

| Risk | Mitigation |
|------|------------|
| PostgreSQL not available | Provide docker-compose.yml |
| Dependency conflicts | Pin versions |

---

## Next Steps

→ Phase 2: Database Schema
