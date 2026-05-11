# Workflow: Connect Component to API

Steps:
1. Read graphify-out/graph_report.md — find existing endpoint
2. Use @rest-api-design — confirm endpoint contract matches ROUTES.md
3. Create a custom hook (useXxx) — never fetch directly in component
4. Use @error-handling-patterns — handle loading, error, empty states
5. Never modify backend — if endpoint is missing, flag it for Shan to add manually
