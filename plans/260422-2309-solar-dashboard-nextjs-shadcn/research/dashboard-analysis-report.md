# Solar Dashboard Deep Analysis Report

## Source Analysis

**Project:** Solar Swytch - Solar Business Management Platform  
**Source:** MagicPath Design Export (`magicpath-project.zip`)  
**Components Analyzed:**
- `SolarDashboard.tsx` (Full dashboard - 2000+ lines)
- `SolarOnboarding.tsx` (4-step registration flow)
- `UserProfilePanel.tsx` (Profile management slide-out)
- `SolarSwytch.tsx` (App state management)
- `types.d.ts` (TypeScript interfaces)

---

## 1. Dashboard Components Breakdown

### 1.1 Navigation Sidebar
- **Type:** Vertical icon + label navigation
- **Items:** Dashboard, New Quotation, Pricing Setup, Other Expenses, GST Settings, Payment Settings, Technical Settings
- **Behavior:** Single-section display at a time
- **Icon:** Lucide React icons (16px)

### 1.2 Dashboard View (Main)
**KPI Cards (4 gradient cards):**
1. **Total Quotations** - Count with "Quotations" label
2. **Approved** - Count with green accent
3. **Total Savings** - INR amount with green accent
4. **CO2 Saved** - Tonnes with leaf icon

**Donut Chart:**
- Shows approved vs pending ratio
- Center displays total count
- Green (#22C55E) = Approved, Blue (#1E4DB7) = Pending

**Recent Quotations Table:**
- Columns: Customer Name, System, Amount, Status (chip), Date, Actions
- Filter tabs: All, Approved, Pending
- Row actions: View (eye icon), Download (PDF), Edit (pencil)
- Status chips: Green for Approved, Blue for Pending

### 1.3 Create Quotation View (3 Steps)
**Step 1 - Customer Information:**
- First Name, Last Name
- Phone, Address, Location
- Consumer No, Sanction Load (kW)
- Site Type dropdown
- Billing Type dropdown

**Step 2 - Technical Details:**
- System Capacity (kW)
- System Type (On-Grid/Off-Grid/Hybrid)
- Panel Type (Mono Standard/Mono Large/TOPCon)
- Roof Type (RCC/Sheet/Ground)
- Area measurements (Length, Width, Building Height)
- Auto-calculated: Available Area, System Area, Shortfall

**Step 3 - Financial Calculation:**
- Auto-populated from Pricing Setup
- Monthly Generation (units)
- Monthly Savings (INR)
- Annual Savings (INR)
- Subsidy calculation
- ROI details
- Download/Print buttons

### 1.4 Pricing Setup View
**Table Structure:**
- Rows: 1kW through 10kW
- Columns: Capacity, Panel Cost, Inverter Cost, Structure Cost, Cable Cost, Other Cost, Total, Actions
- Phase indicator (1-Phase / 3-Phase)
- Edit/Save inline editing

### 1.5 Other Expenses View
**Expense Items (toggleable):**
- Installation Team Charges (default ON)
- Material Transport Charges (default ON)
- Liaison Charges (default OFF)
- Structure Installation Cost (default ON)
- Other Expenses (default OFF)

### 1.6 GST Settings View
- GST Percentage input
- Toggle to include/exclude GST in quotes

### 1.7 Payment Settings View
**Loan Calculator Fields:**
- Loan Amount (INR)
- Interest Rate (%)
- Term (Years)
- Auto-calculated: Total Payable, EMI/month

### 1.8 Technical Settings View
**Panel Type Management:**
- Panel Name
- Wattage Range
- Dimensions
- Area per panel (sqft)
- Status toggle (active/inactive)

---

## 2. UI Patterns Identified

### 2.1 Color Palette
| Color | Hex | Usage |
|-------|-----|-------|
| Primary Dark | `#0B1E3D` | Headers, primary buttons |
| Primary Purple | `#7C5CFC` | Accents, active states |
| Success Green | `#22C55E` | Approved status, positive metrics |
| Info Blue | `#1E4DB7` | Pending status, secondary info |
| Warning Amber | `#FFB800` | CTAs, highlights |
| Background | `#F8FAFC` | Page background |
| Card White | `#FFFFFF` | Card backgrounds |
| Border Light | `#E2E8F0` | Input borders |
| Text Dark | `#0B1E3D` | Primary text |
| Text Muted | `#94A3B8` | Secondary text |
| Text Light | `#64748B` | Tertiary text |

### 2.2 Typography
- **Font Family:** System font stack (SF Pro, Helvetica Neue)
- **Heading:** Bold, letter-spacing: -0.02em to -0.04em
- **Body:** Regular weight, 14-16px
- **Labels:** Semibold, 12px uppercase with tracking

### 2.3 Component States
| State | Style |
|-------|-------|
| Default | White bg, #E2E8F0 border |
| Focus | Purple ring (#7C5CFC) |
| Hover | Slight background change |
| Active/Selected | Purple bg tint, purple border |
| Disabled | Gray bg, reduced opacity |
| Error | Red border, red text |

### 2.4 Spacing System
- **Card padding:** 16-24px
- **Input padding:** 10-14px
- **Section gaps:** 20px
- **Component gaps:** 12px

### 2.5 Border Radius
- **Cards:** 16px (rounded-xl)
- **Buttons:** 12px (rounded-xl)
- **Inputs:** 12px
- **Badges/Chips:** Full (rounded-full)

---

## 3. Key Interactions & Behaviors

### 3.1 Form Dependencies
1. **Sanction Load → Phase:** 1-4kW = 1-Phase, 5-8kW = Both, 9-10kW = 3-Phase
2. **System Capacity → Pricing:** Auto-populates from pricing setup
3. **Area Inputs → Calculations:** Length × Width = Available Area

### 3.2 Conditional Visibility
- **Quotation Step 3:** Only shows after capacity entered in Step 2
- **Loan Calculator:** Only shows when loan amount > 0
- **Business vs Customer PDF:** Different document templates

### 3.3 Data Flow
1. User enters customer info → Creates quotation
2. Pricing setup feeds into quotation calculations
3. GST settings apply to final calculations
4. PDF generation pulls all data together

---

## 4. Technical Observations

### 4.1 Animation Patterns
- Framer Motion for page transitions
- Spring physics: stiffness 340, damping 38
- Slide-in panels (from right)
- Fade transitions

### 4.2 State Management
- Local React state (useState)
- Props drilling for shared data
- No external state library

### 4.3 Form Handling
- Controlled inputs
- Real-time validation
- Auto-formatting (INR, phone numbers)

---

## 5. shadcn/ui Component Mapping

| MagicPath Component | Recommended shadcn Component |
|---------------------|------------------------------|
| Custom inputs | `Input`, `Textarea` |
| Dropdowns | `Select`, `SelectTrigger`, `SelectContent` |
| Tables | `Table`, `TableHead`, `TableRow`, etc. |
| Dialogs | `Dialog`, `DialogContent`, `DialogHeader` |
| Sidebar | `Sheet`, `SheetContent` (for mobile) |
| Tabs | `Tabs`, `TabsList`, `TabsTrigger` |
| Buttons | `Button` (multiple variants) |
| Cards | `Card`, `CardHeader`, `CardContent` |
| Badges/Chips | `Badge` |
| Forms | `Field`, `FieldLabel`, `FieldGroup` |
| Toasts | `sonner` (toast) |
| Progress | `Progress` |
| Toggle | `Toggle`, `ToggleGroup` |
| Tooltip | `Tooltip`, `TooltipTrigger`, `TooltipContent` |

---

## 6. Next.js App Router Structure

```
src/
├── app/
│   ├── layout.tsx           # Root layout with providers
│   ├── page.tsx             # Redirects to dashboard or onboarding
│   ├── onboarding/
│   │   └── page.tsx        # Login/Register flow
│   ├── dashboard/
│   │   ├── layout.tsx      # Dashboard shell with sidebar
│   │   ├── page.tsx        # Main dashboard view
│   │   ├── quotation/
│   │   │   ├── new/
│   │   │   └── [id]/
│   │   ├── pricing/
│   │   ├── expenses/
│   │   ├── gst/
│   │   ├── payment/
│   │   └── technical/
├── components/
│   ├── ui/                  # shadcn components
│   ├── dashboard/           # Dashboard-specific components
│   │   ├── sidebar.tsx
│   │   ├── kpi-cards.tsx
│   │   ├── quotation-table.tsx
│   │   ├── quotation-form.tsx
│   │   ├── pricing-table.tsx
│   │   └── ...
│   ├── onboarding/
│   │   ├── login-form.tsx
│   │   ├── register-steps.tsx
│   │   └── ...
│   └── shared/
│       ├── header.tsx
│       ├── profile-panel.tsx
│       └── ...
├── lib/
│   ├── utils.ts
│   ├── calculations.ts      # Solar/ROI calculations
│   └── constants.ts         # Static data
├── hooks/
│   ├── use-quotation.ts
│   ├── use-pricing.ts
│   └── use-profile.ts
└── types/
    └── index.ts
```

---

## 7. Implementation Priority

| Phase | Components | Priority |
|-------|------------|----------|
| 1 | Project Setup, Theme, Base Components | HIGH |
| 2 | Onboarding (Login/Register) | HIGH |
| 3 | Dashboard Layout + Sidebar | HIGH |
| 4 | Dashboard View (KPI + Table) | HIGH |
| 5 | Create Quotation (3 Steps) | HIGH |
| 6 | Pricing Setup | MEDIUM |
| 7 | Other Expenses | MEDIUM |
| 8 | GST Settings | LOW |
| 9 | Payment Settings | LOW |
| 10 | Technical Settings | LOW |
| 11 | PDF Generation | MEDIUM |
