"""
Tests for the transit score engine.
Live swe calls are mocked for deterministic results.
Run with: python -m pytest tests/test_transits.py -v
"""

from unittest.mock import patch
from engine.transits import (
    compute_transit_score,
    _aspect_delta,
    _house_from,
    _get_current_positions,
)


# ─── Factories ────────────────────────────────────────────────────────────────

def make_planet(longitude: float) -> dict:
    return {"longitude": longitude, "speed": 1.0, "is_retrograde": False}


def make_natal_planets(**kwargs: float) -> dict:
    return {name: make_planet(lon) for name, lon in kwargs.items()}


MOCK_CURRENT_SKY: dict[str, float] = {
    "Sun": 45.0,
    "Moon": 120.0,
    "Mars": 200.0,
    "Mercury": 50.0,
    "Jupiter": 90.0,
    "Venus": 250.0,
    "Saturn": 300.0,
    "Rahu": 150.0,
    "Ketu": 330.0,
}


# ─── Aspect Scoring ───────────────────────────────────────────────────────────

def test_aspect_delta_conjunction():
    """Conjunction (0°) should return a positive score."""
    delta = _aspect_delta(90.0, 90.0)
    assert delta > 0


def test_aspect_delta_opposition():
    """Opposition (180°) should return a negative score."""
    delta = _aspect_delta(0.0, 180.0)
    assert delta < 0


def test_aspect_delta_trine():
    """Trine (120°) should return a positive score."""
    delta = _aspect_delta(0.0, 120.0)
    assert delta > 0


def test_aspect_delta_square():
    """Square (90°) should return a negative score."""
    delta = _aspect_delta(0.0, 90.0)
    assert delta < 0


def test_aspect_delta_no_aspect():
    """Unrelated angle (45°) should return 0."""
    delta = _aspect_delta(0.0, 45.0)
    assert delta == 0.0


# ─── House From ───────────────────────────────────────────────────────────────

def test_house_from_same_longitude():
    assert _house_from(0.0, 0.0) == 1


def test_house_from_7th():
    assert _house_from(180.0, 0.0) == 7


def test_house_from_4th():
    assert _house_from(90.0, 0.0) == 4


# ─── compute_transit_score ────────────────────────────────────────────────────

def test_transit_score_returns_required_structure():
    natal = make_natal_planets(
        Sun=0.0, Moon=30.0, Mars=60.0, Mercury=90.0,
        Jupiter=120.0, Venus=150.0, Saturn=180.0,
        Rahu=210.0, Ketu=30.0
    )

    with patch("engine.transits._get_current_positions", return_value=MOCK_CURRENT_SKY):
        result = compute_transit_score(natal)

    assert "score" in result
    assert "sentiment" in result
    assert "key_transits" in result
    assert "current_sky" in result


def test_transit_score_is_between_0_and_100():
    natal = make_natal_planets(
        Sun=0.0, Moon=30.0, Mars=60.0, Mercury=90.0,
        Jupiter=120.0, Venus=150.0, Saturn=180.0
    )

    with patch("engine.transits._get_current_positions", return_value=MOCK_CURRENT_SKY):
        result = compute_transit_score(natal)

    assert 0 <= result["score"] <= 100


def test_transit_score_sentiment_matches_score():
    natal = make_natal_planets(Sun=0.0, Moon=30.0, Jupiter=120.0)

    with patch("engine.transits._get_current_positions", return_value=MOCK_CURRENT_SKY):
        result = compute_transit_score(natal)

    score = result["score"]
    sentiment = result["sentiment"]

    if score >= 80:
        assert sentiment == "Excellent"
    elif score >= 60:
        assert sentiment == "Favorable"
    elif score >= 40:
        assert sentiment == "Mixed"
    else:
        assert sentiment == "Challenging"


def test_transit_score_key_transits_max_5():
    natal = make_natal_planets(
        Sun=0.0, Moon=90.0, Mars=180.0, Mercury=270.0,
        Jupiter=45.0, Venus=135.0, Saturn=225.0,
        Rahu=315.0, Ketu=135.0
    )

    with patch("engine.transits._get_current_positions", return_value=MOCK_CURRENT_SKY):
        result = compute_transit_score(natal)

    assert len(result["key_transits"]) <= 5


def test_transit_score_empty_natal_planets():
    """Empty natal planets → score 50 (neutral fallback)."""
    with patch("engine.transits._get_current_positions", return_value=MOCK_CURRENT_SKY):
        result = compute_transit_score({})

    assert result["score"] == 50


def test_transit_score_current_sky_has_all_planets():
    natal = make_natal_planets(Sun=0.0, Moon=30.0)

    with patch("engine.transits._get_current_positions", return_value=MOCK_CURRENT_SKY):
        result = compute_transit_score(natal)

    for planet in ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn", "Rahu", "Ketu"]:
        assert planet in result["current_sky"]


if __name__ == "__main__":
    test_aspect_delta_conjunction()
    test_aspect_delta_opposition()
    test_aspect_delta_trine()
    test_aspect_delta_square()
    test_aspect_delta_no_aspect()
    test_house_from_same_longitude()
    test_house_from_7th()
    test_house_from_4th()
    test_transit_score_returns_required_structure()
    test_transit_score_is_between_0_and_100()
    test_transit_score_sentiment_matches_score()
    test_transit_score_key_transits_max_5()
    test_transit_score_empty_natal_planets()
    test_transit_score_current_sky_has_all_planets()
    print("All transit tests passed.")
