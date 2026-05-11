# Graph Report - kosmiq  (2026-05-11)

## Corpus Check
- 129 files · ~54,964 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 567 nodes · 855 edges · 119 communities (112 shown, 7 thin omitted)
- Extraction: 72% EXTRACTED · 28% INFERRED · 0% AMBIGUOUS · INFERRED: 237 edges (avg confidence: 0.59)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `8d415258`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- [[_COMMUNITY_Predictions Area|Predictions Area]]
- [[_COMMUNITY_Astro Engine Service|Astro Engine Service]]
- [[_COMMUNITY_Celestial Calculations|Celestial Calculations]]
- [[_COMMUNITY_Frontend Chart Logic|Frontend Chart Logic]]
- [[_COMMUNITY_App Layout & Routing|App Layout & Routing]]
- [[_COMMUNITY_AI Synthesis Module|AI Synthesis Module]]
- [[_COMMUNITY_Marketing Landing|Marketing Landing]]
- [[_COMMUNITY_Astro Engine|Astro Engine]]
- [[_COMMUNITY_NavHUD Component|NavHUD Component]]
- [[_COMMUNITY_Planetary Data UI|Planetary Data UI]]
- [[_COMMUNITY_Reading Display|Reading Display]]
- [[_COMMUNITY_Background System|Background System]]
- [[_COMMUNITY_Soul Signature UI|Soul Signature UI]]
- [[_COMMUNITY_Chart Generation API|Chart Generation API]]
- [[_COMMUNITY_Auth Callback|Auth Callback]]
- [[_COMMUNITY_Marketing Layout|Marketing Layout]]
- [[_COMMUNITY_Login Page|Login Page]]
- [[_COMMUNITY_Dashboard View|Dashboard View]]
- [[_COMMUNITY_Calibration - Events|Calibration - Events]]
- [[_COMMUNITY_Calibration - Zodiac|Calibration - Zodiac]]
- [[_COMMUNITY_Calibration - Biodata|Calibration - Biodata]]
- [[_COMMUNITY_Chart Rectification Tool|Chart Rectification Tool]]
- [[_COMMUNITY_Monthly Predictions|Monthly Predictions]]
- [[_COMMUNITY_Account Settings|Account Settings]]
- [[_COMMUNITY_Tests Package|Tests Package]]
- [[_COMMUNITY_TypeScript Env|TypeScript Env]]
- [[_COMMUNITY_ESLint Config|ESLint Config]]
- [[_COMMUNITY_Next.js Config|Next.js Config]]
- [[_COMMUNITY_PostCSS Config|PostCSS Config]]

## God Nodes (most connected - your core abstractions)
1. `Biodata` - 45 edges
2. `LifeEvent` - 45 edges
3. `Profile` - 44 edges
4. `Chart` - 44 edges
5. `useAstro()` - 30 edges
6. `calculate_vimshottari()` - 16 edges
7. `make_planets()` - 15 edges
8. `compute_transit_score()` - 12 edges
9. `detect_mangal_dosha()` - 12 edges
10. `detect_sade_sati()` - 9 edges

## Surprising Connections (you probably didn't know these)
- `get_chart()` --calls--> `calculate_horoscope()`  [INFERRED]
  apps/astro-engine/main.py → apps/astro-engine/engine/calculator.py
- `compute_yogas_logic()` --calls--> `detect_all_yogas()`  [INFERRED]
  apps/astro-engine/main.py → apps/astro-engine/engine/yogas.py
- `compute_monthly_forecast_logic()` --calls--> `calculate_vimshottari()`  [INFERRED]
  apps/astro-engine/main.py → apps/astro-engine/engine/dasha.py
- `save_biodata()` --calls--> `Biodata`  [INFERRED]
  apps/astro-engine/main.py → apps/astro-engine/engine/db.py
- `save_life_event()` --calls--> `LifeEvent`  [INFERRED]
  apps/astro-engine/main.py → apps/astro-engine/engine/db.py

## Communities (119 total, 7 thin omitted)

### Community 0 - "Predictions Area"
Cohesion: 0.13
Nodes (64): AntardashaDetail, BiodataRequest, ChartRequest, ChartResponse, CompatibilityNarrativeRequest, CompatibilityRequest, CompatibilityResponse, compute_monthly_forecast_logic() (+56 more)

### Community 1 - "Astro Engine Service"
Cohesion: 0.08
Nodes (44): detect_all_yogas(), detect_budha_aditya(), detect_chandra_mangala(), detect_gaja_kesari(), detect_hamsa(), detect_neecha_bhanga_raja(), detect_saraswati(), _get_lon() (+36 more)

### Community 2 - "Celestial Calculations"
Cohesion: 0.07
Nodes (42): get_flags(), Compute astrological flag conditions: Sade Sati and Mangal Dosha.      Sade Sati, compute_flags(), detect_mangal_dosha(), detect_sade_sati(), _get_current_saturn_longitude(), _house_from(), Astrological flags engine.  Detects key life-affecting conditions:   - Sade Sati (+34 more)

### Community 3 - "Frontend Chart Logic"
Cohesion: 0.09
Nodes (34): get_dasha(), get_dasha_by_chart(), Calculate Vimshottari Dasha from the Moon's natal nakshatra.      Accepts the fu, Calculate Vimshottari Dasha directly from a stored chart.      Resolves the char, _add_percent(), _add_years(), _build_antardasha(), calculate_moon_nakshatra() (+26 more)

### Community 4 - "App Layout & Routing"
Cohesion: 0.09
Nodes (30): get_transit_score(), Compute a 0–100 transit favorability score for today's sky against the natal cha, _aspect_delta(), compute_transit_score(), _get_current_positions(), _house_from(), Transit score engine.  Computes a 0-100 "favorable transit score" reflecting how, Compute a 0-100 transit favorability score.      Args:         natal_planets: di (+22 more)

### Community 5 - "AI Synthesis Module"
Cohesion: 0.08
Nodes (13): AccountPage(), ChroniclesPage(), CompatibilityPage(), fetchNarrative(), handleCalculate(), handleSignOut(), NexusCard(), NexusPage() (+5 more)

### Community 6 - "Marketing Landing"
Cohesion: 0.14
Nodes (10): ChatMessageBubble(), useChat(), addYears(), buildAntardashas(), getDashaSequenceFrom(), useDasha(), buildChartContext(), detectAlerts() (+2 more)

### Community 7 - "Astro Engine"
Cohesion: 0.16
Nodes (12): get_chart(), get_varga(), get_varga_by_chart(), Calculate a specific divisional chart (Varga) for all planets., Calculate a specific divisional chart from a stored chart.      Resolves chart f, calculate_horoscope(), get_nakshatra(), get_varga_position() (+4 more)

### Community 8 - "NavHUD Component"
Cohesion: 0.19
Nodes (5): AstrolabePage(), useAstro(), useYogas(), LaboratoryPage(), SamhitaMatches()

### Community 9 - "Planetary Data UI"
Cohesion: 0.21
Nodes (10): compatibility_narrative(), get_monthly_narrative(), format_compatibility_prompt(), format_monthly_narrative_prompt(), format_prompt(), gemini_node(), generate_compatibility_narrative(), generate_monthly_narrative_ai() (+2 more)

### Community 10 - "Reading Display"
Cohesion: 0.31
Nodes (4): calculateChart(), getTimezone(), searchLocation(), BirthForm()

### Community 11 - "Background System"
Cohesion: 0.22
Nodes (3): ChartHeroBanner(), MetricCards(), QuickLinks()

### Community 12 - "Soul Signature UI"
Cohesion: 0.32
Nodes (4): useChartStrengths(), deriveBestHouse(), derivePlanetMetrics(), normalizeScores()

### Community 13 - "Chart Generation API"
Cohesion: 0.25
Nodes (3): AstroProvider(), DashboardLayout(), MarketingLayout()

### Community 14 - "Auth Callback"
Cohesion: 0.33
Nodes (6): compute_shadow_planets_logic(), get_shadow_planets(), get_shadow_planets_post(), Core logic to calculate shadow planets., Calculate shadow planets (POST variant)., Calculate Shadow Planets (Upagrahas) from DB ID.

### Community 15 - "Marketing Layout"
Cohesion: 0.33
Nodes (6): compute_transits_logic(), get_current_transits(), get_transits_post(), Core logic for transit calculations., Calculate current transits from POSTed chart data., Get current transits relative to a natal chart.

### Community 16 - "Login Page"
Cohesion: 0.33
Nodes (6): compute_yogas_logic(), get_yogas(), get_yogas_by_chart_id(), Core logic to detect and categorize yogas., Detect classical Vedic yoga combinations (POST variant)., Detect yogas from DB ID.

### Community 17 - "Dashboard View"
Cohesion: 0.47
Nodes (5): calculate_compatibility(), calculate_compatibility_logic(), calculate_koota(), check_mangal_dosha(), n1, n2: Nakshatra indices (1-27)     s1, s2: Sign indices (0-11)

### Community 18 - "Calibration - Events"
Cohesion: 0.4
Nodes (4): get_shadbala(), Calculate 6-component Shadbala for a stored chart., calculate_shadbala_for_chart(), Calculates 6 Shadbala components for Sun, Moon, Mars, Mercury, Jupiter, Venus, S

### Community 19 - "Calibration - Zodiac"
Cohesion: 0.6
Nodes (3): handleKeyDown(), handleSubmit(), resetHeight()

### Community 20 - "Calibration - Biodata"
Cohesion: 0.5
Nodes (5): Astro Engine, Docker, Kosmiq Web App, Supabase, Vedic Intelligence

### Community 22 - "Monthly Predictions"
Cohesion: 0.67
Nodes (3): generate_synthesis(), Runs the LangGraph AI synthesis workflow to generate a premium astrological read, Runs the LangGraph AI synthesis workflow to generate a premium astrological read

## Knowledge Gaps
- **92 isolated node(s):** `Accepts the already-computed ChartResponse so the caller does not need     to re`, `Returns a map of planet names to their longitudes in the varga chart.`, `Runs the LangGraph AI synthesis workflow to generate a premium astrological read`, `Calculate Vimshottari Dasha from the Moon's natal nakshatra.      Accepts the fu`, `Core logic to detect and categorize yogas.` (+87 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **7 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `compute_yogas_logic()` connect `Login Page` to `Predictions Area`, `Astro Engine Service`?**
  _High betweenness centrality (0.071) - this node is a cross-community bridge._
- **Why does `detect_all_yogas()` connect `Astro Engine Service` to `Login Page`?**
  _High betweenness centrality (0.069) - this node is a cross-community bridge._
- **Why does `get_flags()` connect `Celestial Calculations` to `Predictions Area`?**
  _High betweenness centrality (0.069) - this node is a cross-community bridge._
- **Are the 43 inferred relationships involving `Biodata` (e.g. with `ShadowPlanet` and `ShadowPlanetsResponse`) actually correct?**
  _`Biodata` has 43 INFERRED edges - model-reasoned connections that need verification._
- **Are the 43 inferred relationships involving `LifeEvent` (e.g. with `ShadowPlanet` and `ShadowPlanetsResponse`) actually correct?**
  _`LifeEvent` has 43 INFERRED edges - model-reasoned connections that need verification._
- **Are the 42 inferred relationships involving `Profile` (e.g. with `ShadowPlanet` and `ShadowPlanetsResponse`) actually correct?**
  _`Profile` has 42 INFERRED edges - model-reasoned connections that need verification._
- **Are the 42 inferred relationships involving `Chart` (e.g. with `ShadowPlanet` and `ShadowPlanetsResponse`) actually correct?**
  _`Chart` has 42 INFERRED edges - model-reasoned connections that need verification._