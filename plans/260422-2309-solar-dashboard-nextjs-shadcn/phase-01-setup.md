# Phase 1: Project Setup & Configuration

**Context:** Previous research report `research/dashboard-analysis-report.md`

## Overview
| Item | Value |
|------|-------|
| Priority | HIGH |
| Status | COMPLETED |
| Effort | Medium |

Initialize Next.js project with shadcn/ui, configure theme with Solar Swytch colors, set up project structure.

## Requirements

### Functional
- Next.js 15 with App Router
- TypeScript strict mode
- shadcn/ui with Tailwind v4
- CSS variables for theming (no hardcoded colors in components)

### Non-Functional
- Dark mode support via next-themes
- Semantic color tokens (--primary, --accent, etc.)
- Mobile responsive base

## Theme Colors (from MagicPath design)

```css
/* Primary */
--primary-dark: #0B1E3D
--primary-purple: #7C5CFC

/* Accent */
--success: #22C55E
--info-blue: #1E4DB7
--warning-amber: #FFB800

/* Backgrounds */
--bg-page: #F8FAFC
--bg-card: #FFFFFF

/* Text */
--text-dark: #0B1E3D
--text-muted: #94A3B8
--text-light: #64748B

/* Borders */
--border-light: #E2E8F0
--border-medium: #E8EDF5
```

## Architecture

### File Structure
```
src/
├── app/
│   ├── layout.tsx          # Root layout with ThemeProvider
│   ├── globals.css         # CSS variables, Tailwind config
│   └── page.tsx           # Redirects based on auth state
├── components/
│   └── ui/                # shadcn components (future)
└── lib/
    └── utils.ts           # cn() helper
```

### CSS Variables Pattern
Use semantic tokens that map to MagicPath colors:
- `--primary` → #0B1E3D (dark navy)
- `--accent` → #7C5CFC (purple)
- `--success` → #22C55E
- `--info` → #1E4DB7
- `--warning` → #FFB800

## Implementation Steps

1. **Create Next.js project**
   ```bash
   npx create-next-app@latest frontend --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"
   cd frontend
   ```

2. **Initialize shadcn**
   ```bash
   npx shadcn@latest init --defaults
   ```

3. **Add required shadcn components**
   ```bash
   npx shadcn@latest add button card input textarea select tabs badge dialog sheet table tooltip progress toggle-group
   ```

4. **Configure tailwind.config.ts**
   - Add custom colors from theme
   - Configure --radius for shadcn

5. **Update globals.css**
   - Add CSS variables
   - Set up dark mode colors
   - Add base typography

6. **Add dependencies**
   ```bash
   npm install next-themes sonner lucide-react framer-motion clsx tailwind-merge
   ```

## Related Code Files

| File | Action |
|------|--------|
| `package.json` | Create with all dependencies |
| `tailwind.config.ts` | Add custom theme colors |
| `app/globals.css` | CSS variables, base styles |
| `app/layout.tsx` | ThemeProvider, metadata |
| `lib/utils.ts` | cn() utility |

## Todo List

- [x] Create Next.js project with TypeScript
- [x] Initialize shadcn/ui with default preset
- [x] Add all required shadcn components
- [x] Configure Tailwind with custom colors
- [x] Set up CSS variables for theming
- [x] Install additional dependencies
- [x] Create base layout with ThemeProvider

## Success Criteria

1. `npm run dev` starts without errors
2. shadcn components render correctly
3. Theme colors apply to all components
4. Dark mode toggle works
5. Mobile responsive at 375px+

## Risk Assessment

| Risk | Mitigation |
|------|------------|
| Tailwind v4 config changes | Use `--theme inline` syntax for CSS variables |
| shadcn version mismatch | Pin to latest stable (4.x) |
| Dark mode flash | Add `suppressHydrationWarning` to html |

## Next Steps

→ Phase 2: Onboarding (depends on Phase 1 completion)