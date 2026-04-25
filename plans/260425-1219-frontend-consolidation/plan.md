---
title: "Consolidate Frontends & Fix User Data"
description: "Remove frontnend/, keep magicpath-frontend, fix SolarDashboard to show real user data from MongoDB"
status: completed
priority: P1
effort: 2h
created: 2026-04-25
---

# Frontend Consolidation & Data Fix Plan

## Problem Statement

User can login to magicpath-frontend, but their account data (quotations, settings, profile) doesn't show up because `SolarDashboard.tsx` uses **mock data** instead of real API calls.

## Current State

| Component | Status | Issue |
|-----------|--------|-------|
| `frontnend/` | Next.js with shadcn/ui | TO BE REMOVED |
| `magicpath-frontend/` | Vite + React | TO BE KEPT - main frontend |
| Backend (MongoDB) | Running on port 3001 | Has all user data |
| SolarDashboard.tsx | Uses mock data | **PROBLEM: No API calls** |

## Solution

1. Remove `frontnend/` directory
2. Keep `magicpath-frontend/` as the only frontend
3. Rewrite `SolarDashboard.tsx` to fetch from API instead of using mock data
4. Ensure user-specific data loads on login

## Phases

| # | Phase | Status | Effort |
|---|-------|--------|--------|
| 1 | Remove frontnend/ | Pending | 5m |
| 2 | Analyze SolarDashboard data needs | Pending | 15m |
| 3 | Update SolarDashboard API calls | Pending | 1h |
| 4 | Test login + data display | Pending | 30m |

## Data That Should Show

When user logs in, dashboard should display:

1. **Quotations** - from `GET /api/v1/quotations?userId=X`
2. **Settings** - from `GET /api/v1/settings`
3. **Profile info** - from `GET /api/v1/profile`
4. **KPI calculations** - from calculation endpoints

## Implementation Steps

### Phase 1: Remove frontnend/

1. Delete `frontnend/` directory
2. Update gitignore if needed

### Phase 2: Analyze SolarDashboard

Read `SolarDashboard.tsx` to find:
- Where mock data is defined
- What data structures are used
- How to replace with API calls

Expected mock data structure:
```typescript
// These need to be replaced with API calls
const quotations = [...mock data...]
const settings = {...mock settings...}
```

### Phase 3: Update SolarDashboard API Calls

1. Add useEffect to fetch data on mount
2. Add loading states
3. Add error handling
4. Filter data by logged-in userId

```typescript
useEffect(() => {
  async function fetchData() {
    setLoading(true);
    try {
      const [quotations, settings, profile] = await Promise.all([
        quotationsApi.list({ userId: user.id }),
        settingsApi.getGst(),
        profileApi.get()
      ]);
      setQuotations(quotations.items || []);
      setSettings(settings);
      setProfile(profile);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }
  fetchData();
}, [user.id]);
```

### Phase 4: Test

1. Start backend: `cd backend && npm run dev`
2. Start frontend: `cd magicpath-frontend && npm run dev`
3. Login with existing credentials
4. Verify data appears in dashboard

## Files to Modify

| File | Action |
|------|--------|
| `magicpath-frontend/src/components/generated/SolarDashboard.tsx` | Rewrite to use API |
| `magicpath-frontend/src/lib/api.ts` | Ensure all methods exist |
| `frontnend/` | DELETE |

## Success Criteria

- Only ONE frontend exists (magicpath-frontend)
- User login shows their real data from MongoDB
- Quotations, profile, settings all load correctly