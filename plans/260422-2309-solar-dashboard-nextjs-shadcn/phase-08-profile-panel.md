# Phase 8: Profile Panel

**Context:** Previous research report `research/dashboard-analysis-report.md`  
**Depends on:** Phase 3 (Dashboard Layout)

## Overview
| Item | Value |
|------|-------|
| Priority | HIGH |
| Status | COMPLETED |
| Effort | High |

Implement the slide-out profile panel from the dashboard header.

## Key Insights

- **Slide from Right:** Panel slides in from right edge
- **Backdrop:** Dark overlay with blur
- **Sections:** Personal Info, Company Info, Location, Contact, Bank Details
- **Photo Upload:** Camera icon to upload profile photo
- **Form Fields:** All editable with save functionality

## Requirements

### Header
- "User Profile" title
- Close button (X icon)
- Dark gradient background

### Sections

1. **Avatar & Name**
   - Circular avatar with initials fallback
   - Camera icon to upload photo
   - Name, role, email display

2. **Personal Info**
   - Full Name
   - Email Address
   - Phone
   - Business Type
   - Role

3. **Company Info**
   - Company Name
   - GST Number
   - Company Logo upload

4. **Location**
   - Business Address
   - State (dropdown)
   - City
   - Pincode

5. **Contact Numbers**
   - Primary Contact
   - Alternate Contact

6. **Bank Details**
   - Bank Name
   - Account Number
   - IFSC Code

### Features
- Success toast on save
- Cancel button to discard changes
- Form validation
- Loading state on save

## Architecture

### File Structure
```
components/
└── shared/
    ├── profile-panel.tsx        # Main slide-out panel
    ├── profile-section.tsx     # Section heading component
    ├── avatar-upload.tsx       # Avatar with upload
    └── profile-form.tsx         # Form fields
```

### Props
```typescript
interface ProfilePanelProps {
  profile: UserProfile;
  onClose: () => void;
  onSave: (profile: UserProfile) => void;
}

interface UserProfile {
  fullName: string;
  email: string;
  phone: string;
  businessType: string;
  role: string;
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
}
```

## Implementation Steps

1. **Create Profile Panel component**
   - Slide animation with Framer Motion
   - Fixed positioning
   - Backdrop with blur

2. **Build Section Headings**
   - Icon + title + divider
   - Consistent styling

3. **Create Avatar Upload**
   - Preview current photo
   - File input trigger
   - Camera icon overlay

4. **Build Form Fields**
   - All input types
   - Real-time updates
   - Validation states

5. **Add Footer**
   - Success message animation
   - Save/Cancel buttons
   - Loading state

## Related Code Files

| File | Action |
|------|--------|
| `components/shared/profile-panel.tsx` | Create |
| `components/shared/profile-section.tsx` | Create |
| `components/shared/avatar-upload.tsx` | Create |
| `components/dashboard/header.tsx` | Update (add profile trigger) |

## Todo List

- [x] Create profile panel with slide animation
- [x] Build all form sections
- [x] Implement avatar upload
- [x] Add form validation
- [x] Create success animation
- [x] Wire up with header button

## Success Criteria

1. Panel slides in from right
2. Backdrop closes panel on click
3. All form fields editable
4. Photo upload works
5. Save shows success toast
6. Cancel discards changes

## Risk Assessment

| Risk | Mitigation |
|------|------------|
| Large form state | Use react-hook-form |
| Image upload | Validate file type/size, compress if needed |
| Form validation | Zod schema validation |

## Next Steps

→ Final integration testing  
→ Phase 9: Testing & Polish (if needed)