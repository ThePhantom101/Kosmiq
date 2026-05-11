# Graph Report - apps/web  (2026-05-05)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 55 nodes · 38 edges · 22 communities (20 shown, 2 thin omitted)
- Extraction: 95% EXTRACTED · 5% INFERRED · 0% AMBIGUOUS · INFERRED: 2 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `4961c5e3`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- [[_COMMUNITY_Community 0|Community 0]]
- [[_COMMUNITY_Community 1|Community 1]]
- [[_COMMUNITY_Community 2|Community 2]]
- [[_COMMUNITY_Community 3|Community 3]]

## God Nodes (most connected - your core abstractions)
1. `useAstro()` - 4 edges
2. `createClient()` - 3 edges
3. `AstroProvider()` - 2 edges
4. `LaboratoryPage()` - 2 edges
5. `AstrolabePage()` - 2 edges
6. `searchLocation()` - 2 edges
7. `getTimezone()` - 2 edges
8. `calculateChart()` - 2 edges

## Surprising Connections (you probably didn't know these)
- `LaboratoryPage()` --calls--> `useAstro()`  [INFERRED]
  src/app/(dashboard)/laboratory/page.tsx → src/context/AstroContext.tsx
- `AstrolabePage()` --calls--> `useAstro()`  [INFERRED]
  src/app/(dashboard)/astrolabe/page.tsx → src/context/AstroContext.tsx

## Communities (22 total, 2 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.2
Nodes (3): AstrolabePage(), useAstro(), LaboratoryPage()

### Community 1 - "Community 1"
Cohesion: 0.29
Nodes (6): calculateChart(), getTimezone(), searchLocation(), Astro Context, Birth Form, Next.js Frontend

## Knowledge Gaps
- **2 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Not enough signal to generate questions. This usually means the corpus has no AMBIGUOUS edges, no bridge nodes, no INFERRED relationships, and all communities are tightly cohesive. Add more files or run with --mode deep to extract richer edges._