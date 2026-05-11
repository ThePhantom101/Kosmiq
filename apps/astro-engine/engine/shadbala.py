import swisseph as swe
from typing import Dict, Any, List

def calculate_shadbala_for_chart(planets: Dict[str, Any], houses: List[float], is_day_birth: bool) -> Dict[str, Any]:
    """
    Calculates 6 Shadbala components for Sun, Moon, Mars, Mercury, Jupiter, Venus, Saturn.
    Returns normalized scores (0-100) and sub-scores.
    """
    planet_codes = {
        "Sun": swe.SUN,
        "Moon": swe.MOON,
        "Mars": swe.MARS,
        "Mercury": swe.MERCURY,
        "Jupiter": swe.JUPITER,
        "Venus": swe.VENUS,
        "Saturn": swe.SATURN
    }
    
    # Naisargika Bala (Natural Strength - Fixed)
    naisargika_bala_base = {
        "Sun": 60.00,
        "Moon": 51.43,
        "Venus": 42.85,
        "Jupiter": 34.28,
        "Mercury": 25.70,
        "Mars": 17.14,
        "Saturn": 8.57
    }

    # Helper to get house of a longitude
    def get_house(lon: float, houses: List[float]) -> int:
        for i in range(12):
            h1 = houses[i]
            h2 = houses[(i + 1) % 12]
            if h1 < h2:
                if h1 <= lon < h2:
                    return i + 1
            else: # Spans 0 degrees
                if lon >= h1 or lon < h2:
                    return i + 1
        return 1

    results = {}
    
    # Calculate components for each planet
    for name, p_data in planets.items():
        if name not in planet_codes:
            continue
            
        lon = p_data["longitude"]
        speed = p_data["speed"]
        house = get_house(lon, houses)
        
        # 1. Sthana Bala (Simplified: Exaltation/Debilitation/Own Sign)
        # Exaltation points
        exaltation = {
            "Sun": 10, "Moon": 33, "Mars": 298, "Mercury": 165, "Jupiter": 95, "Venus": 357, "Saturn": 200
        }
        dist_to_exalt = abs(lon - exaltation[name])
        if dist_to_exalt > 180: dist_to_exalt = 360 - dist_to_exalt
        # Max 60 points if at exaltation point, min 0 if at debilitation (180 deg away)
        sthana_bala = 60 * (1 - (dist_to_exalt / 180))
        
        # 2. Dig Bala (Directional Strength)
        # Strongest: Merc/Jup in 1st, Sun/Mars in 10th, Sat in 7th, Moon/Ven in 4th
        dig_targets = {
            "Mercury": 1, "Jupiter": 1, "Sun": 10, "Mars": 10, "Saturn": 7, "Moon": 4, "Venus": 4
        }
        target_house = dig_targets[name]
        # Distance in houses (1 to 6)
        house_dist = abs(house - target_house)
        if house_dist > 6: house_dist = 12 - house_dist
        # Max 60 points if in target house, min 0 if in opposite
        dig_bala = 60 * (1 - (house_dist / 6))
        
        # 3. Kala Bala (Temporal Strength)
        # Simplified: Day planets (Sun, Jup, Ven) stronger in day, Night (Moon, Mars, Sat) in night. Merc always avg.
        kala_bala = 30 # Base
        if is_day_birth:
            if name in ["Sun", "Jupiter", "Venus"]: kala_bala += 30
            elif name in ["Moon", "Mars", "Saturn"]: kala_bala -= 15
        else:
            if name in ["Moon", "Mars", "Saturn"]: kala_bala += 30
            elif name in ["Sun", "Jupiter", "Venus"]: kala_bala -= 15
            
        # 4. Chesta Bala (Motional Strength)
        # Based on speed. Retrograde (negative speed) or slow speed usually higher chesta bala for some, 
        # but generally faster is higher except for Sun/Moon.
        avg_speeds = {"Sun": 0.98, "Moon": 13.17, "Mars": 0.52, "Mercury": 1.38, "Jupiter": 0.08, "Venus": 1.2, "Saturn": 0.03}
        if name in ["Sun", "Moon"]:
            chesta_bala = 60 * (abs(speed) / (avg_speeds[name] * 1.5))
        else:
            # Retrograde planets have high Chesta Bala
            if speed < 0:
                chesta_bala = 50 + min(10, abs(speed) * 100)
            else:
                chesta_bala = 30 * (speed / avg_speeds[name])
        chesta_bala = max(0, min(60, chesta_bala))

        # 5. Naisargika Bala (Natural Strength)
        naisargika_bala = naisargika_bala_base[name]

        # 6. Drik Bala (Aspectual Strength - Simplified)
        # Random variation around 30 for flavor, influenced by proximity to Jupiter (benefic) or Saturn (malefic)
        drik_bala = 30
        jup_dist = abs(lon - planets["Jupiter"]["longitude"])
        if jup_dist > 180: jup_dist = 360 - jup_dist
        if jup_dist < 30: drik_bala += 10
        
        sat_dist = abs(lon - planets["Saturn"]["longitude"])
        if sat_dist > 180: sat_dist = 360 - sat_dist
        if sat_dist < 30: drik_bala -= 10
        
        total = sthana_bala + dig_bala + kala_bala + chesta_bala + naisargika_bala + drik_bala
        
        # Normalize to 0-100 (Typical Shadbala is 300-600 total, so we divide by ~6)
        # But user wants normalized 0-100.
        results[name] = {
            "total": round(total / 6, 2),
            "sub_scores": {
                "Sthana Bala": round(sthana_bala, 2),
                "Dig Bala": round(dig_bala, 2),
                "Kala Bala": round(kala_bala, 2),
                "Chesta Bala": round(chesta_bala, 2),
                "Naisargika Bala": round(naisargika_bala, 2),
                "Drik Bala": round(drik_bala, 2)
            }
        }
        
    return results
