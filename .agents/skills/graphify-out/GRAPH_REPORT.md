# Graph Report - skills  (2026-05-05)

## Corpus Check
- 8 files · ~64,791 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 95 nodes · 142 edges · 9 communities (8 shown, 1 thin omitted)
- Extraction: 92% EXTRACTED · 8% INFERRED · 0% AMBIGUOUS · INFERRED: 12 edges (avg confidence: 0.8)
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
- [[_COMMUNITY_Community 6|Community 6]]
- [[_COMMUNITY_Community 7|Community 7]]

## God Nodes (most connected - your core abstractions)
1. `DesignSystemGenerator` - 11 edges
2. `_search_csv()` - 9 edges
3. `BM25` - 7 edges
4. `generate_design_system()` - 6 edges
5. `search()` - 6 edges
6. `User` - 5 edges
7. `list_users()` - 5 edges
8. `find_locale_files()` - 4 edges
9. `check_locale_completeness()` - 4 edges
10. `check_hardcoded_strings()` - 4 edges

## Surprising Connections (you probably didn't know these)
- `_search_csv()` --calls--> `str`  [INFERRED]
  ui-ux-pro/scripts/core.py →   _Bridges community 1 → community 2_
- `find_locale_files()` --calls--> `str`  [INFERRED]
  i18n-localization/scripts/i18n_checker.py →   _Bridges community 3 → community 2_
- `generate_design_system()` --calls--> `DesignSystemGenerator`  [EXTRACTED]
  ui-ux-pro/scripts/design_system.py → ui-ux-pro/scripts/design_system.py  _Bridges community 6 → community 5_
- `UserStatus` --inherits--> `str`  [EXTRACTED]
  rest-api-design/assets/rest-api-template.py →   _Bridges community 0 → community 2_

## Communities (9 total, 1 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.17
Nodes (20): create_user(), delete_user(), ErrorDetail, ErrorResponse, get_user(), http_exception_handler(), list_users(), PaginatedResponse (+12 more)

### Community 1 - "Community 1"
Cohesion: 0.15
Nodes (15): BM25, detect_domain(), _load_csv(), BM25 ranking algorithm for text search, Lowercase, split, remove punctuation, filter short words, Build BM25 index from documents, Score all documents against query, Load CSV and return list of dicts (+7 more)

### Community 2 - "Community 2"
Cohesion: 0.17
Nodes (13): detect_project_type(), main(), Detect project type and available linters., Run a single linter and return results., run_linter(), format_output(), Format results for Claude consumption (token-optimized), check_python_coverage() (+5 more)

### Community 3 - "Community 3"
Cohesion: 0.29
Nodes (9): check_hardcoded_strings(), check_locale_completeness(), find_locale_files(), flatten_keys(), main(), Flatten nested dict keys., Check for hardcoded strings in code files., Find translation/locale files. (+1 more)

### Community 4 - "Community 4"
Cohesion: 0.25
Nodes (4): Select best matching result based on priority keywords., Extract results list from search result dict., Generate complete design system recommendation., Execute searches across multiple domains.

### Community 5 - "Community 5"
Cohesion: 0.38
Nodes (6): format_ascii_box(), format_markdown(), generate_design_system(), Format design system as ASCII box with emojis (MCP-style)., Format design system as markdown., Main entry point for design system generation.      Args:         query: Search

### Community 6 - "Community 6"
Cohesion: 0.5
Nodes (3): DesignSystemGenerator, Generates design system recommendations from aggregated searches., Load reasoning rules from CSV.

## Knowledge Gaps
- **32 isolated node(s):** `Generates design system recommendations from aggregated searches.`, `Load reasoning rules from CSV.`, `Execute searches across multiple domains.`, `Find matching reasoning rule for a category.`, `Apply reasoning rules to search results.` (+27 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **1 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `_search_csv()` connect `Community 1` to `Community 2`?**
  _High betweenness centrality (0.216) - this node is a cross-community bridge._
- **Why does `DesignSystemGenerator` connect `Community 6` to `Community 4`, `Community 5`, `Community 7`?**
  _High betweenness centrality (0.211) - this node is a cross-community bridge._
- **Why does `list_users()` connect `Community 0` to `Community 2`?**
  _High betweenness centrality (0.189) - this node is a cross-community bridge._
- **Are the 10 inferred relationships involving `str` (e.g. with `._select_best_match()` and `.tokenize()`) actually correct?**
  _`str` has 10 INFERRED edges - model-reasoned connections that need verification._
- **What connects `Generates design system recommendations from aggregated searches.`, `Load reasoning rules from CSV.`, `Execute searches across multiple domains.` to the rest of the system?**
  _32 weakly-connected nodes found - possible documentation gaps or missing edges._