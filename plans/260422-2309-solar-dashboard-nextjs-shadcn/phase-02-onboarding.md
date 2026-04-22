# Phase 2: Onboarding - Login & Registration

**Context:** Previous research report `research/dashboard-analysis-report.md`  
**Depends on:** Phase 1 (Project Setup)

## Overview
| Item | Value |
|------|-------|
| Priority | HIGH |
| Status | COMPLETED |
| Effort | High |

Implement the 4-step registration wizard and login form from MagicPath design.

## Key Insights

- **4-Step Wizard:** Account → Role → Profile → Security
- **Split Layout:** Left branding panel (hidden on mobile), right form
- **Animations:** Framer Motion slide transitions between steps
- **Validation:** Real-time field validation with visual feedback
- **Indian Context:** GST numbers, Indian states, INR formatting

## Requirements

### Functional

#### Step 1 - Account
- Full Name (text)
- Email Address (email)
- Phone Number (tel with +91 prefix hint)

#### Step 2 - Role
- Business Type (radio cards): Solar Installer/EPC, Dealer/Distributor, Consultant, Manufacturer, Other
- Role (select): Business Owner, Sales Executive
- "Looks good" confirmation message appears when both selected

#### Step 3 - Profile (Company)
- Company Name (text)
- GST Number (uppercase auto-format, 15 chars)
- Company Logo (upload with preview)
- Business Address (textarea)
- State (dropdown from Indian states)
- City (text)
- Pincode (numeric, 6 digits)
- Primary Contact (tel)
- Alternate Contact (tel)
- Bank Name (text)
- Account Number (numeric)
- IFSC Code (uppercase, 11 chars)

#### Step 4 - Security
- Password (with show/hide toggle)
- Confirm Password (with match validation)
- Terms acceptance checkbox

### Non-Functional
- Progress indicator showing current step
- Back/Next navigation
- Mobile-first responsive design

## Architecture

### File Structure
```
app/(auth)/
├── layout.tsx              # Auth layout (no sidebar)
├── onboarding/
│   └── page.tsx           # Main onboarding page
└── login/
    └── page.tsx           # Login page (separate entry)

components/
├── auth/
│   ├── onboarding-wizard.tsx    # 4-step wizard
│   ├── step-account.tsx         # Step 1
│   ├── step-role.tsx            # Step 2
│   ├── step-profile.tsx         # Step 3
│   ├── step-security.tsx        # Step 4
│   ├── login-form.tsx           # Login form
│   └── branding-panel.tsx       # Left panel
├── ui/
│   └── (shadcn components)
└── shared/
    └── field-wrapper.tsx
```

### State Management
```typescript
interface OnboardingState {
  step: 1 | 2 | 3 | 4;
  form: {
    // Step 1
    fullName: string;
    email: string;
    phone: string;
    // Step 2
    businessType: string;
    businessTypeOther: string;
    role: string;
    // Step 3
    companyName: string;
    gstNumber: string;
    logoPreview: string;
    address: string;
    state: string;
    city: string;
    pincode: string;
    primaryContact: string;
    alternateContact: string;
    bankName: string;
    accountNumber: string;
    ifscCode: string;
    // Step 4
    password: string;
    confirmPassword: string;
  };
}
```

## Implementation Steps

1. **Create auth route group**
   - `app/(auth)/layout.tsx` - Centered layout without sidebar
   - `app/(auth)/onboarding/page.tsx` - Entry point

2. **Create Branding Panel** (`branding-panel.tsx`)
   - Gradient background (#0B1E3D to #133366)
   - Sun icon with "Solar Swytch" branding
   - Hindi tagline with Marathi text
   - Feature points with icons

3. **Create Step Components**
   - `step-account.tsx` - Name, email, phone inputs
   - `step-role.tsx` - Business type cards + role select
   - `step-profile.tsx` - All company fields with sections
   - `step-security.tsx` - Password fields with validation

4. **Create Onboarding Wizard**
   - Step indicator with progress
   - Animated step transitions
   - Back/Next buttons
   - Form validation per step

5. **Create Login Form**
   - Email + Password fields
   - Remember me checkbox
   - Forgot password link
   - Submit button with loading state

## Related Code Files

| File | Action |
|------|--------|
| `components/auth/branding-panel.tsx` | Create |
| `components/auth/step-account.tsx` | Create |
| `components/auth/step-role.tsx` | Create |
| `components/auth/step-profile.tsx` | Create |
| `components/auth/step-security.tsx` | Create |
| `components/auth/login-form.tsx` | Create |
| `app/(auth)/onboarding/page.tsx` | Create |
| `app/(auth)/login/page.tsx` | Create |
| `app/(auth)/layout.tsx` | Create |

## Todo List

- [x] Create auth layout with centered container
- [x] Build branding panel component
- [x] Implement step 1 (Account fields)
- [x] Implement step 2 (Business type + Role)
- [x] Implement step 3 (Company profile)
- [x] Implement step 4 (Password + validation)
- [x] Create onboarding wizard with transitions
- [x] Build login form with validation
- [x] Add responsive styles (mobile-first)
- [x] Test step navigation and validation

## Success Criteria

1. 4-step registration wizard functional
2. All form validations work correctly
3. Business type selection shows/hides "Other" input
4. Password matching validation
5. Branding panel displays on desktop, hidden on mobile
6. Step indicator shows progress
7. Back button returns to previous step
8. Login form validates email/password

## Risk Assessment

| Risk | Mitigation |
|------|------------|
| Complex form state | Use React useReducer or form library (react-hook-form) |
| Animation performance | Use transform/opacity only, respect reduced-motion |
| Mobile layout | Use responsive Tailwind classes, test at 375px |

## Next Steps

→ Phase 3: Dashboard Layout (depends on auth being functional)  
→ Phase 4: Dashboard View (can run in parallel after Phase 3)