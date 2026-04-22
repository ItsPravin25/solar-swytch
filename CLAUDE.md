# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is the **claudekit-engineer** boilerplate template for building software projects with Claude Code. The actual application code (`backend/`, `frontnend/`) is not yet initialized — this repository provides the agent configuration, skills, and orchestration rules.

## Core Workflow

Follow this sequence for implementation tasks:

1. **Plan** → Delegate to `planner` agent to create implementation plan with TODO tasks in `./plans`
2. **Research** → Use parallel `researcher` agents for technical topics
3. **Implement** → Write clean, production-ready code (never mock/simulate)
4. **Simplify** → Use `simplify` skill to refactor for reuse and efficiency
5. **Test** → Delegate to `tester` agent; run tests and fix failures until all pass
6. **Review** → Delegate to `code-reviewer` agent
7. **Document** → Delegate to `docs-manager` agent to update `./docs`

## Key Rules

- **YAGNI / KISS / DRY** — Avoid speculative code
- **File naming**: kebab-case with descriptive names; keep files under 200 lines
- **No mocking** — Implement real code, not simulations to pass tests
- **Never ignore failing tests** — Fix them properly, don't bypass for the build
- **No secrets in commits** — Never commit .env, API keys, or credentials
- **Conventional commits** — Use `feat:`, `fix:`, `docs:`, `refactor:`, `test:`, `chore:`

## Orchestration

- Spawn subagents with the **work context path** (project root), **reports path** (`{work_context}/plans/reports/`), and **plans path** (`{work_context}/plans/`) in the prompt
- **Sequential chaining**: Planning → Implementation → Simplification → Testing → Review
- **Parallel execution**: Independent components can run simultaneously with no file conflicts

## Skills Activation

Activate relevant skills from `.claude/skills/` based on the task:
- `backend-development` — API design, authentication, databases, DevOps
- `better-auth` — OAuth, email/password auth
- `docs-seeker` — Search latest documentation
- `ai-multimodal` — Image/video/document analysis and generation
- `sequential-thinking` — Debugging and complex analysis
- `react-best-practices` — React/frontend patterns
- `bootstrap` — Project initialization

## Visual Explanations

Use `/preview` for complex topics:
- `/preview --explain <topic>` — ASCII + Mermaid explanations
- `/preview --diagram <topic>` — Architecture and data flow
- `/preview --slides <topic>` — Step-by-step walkthroughs
- `/preview --ascii <topic>` — Terminal-friendly output

## Agent Teams (Multi-Session)

For multi-agent collaboration, activate the `/team` skill. See `.claude/skills/team/SKILL.md` for templates.
