# Phase 2: Database Schema

**Context:** Phase 1 (Setup) complete  
**Depends on:** Phase 1

## Overview
| Item | Value |
|------|-------|
| Priority | CRITICAL |
| Status | PENDING |
| Effort | Medium |

Design and create Prisma schema for all entities.

---

## Data Models

### User
```prisma
model User {
  id            String    @id @default(cuid())
  email         String    @unique
  password      String
  fullName      String
  phone         String?
  businessType  String?
  role          String?
  companyName   String?
  gstNumber     String?
  address       String?
  state         String?
  city          String?
  pincode       String?
  primaryContact String?
  alternateContact String?
  bankName      String?
  accountNumber String?
  ifscCode      String?
  logoUrl       String?
  profilePhoto  String?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  quotations    Quotation[]
  pricing       Pricing[]
  settings      UserSettings?
}
```

### Quotation
```prisma
model Quotation {
  id              String   @id @default(cuid())
  userId          String
  user            User     @relation(fields: [userId], references: [id])

  // Customer Info
  firstName       String
  lastName        String
  phone           String
  address         String
  location        String
  consumerNo      String
  sanctionLoad    String
  siteType        String
  billingType     String

  // Technical Info
  systemCapacity  String
  systemType      String   // on-grid | off-grid | hybrid
  panelType       String   // mono-standard | mono-large | topcon
  roofType        String
  phase           String   // 1-Phase | 3-Phase
  areaLength      String?
  areaWidth       String?
  buildingHeight  String?
  numPanels       Int
  availableArea   String?
  systemArea      String?
  shortfall       String?

  // Financial Info
  monthlyGeneration Int
  monthlySavings  Int
  annualSavings   Int
  subsidyAmount   Int
  actualInvestment Int
  paybackYears    Int
  paybackMonths   Int
  totalSavings    Int
  loanAmount      Int
  loanEmi         Int
  loanPayable     Int
  amount          String
  unitRate        Float    @default(6.0)

  // Meta
  approved        Boolean  @default(false)
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
}
```

### Pricing
```prisma
model Pricing {
  id              String   @id @default(cuid())
  userId          String
  user            User     @relation(fields: [userId], references: [id])

  capacity        String   // 1kW-10kW
  phase           String   // single | three
  panelCost       Float    @default(0)
  inverterCost    Float    @default(0)
  structureCost   Float    @default(0)
  cableCost       Float    @default(0)
  otherCost       Float    @default(0)
  totalCost       Float    @default(0)
  status          String   @default("pending")

  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  @@unique([userId, capacity, phase])
}
```

### UserSettings
```prisma
model UserSettings {
  id              String   @id @default(cuid())
  userId          String   @unique
  user            User     @relation(fields: [userId], references: [id])

  // GST Settings
  gstPercentage   Float    @default(18)
  includeGst      Boolean  @default(true)

  // Panel Types (stored as JSON)
  panelTypes      Json     // Array of panel type configs

  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
}
```

---

## Implementation Steps

1. **Create Prisma schema**
2. **Define all models**
3. **Add relationships**
4. **Add indexes for queries**
5. **Push to database**

---

## Todo List

- [ ] Create schema.prisma
- [ ] Define User model
- [ ] Define Quotation model
- [ ] Define Pricing model
- [ ] Define UserSettings model
- [ ] Add indexes
- [ ] Run db:push

---

## Success Criteria

1. Schema validates without errors
2. Database tables created
3. Relationships work correctly

---

## Next Steps

→ Phase 3: Authentication API
