"""
Astrological flags engine.

Detects key life-affecting conditions:
  - Sade Sati: Saturn transiting natal Moon sign ±1 (7.5-year affliction)
  - Mangal Dosha: Mars in houses 1, 2, 4, 7, 8, or 12 from Lagna, Moon, or Venus

All functions take natal and current transit planetary data.
Pure functions — no swisseph calls.
"""

import swisseph as swe
from datetime import date, datetime
from typing import Any

# ─── Helpers ──────────────────────────────────────────────────────────────────

def _sign(longitude: float) -> int:
    """Return zodiac sign index 0–11."""
    return int(longitude / 30) % 12


def _house_from(planet_lon: float, reference_lon: float) -> int:
    """Return house number (1-12) of planet relative to reference."""
    diff = (planet_lon - reference_lon + 360) % 360
    return int(diff / 30) + 1


SIGN_NAMES = [
    "Aries", "Taurus", "Gemini", "Cancer",
    "Leo", "Virgo", "Libra", "Scorpio",
    "Sagittarius", "Capricorn", "Aquarius", "Pisces",
]


# ─── Sade Sati ────────────────────────────────────────────────────────────────

def _get_current_saturn_longitude() -> float:
    """Compute Saturn's current sidereal longitude using Swiss Ephemeris."""
    today = datetime.utcnow()
    jd = swe.julday(today.year, today.month, today.day, today.hour + today.minute / 60.0)
    swe.set_sid_mode(swe.SIDM_LAHIRI)
    result, _ = swe.calc_ut(jd, swe.SATURN, swe.FLG_SIDEREAL | swe.FLG_SPEED)
    return result[0]


def detect_sade_sati(natal_moon_longitude: float) -> dict:
    """
    Sade Sati: Saturn within 1 sign of natal Moon sign.
    Phases:
      - Rising:  Saturn in sign before Moon sign (12th from Moon)
      - Peak:    Saturn in same sign as Moon
      - Setting: Saturn in sign after Moon sign (2nd from Moon)
    """
    current_saturn_lon = _get_current_saturn_longitude()

    natal_moon_sign = _sign(natal_moon_longitude)
    current_saturn_sign = _sign(current_saturn_lon)

    # Signs adjacent to Moon sign
    rising_sign = (natal_moon_sign - 1) % 12
    setting_sign = (natal_moon_sign + 1) % 12

    if current_saturn_sign == natal_moon_sign:
        phase = "Peak"
        active = True
    elif current_saturn_sign == rising_sign:
        phase = "Rising"
        active = True
    elif current_saturn_sign == setting_sign:
        phase = "Setting"
        active = True
    else:
        phase = "None"
        active = False

    moon_sign_name = SIGN_NAMES[natal_moon_sign]
    saturn_sign_name = SIGN_NAMES[current_saturn_sign]

    # Approximate end: Saturn moves ~1 sign per 2.5 years
    # Calculate remaining signs to clear the setting sign
    if active:
        signs_to_clear = (setting_sign - current_saturn_sign) % 12 + 1
        years_remaining = round(signs_to_clear * 2.5, 1)
    else:
        years_remaining = None

    return {
        "name": "Sade Sati",
        "sanskrit": "Sāḍe Sātī",
        "active": active,
        "phase": phase,
        "severity": "high" if phase == "Peak" else ("medium" if active else "none"),
        "natal_moon_sign": moon_sign_name,
        "current_saturn_sign": saturn_sign_name,
        "years_remaining": years_remaining,
        "description": (
            f"Saturn currently in {saturn_sign_name} ({phase} phase relative to your natal Moon in {moon_sign_name}). "
            "Brings patience, discipline, and karmic lessons."
            if active else
            f"Sade Sati is not active. Saturn is in {saturn_sign_name}, away from your natal Moon in {moon_sign_name}."
        ),
    }


# ─── Mangal Dosha ─────────────────────────────────────────────────────────────

# Houses that trigger Mangal Dosha from each reference point
DOSHA_HOUSES = {1, 2, 4, 7, 8, 12}

# Cancellation conditions (simplified classical rules)
# Mars in own sign, exalted, or with benefics can cancel the dosha
MARS_OWN_SIGNS = {0, 7}       # Aries=0, Scorpio=7
MARS_EXALTED_SIGN = 9          # Capricorn


def detect_mangal_dosha(planets: dict[str, Any], ascendant: float) -> dict:
    """
    Mangal Dosha: Mars in houses 1, 2, 4, 7, 8, or 12
    counted from Lagna, Moon, or Venus.

    Returns severity: none | mild | moderate | strong
    (triggering from more reference points = stronger dosha)
    """
    mars_lon = None
    if "Mars" in planets:
        mars_lon = planets["Mars"].get("longitude")

    if mars_lon is None:
        return {
            "name": "Mangal Dosha",
            "sanskrit": "Maṅgala Doṣa",
            "active": False,
            "severity": "none",
            "triggered_from": [],
            "description": "Mars data not available.",
            "cancellation_present": False,
        }

    moon_lon = planets.get("Moon", {}).get("longitude")
    venus_lon = planets.get("Venus", {}).get("longitude")

    triggered_from = []

    # Check from Lagna
    if _house_from(mars_lon, ascendant) in DOSHA_HOUSES:
        triggered_from.append("Lagna")

    # Check from Moon
    if moon_lon is not None:
        if _house_from(mars_lon, moon_lon) in DOSHA_HOUSES:
            triggered_from.append("Moon")

    # Check from Venus
    if venus_lon is not None:
        if _house_from(mars_lon, venus_lon) in DOSHA_HOUSES:
            triggered_from.append("Venus")

    active = len(triggered_from) > 0

    # Cancellation check: Mars in own sign or exalted
    mars_sign = _sign(mars_lon)
    cancellation_present = mars_sign in MARS_OWN_SIGNS or mars_sign == MARS_EXALTED_SIGN

    severity_map = {0: "none", 1: "mild", 2: "moderate", 3: "strong"}
    severity = severity_map.get(len(triggered_from), "strong")

    if cancellation_present and active:
        severity = "cancelled"

    return {
        "name": "Mangal Dosha",
        "sanskrit": "Maṅgala Doṣa",
        "active": active and not cancellation_present,
        "severity": severity,
        "triggered_from": triggered_from,
        "cancellation_present": cancellation_present,
        "description": (
            f"Mars triggers Mangal Dosha from {', '.join(triggered_from)}. "
            + ("Dosha is cancelled as Mars is in own sign or exalted." if cancellation_present
               else "May affect partnerships and marriage timing.")
            if active else
            "Mangal Dosha is not present in this chart."
        ),
    }


# ─── Main Entry ───────────────────────────────────────────────────────────────

def compute_flags(
    planets: dict[str, Any],
    ascendant: float,
) -> dict:
    """
    Compute all astrological flags for a natal chart.

    Requires live Saturn position (fetched internally via swe).
    Returns Sade Sati + Mangal Dosha results.
    """
    natal_moon_lon = None
    if "Moon" in planets:
        natal_moon_lon = planets["Moon"].get("longitude")

    sade_sati = (
        detect_sade_sati(natal_moon_lon)
        if natal_moon_lon is not None
        else {
            "name": "Sade Sati",
            "sanskrit": "Sāḍe Sātī",
            "active": False,
            "phase": "None",
            "severity": "none",
            "description": "Moon data not available.",
        }
    )

    mangal_dosha = detect_mangal_dosha(planets, ascendant)

    return {
        "sade_sati": sade_sati,
        "mangal_dosha": mangal_dosha,
    }
