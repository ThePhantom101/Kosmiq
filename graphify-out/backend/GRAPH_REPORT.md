# Graph Report - apps/astro-engine  (2026-05-05)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 31 nodes · 35 edges · 7 communities (6 shown, 1 thin omitted)
- Extraction: 94% EXTRACTED · 6% INFERRED · 0% AMBIGUOUS · INFERRED: 2 edges (avg confidence: 0.8)
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
- [[_COMMUNITY_Community 4|Community 4]]
- [[_COMMUNITY_Community 5|Community 5]]

## God Nodes (most connected - your core abstractions)
1. `calculate_horoscope()` - 6 edges
2. `get_varga_position()` - 3 edges
3. `get_nakshatra()` - 3 edges
4. `ChartRequest` - 2 edges
5. `Nakshatra` - 2 edges
6. `PlanetaryPosition` - 2 edges
7. `ChartResponse` - 2 edges
8. `SynthesisRequest` - 2 edges
9. `SynthesisResponse` - 2 edges
10. `get_chart()` - 2 edges

## Surprising Connections (you probably didn't know these)
- `get_chart()` --calls--> `calculate_horoscope()`  [INFERRED]
  main.py → engine/calculator.py
- `test_calculation()` --calls--> `calculate_horoscope()`  [INFERRED]
  tests/test_calculator.py → engine/calculator.py

## Communities (7 total, 1 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.28
Nodes (7): calculate_horoscope(), get_nakshatra(), get_varga_position(), Calculates Nakshatra and Pada from longitude., Calculates planetary positions and vargas using Lahiri Ayanamsa., Calculates the longitude in a specific divisional chart (Varga).     Formula: (L, test_calculation()

### Community 1 - "Community 1"
Cohesion: 0.4
Nodes (4): format_prompt(), gemini_node(), GraphState, TypedDict

### Community 2 - "Community 2"
Cohesion: 0.4
Nodes (3): get_chart(), PlanetaryPosition, SynthesisResponse

### Community 3 - "Community 3"
Cohesion: 0.4
Nodes (5): ChartRequest, ChartResponse, Nakshatra, SynthesisRequest, BaseModel

### Community 4 - "Community 4"
Cohesion: 0.67
Nodes (3): Astro Logic, FastAPI API, Swiss Ephemeris

## Knowledge Gaps
- **4 isolated node(s):** `Runs the LangGraph AI synthesis workflow to generate a premium astrological read`, `Calculates the longitude in a specific divisional chart (Varga).     Formula: (L`, `Calculates Nakshatra and Pada from longitude.`, `Calculates planetary positions and vargas using Lahiri Ayanamsa.`
  These have ≤1 connection - possible missing edges or undocumented components.
- **1 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `get_chart()` connect `Community 2` to `Community 0`?**
  _High betweenness centrality (0.003) - this node is a cross-community bridge._
- **What connects `Runs the LangGraph AI synthesis workflow to generate a premium astrological read`, `Calculates the longitude in a specific divisional chart (Varga).     Formula: (L`, `Calculates Nakshatra and Pada from longitude.` to the rest of the system?**
  _4 weakly-connected nodes found - possible documentation gaps or missing edges._