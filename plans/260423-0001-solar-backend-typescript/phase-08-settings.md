# Phase 8: Settings Endpoints

**Context:** Phase 7 (Calculations) complete  
**Depends on:** Phase 7

## Overview
| Item | Value |
|------|-------|
| Priority | MEDIUM |
| Status | PENDING |
| Effort | Low |

Settings for GST, Payment, and Technical configurations.

---

## Requirements

### Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | /api/v1/settings/gst | Get GST settings |
| PUT | /api/v1/settings/gst | Update GST settings |
| GET | /api/v1/settings/technical | Get panel types |
| PUT | /api/v1/settings/technical | Update panel types |

### GST Settings
```typescript
// Request
{
  gstPercentage: number;  // 0-100
  includeGst: boolean;
}

// Response
{
  gstPercentage: number;
  includeGst: boolean;
}
```

### Technical Settings (Panel Types)
```typescript
// Panel Type
interface PanelType {
  id: 'mono-standard' | 'mono-large' | 'topcon';
  name: string;
  wattage: number;
  dimensions: string;
  areaSqFt: number;
  active: boolean;
}

// Request
{
  panelTypes: PanelType[];
}

// Response
{
  panelTypes: PanelType[];
}
```

### Default Panel Types
```typescript
const DEFAULT_PANEL_TYPES = [
  {
    id: 'mono-standard',
    name: 'Monocrystalline (Standard)',
    wattage: 540,
    dimensions: '2256×1134mm',
    areaSqFt: 22,
    active: true,
  },
  {
    id: 'mono-large',
    name: 'Monocrystalline (Large)',
    wattage: 585,
    dimensions: '2278×1134mm',
    areaSqFt: 24,
    active: true,
  },
  {
    id: 'topcon',
    name: 'TOPCon (N-Type)',
    wattage: 590,
    dimensions: '2172×1303mm',
    areaSqFt: 22,
    active: true,
  },
];
```

---

## Architecture

### File Structure
```
backend/src/
├── routes/settings.ts
├── services/settings.service.ts
└── validators/settings.validator.ts
```

---

## Implementation Steps

1. **Create settings types**
2. **Create Zod validators**
3. **Create settings service**
4. **Create settings routes**
5. **Add default panel types**

---

## Todo List

- [ ] Create settings types
- [ ] Create Zod validators
- [ ] Create settings service
- [ ] Create GET /settings/gst
- [ ] Create PUT /settings/gst
- [ ] Create GET /settings/technical
- [ ] Create PUT /settings/technical
- [ ] Set default panel types

---

## Success Criteria

1. GST settings persist per user
2. Panel types configurable
3. Defaults created on first access

---

## Next Steps

→ Phase 9: Frontend Integration
