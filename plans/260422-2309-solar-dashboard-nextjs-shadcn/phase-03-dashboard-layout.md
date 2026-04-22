# Phase 3: Dashboard Layout & Navigation

**Context:** Previous research report `research/dashboard-analysis-report.md`  
**Depends on:** Phase 2 (Onboarding)

## Overview
| Item | Value |
|------|-------|
| Priority | HIGH |
| Status | COMPLETED |
| Effort | Medium |

Create the dashboard shell with sidebar navigation, header, and responsive layout.

## Key Insights

- **Fixed Sidebar:** 7 navigation items with icons
- **Header:** Profile info, notifications, logout
- **Content Area:** Dynamic based on selected section
- **Responsive:** Sidebar collapses to hamburger on mobile

## Requirements

### Navigation Items
1. Dashboard (LayoutDashboard icon)
2. New Quotation (FilePlus icon)
3. Pricing Setup (Package icon)
4. Other Expenses (ReceiptText icon)
5. GST Settings (Percent icon)
6. Payment Settings (CreditCard icon)
7. Technical Settings (Settings icon)

### Sidebar Design
- Width: 240px (desktop), full overlay (mobile)
- Logo + company name at top
- Nav items with icon + label
- Active state: purple background, purple text
- Hover: slight background tint

### Header Design
- User avatar + name
- Notification bell (with badge for count)
- Logout button

### Mobile Behavior
- Hamburger menu icon in header
- Sidebar becomes Sheet (slide from left)
- Close on navigation or outside tap

## Architecture

### File Structure
```
app/dashboard/
├── layout.tsx              # Dashboard shell with sidebar
└── page.tsx                # Redirects to dashboard view

components/
├── dashboard/
│   ├── sidebar.tsx          # Navigation sidebar
│   ├── sidebar-item.tsx    # Single nav item
│   ├── header.tsx          # Top header bar
│   └── mobile-menu.tsx     # Mobile hamburger menu
└── shared/
    └── user-avatar.tsx
```

### State Management
```typescript
// Sidebar state for mobile
const [sidebarOpen, setSidebarOpen] = useState(false)

// Active section
type NavSection = 
  | 'dashboard' 
  | 'createQuotation' 
  | 'pricing' 
  | 'otherExpenses' 
  | 'gst' 
  | 'payment' 
  | 'technical'
```

## Implementation Steps

1. **Create dashboard layout**
   - `app/dashboard/layout.tsx`
   - Sidebar + Header + Content structure
   - Pass active section as context or URL param

2. **Build Sidebar Component**
   - Logo section at top
   - Navigation list
   - Active state highlighting
   - Bottom section for settings/profile

3. **Build Header Component**
   - Mobile menu toggle
   - Page title (based on active section)
   - User profile dropdown
   - Notification bell

4. **Implement Mobile Menu**
   - Use shadcn `Sheet` for overlay
   - Same nav items as desktop
   - Close on item click

5. **Add Responsive Styles**
   - `lg:pl-60` for content when sidebar visible
   - `hidden lg:flex` for desktop sidebar
   - `block lg:hidden` for mobile header

## Related Code Files

| File | Action |
|------|--------|
| `app/dashboard/layout.tsx` | Create |
| `app/dashboard/page.tsx` | Create (redirect) |
| `components/dashboard/sidebar.tsx` | Create |
| `components/dashboard/header.tsx` | Create |
| `components/dashboard/sidebar-item.tsx` | Create |
| `components/dashboard/mobile-menu.tsx` | Create |

## Todo List

- [x] Create dashboard layout structure
- [x] Build sidebar with 7 nav items
- [x] Add active state styling
- [x] Create header with user info
- [x] Implement mobile hamburger menu
- [x] Add responsive styles
- [x] Test sidebar on mobile (375px)
- [x] Add logout functionality

## Success Criteria

1. Sidebar visible on desktop (lg+)
2. Hamburger menu appears on mobile (<lg)
3. All 7 nav items clickable
4. Active section highlighted
5. Mobile menu closes on navigation
6. Header shows user avatar and name
7. Logout button functional

## Risk Assessment

| Risk | Mitigation |
|------|------------|
| Sidebar state management | Use React Context or Zustand |
| Mobile menu z-index | Ensure Sheet above other content |
| Active route detection | Use usePathname() from next/navigation |

## Next Steps

→ Phase 4: Dashboard View (main content)  
→ Phase 5: Create Quotation wizard