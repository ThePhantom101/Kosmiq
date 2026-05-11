"""
Vimshottari Dasha calculation engine.

All public functions are pure — no swisseph calls, no I/O.
The caller is responsible for providing the Moon's sidereal longitude.

Vimshottari system:
  Total cycle: 120 years
  Order:       Ketu → Venus → Sun → Moon → Mars → Rahu → Jupiter → Saturn → Mercury → (repeat)
  Moon's Nakshatra determines the starting lord and remaining balance.
  Each Nakshatra spans 13°20' (= 13.333... degrees).
"""

from datetime import date, timedelta
from typing import List

# ─── Constants ────────────────────────────────────────────────────────────────

# Duration in years for each Mahadasha lord
DASHA_YEARS: dict[str, float] = {
    "Ketu":    7,
    "Venus":   20,
    "Sun":     6,
    "Moon":    10,
    "Mars":    7,
    "Rahu":    18,
    "Jupiter": 16,
    "Saturn":  19,
    "Mercury": 17,
}

# Fixed Vimshottari sequence
DASHA_SEQUENCE: List[str] = [
    "Ketu", "Venus", "Sun", "Moon", "Mars",
    "Rahu", "Jupiter", "Saturn", "Mercury",
]

# Nakshatra ruling lords (27 nakshatras in fixed order starting with Ashwini)
# Index 0 = Ashwini (Ketu), repeats every 9 entries
NAKSHATRA_LORDS: List[str] = [
    "Ketu", "Venus", "Sun", "Moon", "Mars",
    "Rahu", "Jupiter", "Saturn", "Mercury",
] * 3  # 27 total

TOTAL_CYCLE_YEARS: float = sum(DASHA_YEARS.values())  # 120
NAKSHATRA_SPAN: float = 360.0 / 27  # 13.3333°


# ─── Core Calculation ─────────────────────────────────────────────────────────

def get_dasha_sequence_from(lord: str) -> List[str]:
    """Return the full 9-lord cycle starting from `lord`."""
    start = DASHA_SEQUENCE.index(lord)
    return DASHA_SEQUENCE[start:] + DASHA_SEQUENCE[:start]


def calculate_moon_nakshatra(moon_longitude: float) -> dict:
    """Return nakshatra index (0-based), lord, and elapsed fraction within it."""
    nak_index = int(moon_longitude / NAKSHATRA_SPAN) % 27
    elapsed_in_nak = moon_longitude % NAKSHATRA_SPAN
    fraction_elapsed = elapsed_in_nak / NAKSHATRA_SPAN  # 0.0 – 1.0
    lord = NAKSHATRA_LORDS[nak_index]
    return {"index": nak_index, "lord": lord, "fraction_elapsed": fraction_elapsed}


def calculate_vimshottari(
    moon_longitude: float,
    birth_date: date,
) -> dict:
    """
    Compute the full Vimshottari Dasha sequence from birth.

    Returns:
        current_mahadasha: dict with lord, start, end, percent_complete
        current_antardasha: dict with lord, start, end, percent_complete
        sequence: list of all 9 Mahadasha periods
    """
    nak = calculate_moon_nakshatra(moon_longitude)
    starting_lord = nak["lord"]
    fraction_elapsed = nak["fraction_elapsed"]

    # Starting Mahadasha total duration
    starting_duration_years = DASHA_YEARS[starting_lord]
    # Balance = remaining fraction of the starting period at birth
    balance_years = starting_duration_years * (1.0 - fraction_elapsed)

    sequence_from_start = get_dasha_sequence_from(starting_lord)

    # Build timeline of Mahadasha periods
    mahadasha_periods = []
    cursor = birth_date

    for i, lord in enumerate(sequence_from_start):
        duration_years = DASHA_YEARS[lord] if i > 0 else balance_years
        end = _add_years(cursor, duration_years)
        mahadasha_periods.append({
            "lord": lord,
            "start": cursor.isoformat(),
            "end": end.isoformat(),
            "duration_years": round(duration_years, 4),
        })
        cursor = end

        # After first period, use full durations — then cycle
        if i == len(sequence_from_start) - 1:
            sequence_from_start = sequence_from_start  # cycle handled by caller

    today = date.today()

    # Find current Mahadasha
    current_maha = _find_current_period(mahadasha_periods, today)
    if current_maha is None:
        # Fallback: use last period
        current_maha = mahadasha_periods[-1]

    current_maha_with_pct = _add_percent(current_maha, today)

    # Build Antardasha sub-periods within the current Mahadasha
    antardasha_periods = _build_antardasha(current_maha)
    current_antar = _find_current_period(antardasha_periods, today)
    if current_antar is None:
        current_antar = antardasha_periods[-1]
    current_antar_with_pct = _add_percent(current_antar, today)

    return {
        "current_mahadasha": {
            "lord": current_maha_with_pct["lord"],
            "start": current_maha_with_pct["start"],
            "end": current_maha_with_pct["end"],
            "duration_years": current_maha_with_pct["duration_years"],
            "percent_complete": current_maha_with_pct["percent_complete"],
        },
        "current_antardasha": {
            "lord": current_antar_with_pct["lord"],
            "start": current_antar_with_pct["start"],
            "end": current_antar_with_pct["end"],
            "percent_complete": current_antar_with_pct["percent_complete"],
        },
        "sequence": mahadasha_periods,
    }


def _build_antardasha(mahadasha: dict) -> List[dict]:
    """
    Compute the 9 Antardasha sub-periods within a Mahadasha.
    Antardasha duration = (Maha duration * Antar duration) / 120
    """
    maha_lord = mahadasha["lord"]
    maha_start = date.fromisoformat(mahadasha["start"])
    maha_duration = mahadasha["duration_years"]

    sequence = get_dasha_sequence_from(maha_lord)
    periods = []
    cursor = maha_start

    for lord in sequence:
        antar_duration = (maha_duration * DASHA_YEARS[lord]) / TOTAL_CYCLE_YEARS
        end = _add_years(cursor, antar_duration)
        periods.append({
            "lord": lord,
            "start": cursor.isoformat(),
            "end": end.isoformat(),
            "duration_years": round(antar_duration, 4),
        })
        cursor = end

    return periods


def _find_current_period(periods: List[dict], today: date) -> dict | None:
    for p in periods:
        start = date.fromisoformat(p["start"])
        end = date.fromisoformat(p["end"])
        if start <= today < end:
            return p
    return None


def _add_percent(period: dict, today: date) -> dict:
    start = date.fromisoformat(period["start"])
    end = date.fromisoformat(period["end"])
    total_days = (end - start).days or 1
    elapsed_days = (today - start).days
    pct = round(max(0.0, min(100.0, (elapsed_days / total_days) * 100)), 1)
    return {**period, "percent_complete": pct}


def _add_years(d: date, years: float) -> date:
    """Add a fractional number of years to a date."""
    days = int(years * 365.25)
    return d + timedelta(days=days)
