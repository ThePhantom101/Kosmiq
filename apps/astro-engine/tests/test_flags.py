"""
Tests for the flags engine (Sade Sati + Mangal Dosha).
Note: Sade Sati tests mock live Saturn position since tests should be deterministic.
Run with: python -m pytest tests/test_flags.py -v
"""

from unittest.mock import patch
from engine.flags import (
    detect_sade_sati,
    detect_mangal_dosha,
    compute_flags,
    _sign,
    _house_from,
)


# ─── Factories ────────────────────────────────────────────────────────────────

def make_planet(longitude: float) -> dict:
    return {"longitude": longitude, "speed": 1.0, "is_retrograde": False}


def make_planets(**kwargs: float) -> dict:
    return {name: make_planet(lon) for name, lon in kwargs.items()}


# ─── Helpers ──────────────────────────────────────────────────────────────────

def test_sign_helper():
    assert _sign(0.0) == 0    # Aries
    assert _sign(30.0) == 1   # Taurus
    assert _sign(359.9) == 11 # Pisces


def test_house_from_helper():
    assert _house_from(0.0, 0.0) == 1
    assert _house_from(90.0, 0.0) == 4
    assert _house_from(180.0, 0.0) == 7
    assert _house_from(270.0, 0.0) == 10


# ─── Sade Sati ────────────────────────────────────────────────────────────────

def test_sade_sati_peak_phase():
    """Saturn in same sign as natal Moon → Peak phase."""
    natal_moon_lon = 90.0  # Cancer (sign 3)
    saturn_lon = 95.0      # Also Cancer

    with patch("engine.flags._get_current_saturn_longitude", return_value=saturn_lon):
        result = detect_sade_sati(natal_moon_lon)

    assert result["active"] is True
    assert result["phase"] == "Peak"
    assert result["severity"] == "high"
    assert result["natal_moon_sign"] == "Cancer"


def test_sade_sati_rising_phase():
    """Saturn one sign before natal Moon → Rising phase."""
    natal_moon_lon = 90.0   # Cancer (sign 3)
    saturn_lon = 65.0       # Gemini (sign 2 = sign before Cancer)

    with patch("engine.flags._get_current_saturn_longitude", return_value=saturn_lon):
        result = detect_sade_sati(natal_moon_lon)

    assert result["active"] is True
    assert result["phase"] == "Rising"
    assert result["severity"] == "medium"


def test_sade_sati_setting_phase():
    """Saturn one sign after natal Moon → Setting phase."""
    natal_moon_lon = 90.0   # Cancer (sign 3)
    saturn_lon = 125.0      # Leo (sign 4 = sign after Cancer)

    with patch("engine.flags._get_current_saturn_longitude", return_value=saturn_lon):
        result = detect_sade_sati(natal_moon_lon)

    assert result["active"] is True
    assert result["phase"] == "Setting"


def test_sade_sati_not_active():
    """Saturn far from natal Moon → not active."""
    natal_moon_lon = 90.0   # Cancer
    saturn_lon = 200.0      # Libra (3 signs away)

    with patch("engine.flags._get_current_saturn_longitude", return_value=saturn_lon):
        result = detect_sade_sati(natal_moon_lon)

    assert result["active"] is False
    assert result["phase"] == "None"
    assert result["severity"] == "none"


# ─── Mangal Dosha ─────────────────────────────────────────────────────────────

def test_mangal_dosha_not_triggered_when_mars_in_safe_house():
    """Mars in house 3 from Lagna (not in dosha houses) → no dosha."""
    # Ascendant at 0° (Aries), Mars at 60° (3rd house from Aries asc)
    planets = make_planets(Mars=60.0, Moon=200.0, Venus=250.0)
    result = detect_mangal_dosha(planets, ascendant=0.0)

    # House 3 is not in {1,2,4,7,8,12}
    assert "Lagna" not in result["triggered_from"]


def test_mangal_dosha_triggered_from_lagna():
    """Mars in house 1 from Lagna → triggers Mangal Dosha (from Lagna)."""
    # Ascendant at 0°, Mars at 5° → House 1 (triggers from Lagna)
    # NOTE: Mars at 5° Aries is in its OWN sign → cancellation applies, active=False
    planets = make_planets(Mars=5.0, Moon=200.0, Venus=250.0)
    result = detect_mangal_dosha(planets, ascendant=0.0)

    assert "Lagna" in result["triggered_from"]
    # Own-sign Mars cancels the dosha — active stays False despite trigger
    assert result["cancellation_present"] is True
    assert result["severity"] == "cancelled"


def test_mangal_dosha_active_without_cancellation():
    """Mars in house 1 from Lagna but NOT in own/exalted sign → active."""
    # Mars at 65° = Gemini (sign 2, not own/exalted), Asc at 60° → House 1
    planets = make_planets(Mars=65.0, Moon=200.0, Venus=250.0)
    result = detect_mangal_dosha(planets, ascendant=60.0)

    assert "Lagna" in result["triggered_from"]
    assert result["cancellation_present"] is False
    assert result["active"] is True


def test_mangal_dosha_triggered_from_moon():
    """Mars in house 7 from Moon → triggers Mangal Dosha."""
    # Moon at 0°, Mars at 180° = 7th from Moon
    planets = make_planets(Mars=180.0, Moon=0.0, Venus=250.0)
    result = detect_mangal_dosha(planets, ascendant=90.0)  # Asc away from dosha

    assert "Moon" in result["triggered_from"]


def test_mangal_dosha_cancellation_when_mars_in_own_sign():
    """Mars in Aries (sign 0, own sign) → dosha cancelled."""
    # Mars at 5° Aries, Asc at 5° Aries → House 1 → triggered but cancelled
    planets = make_planets(Mars=5.0, Moon=200.0, Venus=250.0)
    result = detect_mangal_dosha(planets, ascendant=0.0)

    assert result["cancellation_present"] is True
    assert result["severity"] == "cancelled"
    assert result["active"] is False  # cancelled = not active


def test_mangal_dosha_severity_strong():
    """Mars in house 7 from all three reference points → strong."""
    # Moon at 0°, Venus at 0°, Asc at 0° → Mars at 180° is 7th from all three
    planets = make_planets(Mars=180.0, Moon=0.0, Venus=0.0)
    result = detect_mangal_dosha(planets, ascendant=0.0)

    assert len(result["triggered_from"]) == 3
    assert result["severity"] == "strong"


def test_mangal_dosha_no_mars_data():
    """Missing Mars planet → no dosha, not active."""
    result = detect_mangal_dosha({}, ascendant=0.0)
    assert result["active"] is False
    assert result["triggered_from"] == []


# ─── compute_flags ────────────────────────────────────────────────────────────

def test_compute_flags_returns_required_structure():
    planets = make_planets(Moon=90.0, Mars=5.0, Venus=250.0)
    saturn_lon = 200.0  # Not in sade sati

    with patch("engine.flags._get_current_saturn_longitude", return_value=saturn_lon):
        result = compute_flags(planets, ascendant=0.0)

    assert "sade_sati" in result
    assert "mangal_dosha" in result
    assert "active" in result["sade_sati"]
    assert "active" in result["mangal_dosha"]


if __name__ == "__main__":
    test_sign_helper()
    test_house_from_helper()
    test_sade_sati_peak_phase()
    test_sade_sati_rising_phase()
    test_sade_sati_setting_phase()
    test_sade_sati_not_active()
    test_mangal_dosha_not_triggered_when_mars_in_safe_house()
    test_mangal_dosha_triggered_from_lagna()
    test_mangal_dosha_triggered_from_moon()
    test_mangal_dosha_cancellation_when_mars_in_own_sign()
    test_mangal_dosha_severity_strong()
    test_mangal_dosha_no_mars_data()
    test_compute_flags_returns_required_structure()
    print("All flags tests passed.")
