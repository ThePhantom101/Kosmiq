# KOSMIQ — Master Route Contract

## Agent Rules

- Never create a route not listed here.
- Never rename a component without updating this file.
- All sidebar nav labels must match exactly the "Kosmiq Label" column below.
- ChartShell tabs only appear for routes under `/kundli/:id`.
- Today's Sky routes (`/sky/*`) do not require an active chart context.
- Active chart ID uses placeholder `"me"` (localStorage) until Supabase `charts` table is implemented.

---

# KOSMIQ — Master Route Contract

## Agent Rules

- Never create a route not listed here.
- Never rename a component without updating this file.
- All sidebar nav labels must match exactly the "Kosmiq Label" column below.
- Active chart ID uses placeholder `"me"` (localStorage) until Supabase `charts` table is implemented.

---

## Route Map

### 🏠 Main
| Kosmiq Route | Kosmiq Label | Component | Priority |
|---|---|---|---|
| /dashboard | Dashboard | Dashboard.tsx | P0 |
| /charts | My Library | ChartsList.tsx | P0 |
| /ask | Ask AI | AskAI.tsx | P0 |

### 📊 Active Chart (scoped to `/chart/:id`)
| Kosmiq Route | Kosmiq Label | Component | Priority |
|---|---|---|---|
| /chart/:id | Chart Overview | ChartOverview.tsx | P0 |
| /chart/:id/divisional | 16 Divisional Charts | ShodashVarga.tsx | P0 |
| /chart/:id/timeline | Vimshottari Dasha | DashaTimeline.tsx | P0 |
| /chart/:id/strengths | Shadbala Energy | StrengthsPage.tsx | P1 |
| /chart/:id/ashtakvarga | Ashtakvarga Strength | Ashtakvarga.tsx | P1 |
| /chart/:id/shadows | Shadow Planets | Upagrahas.tsx | P1 |

### 🔮 Predictions
| Kosmiq Route | Kosmiq Label | Component | Priority |
|---|---|---|---|
| /predictions/monthly | Monthly Predictions | MonthlyForecast.tsx | P1 |
| /compatibility | Relationship Matching | GunMilan.tsx | P1 |
| /predictions/samhita | Historical Comparisons | Samhita.tsx | P2 |

### 🌤️ Today's Sky
| Kosmiq Route | Kosmiq Label | Component | Priority |
|---|---|---|---|
| /sky/transits | Current Transits | Transits.tsx | P1 |
| /sky/panchang | Daily Almanac | Panchang.tsx | P1 |
| /sky/muhurta | Auspicious Windows | Muhurta.tsx | P2 |

### 🔧 Refine
| Kosmiq Route | Kosmiq Label | Component | Priority |
|---|---|---|---|
| /tools/rectification | Time Correction | Rectification.tsx | P2 |
| /tools/calibration/events | Event Sync | ImportantDates.tsx | P2 |
| /tools/calibration/zodiac | Identity Check | ZodiacCheck.tsx | P2 |
| /tools/calibration/biodata | Profile Settings | PersonalDetails.tsx | P1 |

### ⚙️ Settings
| Kosmiq Route | Kosmiq Label | Component | Priority |
|---|---|---|---|
| /settings/account | Account | Account.tsx | P0 |

---

## Sidebar Navigation Structure

```
KOSMIQ
├── MAIN
│   ├── Dashboard                         /dashboard
│   ├── My Library                        /charts
│   └── Ask AI                            /ask
│
├── ACTIVE CHART (Conditional)
│   ├── Chart Overview                    /chart/:id
│   ├── 16 Divisional Charts              /chart/:id/divisional
│   ├── Vimshottari Dasha                 /chart/:id/timeline
│   ├── Shadbala Energy                   /chart/:id/strengths
│   ├── Ashtakvarga Strength              /chart/:id/ashtakvarga
│   └── Shadow Planets                    /chart/:id/shadows
│
├── PREDICTIONS
│   ├── Monthly Predictions               /predictions/monthly
│   ├── Relationship Matching             /compatibility
│   └── Historical Comparisons            /predictions/samhita
│
├── TODAY'S SKY
│   ├── Current Transits                  /sky/transits
│   ├── Daily Almanac                     /sky/panchang
│   └── Auspicious Windows                /sky/muhurta
│
├── REFINE
│   ├── Time Correction                   /tools/rectification
│   ├── Event Sync                        /tools/calibration/events
│   ├── Identity Check                    /tools/calibration/zodiac
│   └── Profile Settings                  /tools/calibration/biodata
│
└── Account                               /settings/account
```

