# Solar Dashboard - Next.js + shadcn Implementation Plan

**Project:** Solar Swytch Dashboard  
**Stack:** Next.js 15 (App Router) + shadcn/ui + Tailwind CSS v4  
**Date:** 2026-04-22  
**Mode:** Parallel (Hard)

---

## Overview

Re-implement the MagicPath Solar Dashboard design using Next.js with shadcn/ui components. The application is a B2B solar business management platform with:
- User onboarding (login/register with 4-step flow)
- Dashboard with KPI cards and quotation management
- Quotation creation (3-step wizard)
- Pricing setup with inline editing
- Settings for GST, Payment, and Technical configurations

## Phases

| Phase | Description | Status |
|-------|-------------|--------|
| [phase-01-setup.md](phase-01-setup.md) | Project initialization, shadcn setup, theme | COMPLETED |
| [phase-02-onboarding.md](phase-02-onboarding.md) | Login/Register with 4-step wizard | COMPLETED |
| [phase-03-dashboard-layout.md](phase-03-dashboard-layout.md) | Dashboard shell with sidebar navigation | COMPLETED |
| [phase-04-dashboard-view.md](phase-04-dashboard-view.md) | KPI cards, donut chart, quotations table | COMPLETED |
| [phase-05-create-quotation.md](phase-05-create-quotation.md) | 3-step quotation wizard | COMPLETED |
| [phase-06-pricing-setup.md](phase-06-pricing-setup.md) | Pricing management with editing | COMPLETED |
| [phase-07-settings-views.md](phase-07-settings-views.md) | GST, Payment, Technical settings | COMPLETED |
| [phase-08-profile-panel.md](phase-08-profile-panel.md) | Profile slide-out panel | COMPLETED |

## Key Dependencies

- **Next.js 15** with App Router
- **shadcn/ui** (latest) with Tailwind v4
- **Lucide React** for icons
- **Framer Motion** for animations
- **next-themes** for dark mode
- **Sonner** for toasts

## File Ownership

| Phase | Files Owner |
|-------|-------------|
| 1 | Setup files (package.json, configs, env) |
| 2 | `app/(auth)/onboarding/*` |
| 3 | `components/dashboard/sidebar.tsx`, `app/dashboard/layout.tsx` |
| 4 | `app/dashboard/page.tsx`, `components/dashboard/*` |
| 5 | `app/dashboard/quotation/new/page.tsx` |
| 6 | `app/dashboard/pricing/page.tsx` |
| 7 | `app/dashboard/settings/*` pages |
| 8 | `components/shared/profile-panel.tsx` |

## Execution Strategy

**Phase 1-2:** Sequential (foundation must be ready)  
**Phase 3-4:** Parallel (layout + dashboard view)  
**Phase 5-8:** Sequential after core is stable

## Next Steps

→ Run `planner` subagent to create detailed phase files  
→ Red team review  
→ Validation  
→ Cook command: `/ck:cook --parallel C:/Pravin/Project/Solar/plans/260422-2309-solar-dashboard-nextjs-shadcn/plan.md`