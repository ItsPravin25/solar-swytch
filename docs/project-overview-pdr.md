# Project Overview & PDR - Solar Dashboard

## Project Name

Solar Dashboard - Solar Quotation Management System

## Project Type

Web Application (SaaS) - B2B/B2C for Indian solar market

## Core Functionality

A comprehensive dashboard for creating, managing, and tracking solar panel quotations with integrated ROI calculations, pricing tables, and GST-compliant documentation.

## Target Users

| User Type | Use Case |
|-----------|----------|
| Solar Dealers | Create quotations, manage pricing, track sales |
| Individual Customers | View quotations, compare options, understand ROI |
| Sales Representatives | Generate quotes on-the-go, share with customers |

## Product Development Requirements (PDR)

### Functional Requirements

#### 1. Authentication & User Management
- **FR-001**: User registration with email verification
- **FR-002**: Login with email/password
- **FR-003**: Multi-step onboarding wizard
- **FR-004**: Role selection (Dealer/Individual)
- **FR-005**: User profile management
- **FR-006**: Avatar upload

#### 2. Dashboard
- **FR-010**: Dashboard overview with KPIs
- **FR-011**: Sidebar navigation
- **FR-012**: Responsive mobile menu
- **FR-013**: User settings access

#### 3. Quotation Management
- **FR-020**: Quotation list view
- **FR-021**: Create new quotation wizard
- **FR-022**: Customer information capture
- **FR-023**: Financial details input
- **FR-024**: Technical specifications
- **FR-025**: Quotation status tracking
- **FR-026**: PDF preview and download

#### 4. Solar Calculations
- **FR-030**: Monthly generation calculation
- **FR-031**: ROI calculation (payback period)
- **FR-032**: CO2 savings calculation
- **FR-033**: Panel count calculation
- **FR-034**: System area calculation
- **FR-035**: Loan EMI calculator

#### 5. Pricing
- **FR-040**: Panel type pricing table
- **FR-041**: GST calculation (18%)
- **FR-042**: Subsidy calculation (up to 78,000)
- **FR-043**: Price comparison view

#### 6. Settings
- **FR-050**: GST settings configuration
- **FR-051**: Payment settings
- **FR-052**: Technical settings

### Non-Functional Requirements

| ID | Requirement | Target |
|----|-------------|--------|
| NFR-001 | Page load time | < 2s |
| NFR-002 | Responsive design | Mobile-first |
| NFR-003 | Browser support | Chrome, Firefox, Safari, Edge |
| NFR-004 | Accessibility | WCAG 2.1 AA |
| NFR-005 | Security | HTTPS, secure auth |

### Technical Constraints

- **TC-001**: Must use Next.js 14+ with App Router
- **TC-002**: Must use shadcn/ui components
- **TC-003**: Must support INR currency
- **TC-004**: Must handle 18% GST rates
- **TC-005**: Peak sun hours: 4.5 (Indian average)

### Assumptions

- Target market: India (INR, 18% GST, Indian solar policies)
- Panel lifetime: 25 years
- Performance ratio: 75%
- Peak sun hours: 4.5 hours/day
- Government subsidy: Up to Rs. 78,000

## Technical Specifications

### Solar Calculation Constants

```typescript
const PEAK_SUN_HOURS = 4.5;
const PERFORMANCE_RATIO = 0.75;
const DAYS_PER_MONTH = 30;
const CO2_FACTOR_KG_PER_KWH = 0.71;
const PANEL_LIFE_YEARS = 25;
const DEFAULT_SUBSIDY = 78000;
```

### Calculation Formulas

**Monthly Generation (kWh)**
```
= System kW × 4.5 × 30 × 0.75
```

**Payback Period (months)**
```
= (System Cost - Subsidy) / Annual Savings × 12
```

**CO2 Saved (tonnes/year)**
```
= System kW × 4.5 × 365 × 0.75 × 0.71 / 1000
```

### Panel Types

| Type | Wattage | Area (sq ft) |
|------|---------|--------------|
| Standard | 330W | 18 |
| Premium | 440W | 21 |
| High Efficiency | 545W | 25 |

### EMI Calculation

```
EMI = P × r × (1+r)^n / ((1+r)^n - 1)

Where:
- P = Principal loan amount
- r = Monthly interest rate (annual/12/100)
- n = Number of months
```

## Acceptance Criteria

### Authentication
- [ ] User can register with email
- [ ] User can login with credentials
- [ ] User completes onboarding wizard
- [ ] Invalid credentials show error message

### Dashboard
- [ ] Sidebar shows navigation items
- [ ] Mobile menu works correctly
- [ ] User can access settings
- [ ] KPI cards display calculations

### Quotation
- [ ] Wizard has 3 steps with indicator
- [ ] Each step validates required fields
- [ ] Final submission creates quotation
- [ ] Status chips show correct states

### Calculations
- [ ] ROI matches expected values
- [ ] CO2 calculation is accurate
- [ ] Currency formatting is correct (INR)
- [ ] EMI calculator works correctly

### Performance
- [ ] Page loads in under 2 seconds
- [ ] Smooth transitions and animations
- [ ] No layout shift on load

## Implementation Status

| Feature | Status |
|---------|--------|
| Authentication | COMPLETED |
| Onboarding | COMPLETED |
| Dashboard | COMPLETED |
| Quotation Wizard | COMPLETED |
| Calculations | COMPLETED |
| Pricing | COMPLETED |
| Settings | COMPLETED |
| Backend API | PENDING |
| PDF Generation | PENDING |

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2026-04-22 | Initial frontend implementation |
