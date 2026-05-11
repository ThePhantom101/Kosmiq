"""
Transit score engine.

Computes a 0-100 "favorable transit score" reflecting how well the current
sky (today's planetary positions) interacts with natal planetary positions.

Scoring model:
  - Each planet-to-natal-planet relationship is scored by:
      a) House position of transiting planet from natal planet
      b) Whether the transit is a conjunction, trine, sextile (favorable)
         or square, opposition (unfavorable)
  - Scores are weighted by planet importance and summed, then normalized 0-100.

Pure functions except for _get_current_positions() which calls swe.
"""

import swisseph as swe
from datetime import datetime
from typing import Any


# ─── Planet weights (importance for transit scoring) ──────────────────────────

PLANET_WEIGHTS: dict[str, float] = {
    "Sun":     1.2,
    "Moon":    1.5,
    "Mars":    1.0,
    "Mercury": 0.8,
    "Jupiter": 1.4,
    "Venus":   1.0,
    "Saturn":  1.3,
    "Rahu":    0.9,
    "Ketu":    0.9,
}

# Favorable and unfavorable house positions for transits (from natal position)
FAVORABLE_HOUSES = {1, 2, 3, 5, 6, 9, 10, 11}
UNFAVORABLE_HOUSES = {4, 7, 8, 12}

# Additional angular aspect scoring (degrees between transit and natal)
ASPECT_SCORES: list[tuple[float, float, float]] = [
    # (center_degrees, tolerance, score_delta)
    (0,   8.0,  15),   # Conjunction: strongly felt
    (60,  6.0,  10),   # Sextile: harmonious
    (90,  6.0, -15),   # Square: friction
    (120, 8.0,  12),   # Trine: flowing
    (180, 8.0, -12),   # Opposition: tension
]

SWE_PLANET_CODES: dict[str, int] = {
    "Sun":     swe.SUN,
    "Moon":    swe.MOON,
    "Mars":    swe.MARS,
    "Mercury": swe.MERCURY,
    "Jupiter": swe.JUPITER,
    "Venus":   swe.VENUS,
    "Saturn":  swe.SATURN,
    "Rahu":    swe.MEAN_NODE,
}


# ─── Current sky ──────────────────────────────────────────────────────────────

def _get_current_positions() -> dict[str, float]:
    """Fetch today's sidereal planetary longitudes via Swiss Ephemeris."""
    today = datetime.utcnow()
    jd = swe.julday(today.year, today.month, today.day, today.hour + today.minute / 60.0)
    swe.set_sid_mode(swe.SIDM_LAHIRI)

    positions: dict[str, float] = {}
    for name, code in SWE_PLANET_CODES.items():
        result, _ = swe.calc_ut(jd, code, swe.FLG_SIDEREAL | swe.FLG_SPEED)
        positions[name] = result[0]

    # Ketu = Rahu + 180°
    positions["Ketu"] = (positions["Rahu"] + 180.0) % 360.0
    return positions


# ─── Scoring ──────────────────────────────────────────────────────────────────

def _aspect_delta(transit_lon: float, natal_lon: float) -> float:
    """Return score delta for the angular aspect between transit and natal planet."""
    diff = abs((transit_lon - natal_lon + 360) % 360)
    if diff > 180:
        diff = 360 - diff

    for center, tolerance, delta in ASPECT_SCORES:
        if abs(diff - center) <= tolerance:
            return delta
    return 0.0


def _house_from(transit_lon: float, natal_lon: float) -> int:
    diff = (transit_lon - natal_lon + 360) % 360
    return int(diff / 30) + 1


def compute_transit_score(natal_planets: dict[str, Any]) -> dict:
    """
    Compute a 0-100 transit favorability score.

    Args:
        natal_planets: dict of planet name → PlanetaryPosition dict with 'longitude'

    Returns:
        score: int (0-100)
        sentiment: "Excellent" | "Favorable" | "Mixed" | "Challenging"
        key_transits: list of notable transit descriptions
        current_sky: dict of current planetary longitudes
    """
    current_sky = _get_current_positions()

    raw_scores: list[float] = []
    key_transits: list[str] = []

    for planet_name, weight in PLANET_WEIGHTS.items():
        natal_data = natal_planets.get(planet_name)
        if natal_data is None:
            continue

        natal_lon = natal_data.get("longitude")
        if natal_lon is None:
            continue

        transit_lon = current_sky.get(planet_name)
        if transit_lon is None:
            continue

        house = _house_from(transit_lon, natal_lon)
        aspect_delta = _aspect_delta(transit_lon, natal_lon)

        # Base score: favorable house → +10, unfavorable → -8, neutral → 0
        if house in FAVORABLE_HOUSES:
            base = 10.0
        elif house in UNFAVORABLE_HOUSES:
            base = -8.0
        else:
            base = 0.0

        planet_score = (base + aspect_delta) * weight
        raw_scores.append(planet_score)

        # Flag notable transits
        if abs(planet_score) >= 12.0:
            direction = "favorable" if planet_score > 0 else "challenging"
            key_transits.append(
                f"{planet_name} transit to natal {planet_name} House {house} — {direction}"
            )

    # Normalize to 0-100
    if not raw_scores:
        normalized = 50
    else:
        total = sum(raw_scores)
        # Max possible: all planets at +10+15 aspect * max_weight ≈ ~270; min ≈ -270
        clamped = max(-200, min(200, total))
        normalized = round((clamped + 200) / 400 * 100)

    # Sentiment buckets
    if normalized >= 80:
        sentiment = "Excellent"
    elif normalized >= 60:
        sentiment = "Favorable"
    elif normalized >= 40:
        sentiment = "Mixed"
    else:
        sentiment = "Challenging"

    return {
        "score": normalized,
        "sentiment": sentiment,
        "key_transits": key_transits[:5],  # Top 5 only
        "current_sky": {k: round(v, 4) for k, v in current_sky.items()},
    }
