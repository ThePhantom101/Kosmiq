# KOSMIQ — Master Route Contract

## Agent Rules

- Never create a route not listed here.
- Never rename a component without updating this file.
- All sidebar nav labels must match exactly the "Kosmiq Label" column below.
- ChartShell tabs only appear for routes under `/chart/:id`.
- Today's Sky routes (`/sky/*`) do not require an active chart context.
- Active chart ID uses placeholder `"me"` (localStorage) until Supabase `charts` table is implemented.

---

## Route Map

### 🏠 Main
| Kosmiq Route | Kosmiq Label | Component | Priority |
|---|---|---|---|
| /dashboard | Dashboard | Dashboard.tsx | P0 |
| /charts | Chart Library | ChartsList.tsx | P0 |
| /ask | Ask Oracle AI | AskAI.tsx | P0 |

### 📊 Active Chart (scoped to `/chart/:id`)
| Kosmiq Route | Kosmiq Label | Component | Priority |
|---|---|---|---|
| /chart/:id | Birth Chart | ChartOverview.tsx | P0 |
| /chart/:id/divisional | Harmonic Charts | ShodashVarga.tsx | P0 |
| /chart/:id/timeline | Life Timelines | DashaTimeline.tsx | P0 |
| /chart/:id/strengths | Planetary Strengths | StrengthsPage.tsx | P1 |
| /chart/:id/ashtakvarga | House Resonance | Ashtakvarga.tsx | P1 |
| /chart/:id/yogas | Cosmic Combinations | Yogas.tsx | P1 |
| /chart/:id/shadows | Shadow Planets | Upagrahas.tsx | P1 |

### 🔮 Predictions
| Kosmiq Route | Kosmiq Label | Component | Priority |
|---|---|---|---|
| /predictions/monthly | Monthly Forecast | MonthlyForecast.tsx | P1 |
| /compatibility | Relationship Compatibility | GunMilan.tsx | P1 |
| /predictions/samhita | Historical Patterns | Samhita.tsx | P2 |

### 🌤️ Today's Sky
| Kosmiq Route | Kosmiq Label | Component | Priority |
|---|---|---|---|
| /sky/transits | Live Transits | Transits.tsx | P1 |
| /sky/panchang | Daily Almanac | Panchang.tsx | P1 |
| /sky/muhurta | Auspicious Windows | Muhurta.tsx | P2 |

### 🔧 Refine Chart
| Kosmiq Route | Kosmiq Label | Component | Priority |
|---|---|---|---|
| /tools/rectification | Birth Time Correction | Rectification.tsx | P2 |
| /tools/calibration/events | Life Event Sync | ImportantDates.tsx | P2 |
| /tools/calibration/zodiac | Identity Verification | ZodiacCheck.tsx | P2 |
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
│   ├── Chart Library                     /charts
│   └── Ask Oracle AI                     /ask
│
├── ACTIVE CHART (Conditional)
│   ├── Birth Chart                       /chart/:id
│   ├── Harmonic Charts                   /chart/:id/divisional
│   ├── Life Timelines                    /chart/:id/timeline
│   ├── Planetary Strengths               /chart/:id/strengths
│   ├── House Resonance                   /chart/:id/ashtakvarga
│   ├── Cosmic Combinations               /chart/:id/yogas
│   └── Shadow Planets                    /chart/:id/shadows
│
├── PREDICTIONS
│   ├── Monthly Forecast                  /predictions/monthly
│   ├── Relationship Compatibility        /compatibility
│   └── Historical Patterns               /predictions/samhita
│
├── TODAY'S SKY
│   ├── Live Transits                     /sky/transits
│   ├── Daily Almanac                     /sky/panchang
│   └── Auspicious Windows                /sky/muhurta
│
├── REFINE CHART
│   ├── Birth Time Correction             /tools/rectification
│   ├── Life Event Sync                   /tools/calibration/events
│   ├── Identity Verification             /tools/calibration/zodiac
│   └── Profile Settings                  /tools/calibration/biodata
│
└── Account                               /settings/account
```

