# Graph Report - .  (2026-05-06)

## Corpus Check
- Corpus is ~12,006 words - fits in a single context window. You may not need a graph.

## Summary
- 140 nodes · 113 edges · 50 communities
- Extraction: 96% EXTRACTED · 4% INFERRED · 0% AMBIGUOUS · INFERRED: 4 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Predictions Area|Predictions Area]]
- [[_COMMUNITY_Astro Engine Service|Astro Engine Service]]
- [[_COMMUNITY_Celestial Calculations|Celestial Calculations]]
- [[_COMMUNITY_Frontend Chart Logic|Frontend Chart Logic]]
- [[_COMMUNITY_App Layout & Routing|App Layout & Routing]]
- [[_COMMUNITY_AI Synthesis Module|AI Synthesis Module]]
- [[_COMMUNITY_Marketing Landing|Marketing Landing]]
- [[_COMMUNITY_Astro Engine|Astro Engine]]

## God Nodes (most connected - your core abstractions)
1. `calculate_horoscope()` - 6 edges
2. `useAstro()` - 6 edges
3. `BirthForm()` - 5 edges
4. `createClient()` - 4 edges
5. `get_varga_position()` - 3 edges
6. `get_nakshatra()` - 3 edges
7. `LaboratoryPage()` - 3 edges
8. `CompatibilityPage()` - 3 edges
9. `AstrolabePage()` - 3 edges
10. `searchLocation()` - 3 edges

## Surprising Connections (you probably didn't know these)
- `get_chart()` --calls--> `calculate_horoscope()`  [INFERRED]
  apps/astro-engine/main.py → apps/astro-engine/engine/calculator.py
- `calculate_horoscope()` --calls--> `test_calculation()`  [INFERRED]
  apps/astro-engine/engine/calculator.py → apps/astro-engine/tests/test_calculator.py
- `useAstro()` --calls--> `LaboratoryPage()`  [INFERRED]
  apps/web/src/context/AstroContext.tsx → apps/web/src/app/(dashboard)/laboratory/page.tsx
- `useAstro()` --calls--> `AstrolabePage()`  [INFERRED]
  apps/web/src/context/AstroContext.tsx → apps/web/src/app/(dashboard)/astrolabe/page.tsx

## Communities (50 total, 0 thin omitted)

### Community 0 - "Predictions Area"
Cohesion: 0.11
Nodes (10): ChroniclesPage(), CompatibilityPage(), handleSignOut(), NexusCard(), NexusPage(), handleEmailLogin(), handleSocialLogin(), OraclePage() (+2 more)

### Community 1 - "Astro Engine Service"
Cohesion: 0.27
Nodes (9): ChartRequest, ChartResponse, generate_synthesis(), Nakshatra, PlanetaryPosition, Runs the LangGraph AI synthesis workflow to generate a premium astrological read, SynthesisRequest, SynthesisResponse (+1 more)

### Community 2 - "Celestial Calculations"
Cohesion: 0.24
Nodes (8): get_chart(), calculate_horoscope(), get_nakshatra(), get_varga_position(), Calculates Nakshatra and Pada from longitude., Calculates planetary positions and vargas using Lahiri Ayanamsa., Calculates the longitude in a specific divisional chart (Varga).     Formula: (L, test_calculation()

### Community 3 - "Frontend Chart Logic"
Cohesion: 0.39
Nodes (4): calculateChart(), getTimezone(), searchLocation(), BirthForm()

### Community 4 - "App Layout & Routing"
Cohesion: 0.25
Nodes (3): AstroProvider(), DashboardLayout(), MarketingLayout()

### Community 5 - "AI Synthesis Module"
Cohesion: 0.4
Nodes (4): format_prompt(), gemini_node(), GraphState, TypedDict

### Community 6 - "Marketing Landing"
Cohesion: 0.6
Nodes (3): AstrolabePage(), useAstro(), LaboratoryPage()

### Community 7 - "Astro Engine"
Cohesion: 0.5
Nodes (5): Astro Engine, Docker, Kosmiq Web App, Supabase, Vedic Intelligence

## Knowledge Gaps
- **4 isolated node(s):** `Runs the LangGraph AI synthesis workflow to generate a premium astrological read`, `Calculates the longitude in a specific divisional chart (Varga).     Formula: (L`, `Calculates Nakshatra and Pada from longitude.`, `Calculates planetary positions and vargas using Lahiri Ayanamsa.`
  These have ≤1 connection - possible missing edges or undocumented components.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `useAstro()` connect `Marketing Landing` to `Predictions Area`, `App Layout & Routing`?**
  _High betweenness centrality (0.023) - this node is a cross-community bridge._
- **Are the 2 inferred relationships involving `calculate_horoscope()` (e.g. with `get_chart()` and `test_calculation()`) actually correct?**
  _`calculate_horoscope()` has 2 INFERRED edges - model-reasoned connections that need verification._
- **Are the 2 inferred relationships involving `useAstro()` (e.g. with `LaboratoryPage()` and `AstrolabePage()`) actually correct?**
  _`useAstro()` has 2 INFERRED edges - model-reasoned connections that need verification._
- **What connects `Runs the LangGraph AI synthesis workflow to generate a premium astrological read`, `Calculates the longitude in a specific divisional chart (Varga).     Formula: (L`, `Calculates Nakshatra and Pada from longitude.` to the rest of the system?**
  _4 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Predictions Area` be split into smaller, more focused modules?**
  _Cohesion score 0.11 - nodes in this community are weakly interconnected._