"""
Tests for the Vimshottari Dasha engine.
Run with: python -m pytest tests/test_dasha.py -v
"""

from datetime import date
from engine.dasha import (
    calculate_vimshottari,
    calculate_moon_nakshatra,
    get_dasha_sequence_from,
    DASHA_YEARS,
    TOTAL_CYCLE_YEARS,
)


# ─── Factories ────────────────────────────────────────────────────────────────

def make_moon_longitude(sign_index: int, degrees_in_sign: float = 10.0) -> float:
    """Helper: build a moon longitude for a given sign and degree within it."""
    return sign_index * 30.0 + degrees_in_sign


# ─── Unit Tests ───────────────────────────────────────────────────────────────

def test_total_dasha_cycle_is_120_years():
    assert TOTAL_CYCLE_YEARS == 120.0


def test_dasha_sequence_starts_from_given_lord():
    seq = get_dasha_sequence_from("Mars")
    assert seq[0] == "Mars"
    assert len(seq) == 9


def test_dasha_sequence_contains_all_lords():
    seq = get_dasha_sequence_from("Ketu")
    assert set(seq) == set(DASHA_YEARS.keys())


def test_moon_nakshatra_aries_start():
    """Moon at 0° Aries → Ashwini → Ketu lord."""
    result = calculate_moon_nakshatra(0.0)
    assert result["index"] == 0
    assert result["lord"] == "Ketu"
    assert result["fraction_elapsed"] == 0.0


def test_moon_nakshatra_mid_nakshatra():
    """Moon at 6°40' = half of Ashwini (13°20' span)."""
    result = calculate_moon_nakshatra(6.666)
    assert result["index"] == 0
    assert result["lord"] == "Ketu"
    assert 0.4 < result["fraction_elapsed"] < 0.6


def test_moon_nakshatra_second_star():
    """Moon at 14° → Bharani → Venus lord."""
    result = calculate_moon_nakshatra(14.0)
    assert result["index"] == 1
    assert result["lord"] == "Venus"


def test_vimshottari_returns_required_keys():
    moon_lon = make_moon_longitude(sign_index=6, degrees_in_sign=5.0)  # Libra
    birth = date(1990, 1, 1)
    result = calculate_vimshottari(moon_lon, birth)

    assert "current_mahadasha" in result
    assert "current_antardasha" in result
    assert "sequence" in result

    maha = result["current_mahadasha"]
    assert "lord" in maha
    assert "start" in maha
    assert "end" in maha
    assert "percent_complete" in maha
    assert 0.0 <= maha["percent_complete"] <= 100.0


def test_vimshottari_sequence_has_nine_periods():
    moon_lon = make_moon_longitude(sign_index=0, degrees_in_sign=0.0)
    result = calculate_vimshottari(moon_lon, date(1985, 6, 15))
    assert len(result["sequence"]) == 9


def test_vimshottari_start_dates_are_sequential():
    moon_lon = make_moon_longitude(sign_index=3, degrees_in_sign=2.0)
    result = calculate_vimshottari(moon_lon, date(1995, 3, 14))
    periods = result["sequence"]

    for i in range(len(periods) - 1):
        end_current = date.fromisoformat(periods[i]["end"])
        start_next = date.fromisoformat(periods[i + 1]["start"])
        assert end_current == start_next, (
            f"Period {i} ends {end_current} but period {i+1} starts {start_next}"
        )


def test_vimshottari_percent_complete_between_zero_and_hundred():
    moon_lon = make_moon_longitude(sign_index=8, degrees_in_sign=6.0)
    result = calculate_vimshottari(moon_lon, date(1988, 11, 22))
    pct = result["current_mahadasha"]["percent_complete"]
    assert 0.0 <= pct <= 100.0


def test_vimshottari_known_chart_moon_in_rohini():
    """
    Moon at ~46° (Taurus, Rohini) → Moon mahadasha starts.
    Rohini is nak index 3, lord = Moon.
    """
    moon_lon = 46.0  # ~16° Taurus = Rohini
    result = calculate_moon_nakshatra(moon_lon)
    assert result["lord"] == "Moon"

    birth = date(2000, 1, 1)
    dasha_result = calculate_vimshottari(moon_lon, birth)
    assert dasha_result["sequence"][0]["lord"] == "Moon"


if __name__ == "__main__":
    test_total_dasha_cycle_is_120_years()
    test_dasha_sequence_starts_from_given_lord()
    test_dasha_sequence_contains_all_lords()
    test_moon_nakshatra_aries_start()
    test_moon_nakshatra_mid_nakshatra()
    test_moon_nakshatra_second_star()
    test_vimshottari_returns_required_keys()
    test_vimshottari_sequence_has_nine_periods()
    test_vimshottari_start_dates_are_sequential()
    test_vimshottari_percent_complete_between_zero_and_hundred()
    test_vimshottari_known_chart_moon_in_rohini()
    print("All dasha tests passed.")
