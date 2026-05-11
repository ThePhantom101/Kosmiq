# KOSMIQ — Master Route Contract

## Agent Rules

- Never create a route not listed here.
- Never rename a component without updating this file.
- All sidebar nav labels must match exactly the "Kosmiq Label" column below.
- ChartShell tabs only appear for routes under `/kundli/:id`.
- Today's Sky routes (`/sky/*`) do not require an active chart context.
- Active chart ID uses placeholder `"me"` (localStorage) until Supabase `charts` table is implemented.

---

## Route Map

### 🏠 Main
| Kosmiq Route | Kosmiq Label | Component | Priority |
|---|---|---|---|
| /dashboard | Dashboard | Dashboard.tsx | P0 |
| /charts | My Charts | ChartsList.tsx | P0 |
| /ask | Ask (Raj Jyotishi) | AskAI.tsx | P0 |

### 📊 Your Kundali (scoped to active chart — `/kundli/:id`)
| Kosmiq Route | Kosmiq Label | Component | Priority |
|---|---|---|---|
| /chart/:id/divisional | Divisional Charts (Shodashvarga) | ShodashVarga.tsx | P0 |
| /chart/:id/timeline | Dasha Timeline (Vimshottari) | DashaTimeline.tsx | P0 |
| /chart/:id/strengths | Strengths (Shadbala + AV) | StrengthsPage.tsx | P1 |
| /kundli/:id/upagrahas | Shadow Planets (Upagrahas) | Upagrahas.tsx | P1 |

### 🔮 Predictions
| Kosmiq Route | Kosmiq Label | Component | Priority |
|---|---|---|---|
| /predictions/monthly | Monthly Forecast | MonthlyForecast.tsx | P1 |
| /predictions/samhita | Historical Matches (Samhita) | Samhita.tsx | P2 |
| /compatibility | Compatibility (Gun Milan) | GunMilan.tsx | P1 |

### 🌤️ Today's Sky (global — no chart context needed)
| Kosmiq Route | Kosmiq Label | Component | Priority |
|---|---|---|---|
| /sky/transits | Current Transits (Gochar) | Transits.tsx | P1 |
| /sky/panchang | Panchang | Panchang.tsx | P1 |
| /sky/muhurta | Auspicious Times (Muhurta) | Muhurta.tsx | P2 |

### 🔧 Refine Your Chart
| Kosmiq Route | Kosmiq Label | Component | Priority |
|---|---|---|---|
| /tools/rectification | Chart Rectification | Rectification.tsx | P2 |
| /tools/calibration/events | Important Dates | ImportantDates.tsx | P2 |
| /tools/calibration/zodiac | Zodiac Check | ZodiacCheck.tsx | P2 |
| /tools/calibration/biodata | Personal Details | PersonalDetails.tsx | P1 |

### ⚙️ Settings
| Kosmiq Route | Kosmiq Label | Component | Priority |
|---|---|---|---|
| /settings/account | Account | Account.tsx | P0 |

### 🔗 Social / Public
| Kosmiq Route | Kosmiq Label | Component | Priority |
|---|---|---|---|
| /share/:id | Public Chart Card | ShareCard.tsx | P1 |

---

## Sidebar Navigation Structure

```
KOSMIQ
├── Dashboard                         /dashboard
├── My Charts                         /charts
│
├── YOUR KUNDALI
│   ├── Divisional Charts (Shodashvarga)   /chart/:id/divisional
│   ├── Dasha Timeline (Vimshottari)  /chart/:id/timeline
│   ├── Strengths (Shadbala + AV)      /chart/:id/strengths
│   └── Shadow Planets (Upagrahas)   /kundli/:id/upagrahas
│
├── PREDICTIONS
│   ├── Monthly Forecast              /predictions/monthly
│   ├── Historical Matches (Samhita)  /predictions/samhita
│   └── Compatibility (Gun Milan)     /compatibility
│
├── TODAY'S SKY
│   ├── Current Transits (Gochar)     /sky/transits
│   ├── Panchang                      /sky/panchang
│   └── Auspicious Times (Muhurta)   /sky/muhurta
│
├── REFINE YOUR CHART
│   ├── Chart Rectification           /tools/rectification
│   ├── Important Dates               /tools/calibration/events
│   ├── Zodiac Check                  /tools/calibration/zodiac
│   └── Personal Details             /tools/calibration/biodata
│
├── Ask (Raj Jyotishi)               /ask
│
└── Account                          /settings/account
```
