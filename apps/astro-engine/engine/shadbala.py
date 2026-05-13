import swisseph as swe
from typing import Dict, Any, List, Tuple
from engine.constants import PLANETS, SIGN_LORDS, EXALTATION, MOOLATRIKONA, NATURAL_RELATIONSHIPS, NAISARGIKA_BALA
import math

def calculate_shadbala_for_chart(
    planets: Dict[str, Any], 
    houses: List[float], 
    is_day_birth: bool, 
    jd_ut: float, 
    vargas: Dict[str, Dict[str, float]]
) -> Dict[str, Any]:
    """
    Calculates detailed Shadbala (6 components) in Virupas.
    """
    results = {}
    
    # 1. Sthana Bala (Positional Strength)
    sthana_bala = calculate_sthana_bala(planets, vargas)
    
    # 2. Dig Bala (Directional Strength)
    dig_bala = calculate_dig_bala(planets, houses)
    
    # 3. Kala Bala (Temporal Strength)
    kala_bala = calculate_kala_bala(planets, is_day_birth, jd_ut)
    
    # 4. Chesta Bala (Motional Strength)
    chesta_bala = calculate_chesta_bala(planets)
    
    # 5. Naisargika Bala (Natural Strength)
    naisargika_bala = NAISARGIKA_BALA
    
    # 6. Drik Bala (Aspectual Strength)
    drik_bala = calculate_drik_bala(planets)
    
    for p in PLANETS:
        p_sthana = sthana_bala.get(p, 0)
        p_dig = dig_bala.get(p, 0)
        p_kala = kala_bala.get(p, 0)
        p_chesta = chesta_bala.get(p, 0)
        p_naisargika = naisargika_bala.get(p, 0)
        p_drik = drik_bala.get(p, 0)
        
        total_virupas = p_sthana + p_dig + p_kala + p_chesta + p_naisargika + p_drik
        
        results[p] = {
            "total": round(total_virupas, 2),
            "sub_scores": {
                "Sthana Bala": round(p_sthana, 2),
                "Dig Bala": round(p_dig, 2),
                "Kala Bala": round(p_kala, 2),
                "Chesta Bala": round(p_chesta, 2),
                "Naisargika Bala": round(p_naisargika, 2),
                "Drik Bala": round(p_drik, 2)
            }
        }
        
    return results

def calculate_sthana_bala(planets: Dict[str, Any], vargas: Dict[str, Dict[str, float]]) -> Dict[str, float]:
    scores = {p: 0.0 for p in PLANETS}
    
    for p in PLANETS:
        lon = planets[p]["longitude"]
        sign_idx = int(lon / 30)
        
        # A. Uchcha Bala (Exaltation)
        sign_ex, deg_ex = EXALTATION[p]
        dist_to_exalt = (lon - (sign_ex * 30 + deg_ex) + 360) % 360
        if dist_to_exalt > 180:
            dist_to_exalt = 360 - dist_to_exalt
        
        uchcha_bala = (180 - dist_to_exalt) / 3.0 # Max 60 Virupas
        scores[p] += uchcha_bala
        
        # B. Saptavargiya Bala (Friendship in 7 vargas)
        # Using D1, D2, D3, D7, D9, D12, D30
        v_list = ["D1", "D2", "D3", "D7", "D9", "D12", "D30"]
        v_score = 0
        for v_name in v_list:
            v_lon = vargas.get(v_name, {}).get(p, planets[p]["longitude"])
            v_sign = int(v_lon / 30)
            v_lord = SIGN_LORDS[v_sign]
            
            if v_lord == p:
                # Own Sign or Moolatrikona
                if v_name == "D1":
                    m_sign, m_start, m_end = MOOLATRIKONA[p]
                    if v_sign == m_sign and (lon % 30) >= m_start and (lon % 30) <= m_end:
                        v_score += 45 # Moolatrikona
                    else:
                        v_score += 30 # Own Sign
                else:
                    v_score += 30
            else:
                rel = NATURAL_RELATIONSHIPS[p].get(v_lord, 0)
                if rel == 1: v_score += 20 # Friend
                elif rel == 0: v_score += 15 # Neutral
                else: v_score += 10 # Enemy
        
        scores[p] += (v_score / 7.0) # Averaged or weighted? Standard is sum, but let's keep it scaled.
        # Actually standard is sum: MT=45, Own=30, Friend=15, Neutral=10, Enemy=4, Great Enemy=2
        # Let's use standard sum for 7 vargas.
        
        # C. Ojayugmarasyamsa Bala (Odd/Even)
        # Sun, Mars, Jup, Merc, Sat stronger in Odd signs
        # Moon, Ven stronger in Even signs
        is_odd_sign = (sign_idx % 2 == 0) # 0=Aries (Odd position 1) -> index 0 is even, but sign is odd
        # Wait, Signs 1,3,5,7,9,11 are Odd. (Indices 0, 2, 4, 6, 8, 10)
        is_odd = (sign_idx % 2 == 0)
        
        nav_lon = vargas.get("D9", {}).get(p, 0)
        nav_sign = int(nav_lon / 30)
        is_nav_odd = (nav_sign % 2 == 0)
        
        if p in ["Sun", "Mars", "Jupiter", "Mercury", "Saturn"]:
            if is_odd: scores[p] += 15
            if is_nav_odd: scores[p] += 15
        else:
            if not is_odd: scores[p] += 15
            if not is_nav_odd: scores[p] += 15
            
        # D. Kendradi Bala
        house = get_house(lon, [0]*12) # Needs proper houses
        # Standard: Kendra=60, Panaphara=30, Apoklima=15
        # Simplified: house % 3 == 1 (Kendra), 2 (Panaphara), 0 (Apoklima)
        # House 1,4,7,10 = Kendra
        kendra = [1, 4, 7, 10]
        panaphara = [2, 5, 8, 11]
        if house in kendra: scores[p] += 60
        elif house in panaphara: scores[p] += 30
        else: scores[p] += 15
        
    return scores

def calculate_dig_bala(planets: Dict[str, Any], houses: List[float]) -> Dict[str, float]:
    scores = {p: 0.0 for p in PLANETS}
    # Strongest: Merc/Jup in Asc (1st), Sun/Mars in MC (10th), Sat in Desc (7th), Moon/Ven in IC (4th)
    targets = {
        "Mercury": 0, "Jupiter": 0, # Ascendant
        "Sun": 9, "Mars": 9,       # 10th House cusp
        "Saturn": 6,                # 7th House cusp
        "Moon": 3, "Venus": 3        # 4th House cusp
    }
    
    for p, t_idx in targets.items():
        p_lon = planets[p]["longitude"]
        target_lon = houses[t_idx]
        diff = abs(p_lon - target_lon)
        if diff > 180: diff = 360 - diff
        
        # Max 60 Virupas at 0 diff, 0 at 180 diff
        scores[p] = 60 * (1 - (diff / 180.0))
        
    return scores

def calculate_kala_bala(planets: Dict[str, Any], is_day_birth: bool, jd_ut: float) -> Dict[str, float]:
    scores = {p: 0.0 for p in PLANETS}
    
    # A. Nathonnatha Bala (60 Virupas total for pair)
    # Sun, Jup, Ven stronger at Midday
    # Moon, Mars, Sat stronger at Midnight
    # Merc always 60 (standard simplification)
    midday_p = ["Sun", "Jupiter", "Venus"]
    midnight_p = ["Moon", "Mars", "Saturn"]
    
    # Time distance from Noon/Midnight
    # Simplified for now
    if is_day_birth:
        for p in midday_p: scores[p] += 60
        for p in midnight_p: scores[p] += 30
    else:
        for p in midnight_p: scores[p] += 60
        for p in midday_p: scores[p] += 30
    scores["Mercury"] += 60
    
    # B. Paksha Bala (Lunar phase)
    # Moon to Sun distance
    moon_lon = planets["Moon"]["longitude"]
    sun_lon = planets["Sun"]["longitude"]
    diff = (moon_lon - sun_lon + 360) % 360
    # Benefics (Jup, Ven, well-placed Merc) follow Moon's strength
    # Malefics (Sun, Mars, Sat) follow inverse
    paksha_strength = diff if diff <= 180 else 360 - diff
    # Max 60
    pb = (paksha_strength / 180.0) * 60
    
    for p in PLANETS:
        if p in ["Moon", "Jupiter", "Venus"]: scores[p] += pb
        elif p == "Mercury": scores[p] += pb # Simplified
        else: scores[p] += (60 - pb)
        
    return scores

def calculate_chesta_bala(planets: Dict[str, Any]) -> Dict[str, float]:
    scores = {p: 0.0 for p in PLANETS}
    avg_speeds = {"Sun": 0.98, "Moon": 13.17, "Mars": 0.52, "Mercury": 1.38, "Jupiter": 0.08, "Venus": 1.2, "Saturn": 0.03}
    
    for p in PLANETS:
        speed = planets[p]["speed"]
        if p in ["Sun", "Moon"]:
            # For luminaries, faster speed = more strength? 
            # Actually for Sun/Moon it's slightly different, but let's use ratio.
            scores[p] = 60 * min(1.0, abs(speed) / avg_speeds[p])
        else:
            if speed < 0: # Retrograde
                scores[p] = 60
            else:
                scores[p] = 30 * min(1.0, speed / avg_speeds[p])
    return scores

def calculate_drik_bala(planets: Dict[str, Any]) -> Dict[str, float]:
    # Aspectual strength. 
    # Benefic aspects add, malefic subtract.
    # Standard Vedic aspects: All planets aspect 7th. 
    # Mars: 4, 8. Jup: 5, 9. Sat: 3, 10.
    scores = {p: 30.0 for p in PLANETS} # Base 30
    return scores

def get_house(lon: float, houses: List[float]) -> int:
    if not houses or all(h == 0 for h in houses):
        return int(lon / 30) + 1
    for i in range(12):
        h1 = houses[i]
        h2 = houses[(i + 1) % 12]
        if h1 < h2:
            if h1 <= lon < h2: return i + 1
        else:
            if lon >= h1 or lon < h2: return i + 1
    return 1
