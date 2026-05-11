"""
Tests for the Yoga detection engine.
Run with: python -m pytest tests/test_yogas.py -v
"""

from engine.yogas import (
    detect_gaja_kesari,
    detect_hamsa,
    detect_saraswati,
    detect_budha_aditya,
    detect_chandra_mangala,
    detect_all_yogas,
)


# ─── Factories ────────────────────────────────────────────────────────────────

def make_planet(longitude: float) -> dict:
    return {"longitude": longitude, "speed": 1.0, "is_retrograde": False}


def make_planets(**kwargs: float) -> dict:
    """Create a planets dict from name=longitude pairs."""
    return {name: make_planet(lon) for name, lon in kwargs.items()}


# ─── Gaja Kesari ──────────────────────────────────────────────────────────────

def test_gaja_kesari_active_when_jupiter_in_kendra_from_moon():
    """Jupiter in the 1st from Moon (conjunction) → active."""
    planets = make_planets(Jupiter=90.0, Moon=90.0)
    result = detect_gaja_kesari(planets, asc_lon=0.0)
    assert result is not None
    assert result["active"] is True


def test_gaja_kesari_active_when_jupiter_in_7th_from_moon():
    """Jupiter in the 7th from Moon → active (kendra)."""
    planets = make_planets(Jupiter=270.0, Moon=90.0)  # 180° apart = 7th
    result = detect_gaja_kesari(planets, asc_lon=0.0)
    assert result is not None
    assert result["active"] is True


def test_gaja_kesari_not_active_when_jupiter_in_3rd_from_moon():
    """Jupiter in the 3rd from Moon → not a kendra, not active."""
    planets = make_planets(Jupiter=150.0, Moon=90.0)  # 60° apart = 3rd
    result = detect_gaja_kesari(planets, asc_lon=0.0)
    assert result is not None
    assert result["active"] is False


# ─── Hamsa ────────────────────────────────────────────────────────────────────

def test_hamsa_active_when_jupiter_exalted_in_kendra():
    """Jupiter at Cancer (sign index 3 = 90-120°), ascendant at 0 → House 4 (kendra)."""
    # Jupiter at 95° = Cancer (sign 3), Ascendant at 5° = House 4 from Asc
    planets = make_planets(Jupiter=95.0)
    result = detect_hamsa(planets, asc_lon=5.0)
    # House of Jupiter from asc = floor((95-5)/30)+1 = floor(3)+1 = 4 (kendra)
    assert result is not None
    assert result["active"] is True


def test_hamsa_not_active_when_jupiter_in_weak_position():
    """Jupiter in a non-kendra, non-own sign → not active."""
    planets = make_planets(Jupiter=0.0)  # Aries, not own/exalted
    result = detect_hamsa(planets, asc_lon=0.0)
    assert result is not None
    # Jupiter at 0° Aries (sign 0), House 1 — kendra but not strong sign
    # sign 0 not in {3, 8, 11} → active = False
    assert result["active"] is False


# ─── Budha-Aditya ─────────────────────────────────────────────────────────────

def test_budha_aditya_active_when_sun_mercury_same_sign():
    planets = make_planets(Sun=45.0, Mercury=55.0)  # Both in Taurus (30-60°)
    result = detect_budha_aditya(planets, asc_lon=0.0)
    assert result is not None
    assert result["active"] is True


def test_budha_aditya_not_active_when_different_signs():
    planets = make_planets(Sun=25.0, Mercury=35.0)  # Aries vs Taurus
    result = detect_budha_aditya(planets, asc_lon=0.0)
    assert result is not None
    assert result["active"] is False


# ─── Chandra-Mangala ──────────────────────────────────────────────────────────

def test_chandra_mangala_active_when_conjunct():
    planets = make_planets(Moon=120.0, Mars=130.0)  # Same sign (Leo)
    result = detect_chandra_mangala(planets, asc_lon=0.0)
    assert result is not None
    assert result["active"] is True


def test_chandra_mangala_active_when_opposing():
    planets = make_planets(Moon=0.0, Mars=180.0)  # Opposition
    result = detect_chandra_mangala(planets, asc_lon=0.0)
    assert result is not None
    assert result["active"] is True


def test_chandra_mangala_not_active_when_trine():
    planets = make_planets(Moon=0.0, Mars=120.0)  # Trine, signs 4 apart
    result = detect_chandra_mangala(planets, asc_lon=0.0)
    assert result is not None
    assert result["active"] is False


# ─── detect_all_yogas ─────────────────────────────────────────────────────────

def test_detect_all_yogas_returns_required_structure():
    planets = make_planets(
        Sun=45.0, Moon=90.0, Mars=180.0, Mercury=50.0,
        Jupiter=90.0, Venus=200.0, Saturn=270.0,
        Rahu=300.0, Ketu=120.0
    )
    result = detect_all_yogas(planets, asc_lon=0.0)

    assert "yogas" in result
    assert "active" in result
    assert "dormant" in result
    assert "count" in result
    assert "active_count" in result
    assert isinstance(result["yogas"], list)
    assert result["count"] == len(result["yogas"])
    assert result["active_count"] == len(result["active"])


def test_detect_all_yogas_never_crashes_on_missing_planets():
    """Empty planets dict should not raise — all detectors must handle missing data."""
    result = detect_all_yogas({}, asc_lon=0.0)
    assert result["count"] >= 0


def test_detect_all_yogas_active_subset_of_all():
    planets = make_planets(
        Sun=45.0, Moon=90.0, Mars=180.0, Mercury=55.0,
        Jupiter=95.0, Venus=200.0, Saturn=270.0
    )
    result = detect_all_yogas(planets, asc_lon=5.0)

    active_names = set(result["active"])
    all_names = {y["name"] for y in result["yogas"]}
    assert active_names.issubset(all_names)


if __name__ == "__main__":
    test_gaja_kesari_active_when_jupiter_in_kendra_from_moon()
    test_gaja_kesari_active_when_jupiter_in_7th_from_moon()
    test_gaja_kesari_not_active_when_jupiter_in_3rd_from_moon()
    test_hamsa_active_when_jupiter_exalted_in_kendra()
    test_hamsa_not_active_when_jupiter_in_weak_position()
    test_budha_aditya_active_when_sun_mercury_same_sign()
    test_budha_aditya_not_active_when_different_signs()
    test_chandra_mangala_active_when_conjunct()
    test_chandra_mangala_active_when_opposing()
    test_chandra_mangala_not_active_when_trine()
    test_detect_all_yogas_returns_required_structure()
    test_detect_all_yogas_never_crashes_on_missing_planets()
    test_detect_all_yogas_active_subset_of_all()
    print("All yoga tests passed.")
