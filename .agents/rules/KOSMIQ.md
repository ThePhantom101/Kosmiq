# KOSMIQ — Master Agent Rules

## Identity
Kosmiq is a Vedic astrology web app for global GenZ and Millennials.
Black and gold UI. English-first, Sanskrit terms in parentheses.
Precision engine + personality-driven interface.

## Tech Stack (NEVER change without explicit instruction)
- Backend: FastAPI + pyswisseph running in WSL2 — DO NOT TOUCH
- Frontend: React + Tailwind v4 + shadcn/ui
- AI layer: Gemini API — chart JSON passed as system context
- DB: PostgreSQL + Redis
- Theme: Dark background (#0a0a0a base), gold accent (#C9A84C)

## Project Files to Read Before Every Session
1. ROUTES.md — navigation and naming contract
2. graphify-out/graph_report.md — full codebase map

## Hard Rules
- Never modify any file in /backend without explicit permission
- Never rename existing API endpoints or Pydantic schemas
- Never install new dependencies without listing them first
- Never use purple, violet, or gradient buttons (AI aesthetic)
- Never hardcode route strings — always reference ROUTES.md
- Always use Tailwind tokens, never arbitrary CSS values
- All Sanskrit terms must have English translation in parentheses
- Every component must have a mobile-first responsive layout
- All chart calculation endpoints must have both GET (db ID) and POST (raw JSON) variants to support the "me" context.

## Naming Conventions
- Components: PascalCase (ChartShell, AppShell, DashaTimeline)
- Routes: kebab-case (/chart/:id/dasha-timeline)
- API calls: camelCase hooks (useChartData, useDashaTimeline)
- Files: kebab-case (chart-shell.tsx, dasha-timeline.tsx)

## Active Skills
@react-patterns @tailwind-design-system @tailwind-patterns
@shadcn @core-components @scroll-experience @frontend-performance
@ui-ux-pro @wcag-audit-patterns @rest-api-design
@error-handling-patterns @testing-patterns @refactoring
@uncle-bob-craft @code-review @production-code-audit
@software-architecture @brainstorming @seo-meta-optimizer
@i18n-localization @copywriting

## Current Phase
Phase 1 — UI Shell Rebuild (AppShell + ChartShell)
Backend is complete and accurate. Only frontend work allowed.
