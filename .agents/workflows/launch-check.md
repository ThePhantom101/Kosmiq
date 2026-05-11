# Workflow: Launch Readiness Check

Steps:
1. Use @production-code-audit — full sweep
2. Use @wcag-audit-patterns — accessibility pass
3. Use @seo-meta-optimizer — meta tags on all public routes
4. Use @i18n-localization — check all user-facing strings
5. Use @frontend-performance — Lighthouse targets: LCP < 2.5s, CLS < 0.1
6. Use @copywriting — audit all chart insight copy for GenZ tone
7. Generate final report of issues before deploying
