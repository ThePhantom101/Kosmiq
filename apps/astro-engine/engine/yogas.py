"""
Yoga detection engine.

Detects classical Vedic yoga combinations from a ChartResponse dict.
All functions are pure — no swisseph calls.

Each yoga returns:
  name:        English label
  sanskrit:    Original Sanskrit name
  active:      bool — whether the yoga is currently manifesting
  description: Brief explanation
  houses:      Planet placements involved
"""

from typing import Any

# ─── Helpers ──────────────────────────────────────────────────────────────────

def _sign(longitude: float) -> int:
    """Return zodiac sign index (0=Aries … 11=Pisces)."""
    return int(longitude / 30) % 12


def _house(planet_lon: float, asc_lon: float) -> int:
    """Return house number (1-12) for a planet given ascendant longitude."""
    diff = (planet_lon - asc_lon + 360) % 360
    return int(diff / 30) + 1


def _same_sign(lon_a: float, lon_b: float) -> bool:
    return _sign(lon_a) == _sign(lon_b)


def _get_lon(planets: dict[str, Any], name: str) -> float | None:
    p = planets.get(name)
    if p is None:
        return None
    return p.get("longitude")


# ─── Yoga Rules ───────────────────────────────────────────────────────────────

def detect_gaja_kesari(planets: dict, asc_lon: float) -> dict | None:
    """Gaja Kesari Yoga: Jupiter in a kendra (1,4,7,10) from Moon."""
    jup = _get_lon(planets, "Jupiter")
    moon = _get_lon(planets, "Moon")
    if jup is None or moon is None:
        return None

    moon_house = _house(moon, asc_lon)
    jup_from_moon = int(((jup - moon + 360) % 360) / 30) + 1

    active = jup_from_moon in {1, 4, 7, 10}
    return {
        "name": "Gaja Kesari",
        "sanskrit": "Gaja Kesari Yoga",
        "active": active,
        "description": "Jupiter in a kendra from Moon — brings wisdom, fame, and leadership.",
        "planets_involved": ["Jupiter", "Moon"],
    }


def detect_hamsa(planets: dict, asc_lon: float) -> dict | None:
    """Hamsa Yoga (Pancha Mahapurusha): Jupiter in own sign or exalted in a kendra."""
    jup = _get_lon(planets, "Jupiter")
    if jup is None:
        return None

    sign = _sign(jup)
    house = _house(jup, asc_lon)

    # Jupiter exalted in Cancer (3), own in Sagittarius (8) or Pisces (11) — 0-indexed
    jup_strong = sign in {3, 8, 11}
    kendra = house in {1, 4, 7, 10}
    active = jup_strong and kendra

    return {
        "name": "Hamsa",
        "sanskrit": "Hamsa Yoga",
        "active": active,
        "description": "Exalted or own-sign Jupiter in a kendra — grants spiritual intelligence and nobility.",
        "planets_involved": ["Jupiter"],
    }


def detect_saraswati(planets: dict, asc_lon: float) -> dict | None:
    """Saraswati Yoga: Jupiter, Venus, Mercury together or in kendras/trikonas."""
    jup = _get_lon(planets, "Jupiter")
    ven = _get_lon(planets, "Venus")
    mer = _get_lon(planets, "Mercury")
    if jup is None or ven is None or mer is None:
        return None

    # All three in kendras (1,4,7,10) or trikonas (1,5,9)
    benefic_houses = {1, 4, 5, 7, 9, 10}
    houses = {
        _house(jup, asc_lon),
        _house(ven, asc_lon),
        _house(mer, asc_lon),
    }
    active = all(h in benefic_houses for h in houses)

    return {
        "name": "Saraswati",
        "sanskrit": "Saraswati Yoga",
        "active": active,
        "description": "Jupiter, Venus, Mercury in kendras or trikonas — bestows creative and academic excellence.",
        "planets_involved": ["Jupiter", "Venus", "Mercury"],
    }


def detect_budha_aditya(planets: dict, asc_lon: float) -> dict | None:
    """Budha-Aditya Yoga: Sun and Mercury conjunct (same sign)."""
    sun = _get_lon(planets, "Sun")
    mer = _get_lon(planets, "Mercury")
    if sun is None or mer is None:
        return None

    active = _same_sign(sun, mer)
    return {
        "name": "Budha-Aditya",
        "sanskrit": "Budha-Āditya Yoga",
        "active": active,
        "description": "Sun and Mercury together — sharp intellect, communication skills, and royal recognition.",
        "planets_involved": ["Sun", "Mercury"],
    }


def detect_chandra_mangala(planets: dict, asc_lon: float) -> dict | None:
    """Chandra-Mangala Yoga: Moon and Mars conjunct or mutually aspecting."""
    moon = _get_lon(planets, "Moon")
    mars = _get_lon(planets, "Mars")
    if moon is None or mars is None:
        return None

    # Conjunction (same sign) or 7th-house opposition
    diff = abs(_sign(moon) - _sign(mars))
    active = diff == 0 or diff == 6

    return {
        "name": "Chandra-Mangala",
        "sanskrit": "Chandra-Maṅgala Yoga",
        "active": active,
        "description": "Moon and Mars conjunct or opposing — dynamic energy, entrepreneurial drive, and wealth through effort.",
        "planets_involved": ["Moon", "Mars"],
    }


def detect_neecha_bhanga_raja(planets: dict, asc_lon: float) -> dict | None:
    """
    Neecha Bhanga Raja Yoga: A debilitated planet's lord or exaltation lord
    is in a kendra from Moon or Ascendant — cancels debilitation and confers royalty.

    Simplified check: any planet in debilitation sign with its dispositor in a kendra.
    """
    # Debilitation signs (0-indexed): Sun=Libra(6), Moon=Scorpio(7), Mars=Cancer(3),
    # Mercury=Pisces(11), Jupiter=Capricorn(9), Venus=Virgo(5), Saturn=Aries(0)
    debi_signs: dict[str, int] = {
        "Sun": 6, "Moon": 7, "Mars": 3,
        "Mercury": 11, "Jupiter": 9, "Venus": 5, "Saturn": 0,
    }
    # Dispositors (sign lords) for debilitation signs
    dispositors: dict[str, str] = {
        "Sun": "Venus",       # debilitated in Libra, lord=Venus
        "Moon": "Mars",       # debilitated in Scorpio, lord=Mars
        "Mars": "Moon",       # debilitated in Cancer, lord=Moon
        "Mercury": "Jupiter", # debilitated in Pisces, lord=Jupiter
        "Jupiter": "Saturn",  # debilitated in Capricorn, lord=Saturn
        "Venus": "Mercury",   # debilitated in Virgo, lord=Mercury
        "Saturn": "Mars",     # debilitated in Aries, lord=Mars
    }

    for planet, debi_sign in debi_signs.items():
        lon = _get_lon(planets, planet)
        if lon is None:
            continue
        if _sign(lon) != debi_sign:
            continue
        # Planet is debilitated — check if dispositor is in a kendra
        disp = dispositors[planet]
        disp_lon = _get_lon(planets, disp)
        if disp_lon is None:
            continue
        if _house(disp_lon, asc_lon) in {1, 4, 7, 10}:
            return {
                "name": "Neecha Bhanga Raja",
                "sanskrit": "Nīca Bhaṅga Rāja Yoga",
                "active": True,
                "description": f"{planet} debilitation cancelled by {disp} in a kendra — extraordinary rise after adversity.",
                "planets_involved": [planet, disp],
            }

    return {
        "name": "Neecha Bhanga Raja",
        "sanskrit": "Nīca Bhaṅga Rāja Yoga",
        "active": False,
        "description": "Debilitation cancellation — extraordinary rise after adversity.",
        "planets_involved": [],
    }


# ─── Main Entry ───────────────────────────────────────────────────────────────

YOGA_DETECTORS = [
    detect_gaja_kesari,
    detect_hamsa,
    detect_saraswati,
    detect_budha_aditya,
    detect_chandra_mangala,
    detect_neecha_bhanga_raja,
]


def detect_all_yogas(planets: dict, asc_lon: float) -> dict:
    """
    Run all yoga detectors and return a summary.

    Returns:
        yogas:  list of yoga dicts (all detected, active or not)
        active: list of active yoga names
        count:  total yogas found
        active_count: number of active yogas
    """
    results = []
    for detector in YOGA_DETECTORS:
        try:
            result = detector(planets, asc_lon)
            if result is not None:
                results.append(result)
        except Exception:
            # Never crash the endpoint on a single yoga failure
            continue

    active_names = [y["name"] for y in results if y["active"]]
    dormant_names = [y["name"] for y in results if not y["active"]]

    return {
        "yogas": results,
        "active": active_names,
        "dormant": dormant_names,
        "count": len(results),
        "active_count": len(active_names),
    }
