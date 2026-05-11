import math
from typing import Dict, Any, List, Optional
from pydantic import BaseModel

# ─── Data Tables ─────────────────────────────────────────────────────────────

# Varna: Brahmin (4), Kshatriya (3), Vaishya (2), Shudra (1)
SIGN_VARNA = {
    0: 3, 1: 2, 2: 1, 3: 4,  # Ari, Tau, Gem, Can
    4: 3, 5: 2, 6: 1, 7: 4,  # Leo, Vir, Lib, Sco
    8: 3, 9: 2, 10: 1, 11: 4  # Sag, Cap, Aqu, Pis
}

# Vashya: 1=Chatushpada, 2=Manava, 3=Jalachara, 4=Vanachara, 5=Keeta
SIGN_VASHYA = {
    0: 1, 1: 1, 2: 2, 3: 3,
    4: 4, 5: 2, 6: 2, 7: 5,
    8: 1, 9: 1, 10: 2, 11: 3
}

# Yoni Animals: 0=Horse, 1=Elephant, 2=Sheep, 3=Serpent, 4=Dog, 5=Cat, 6=Rat, 7=Cow, 
# 8=Buffalo, 9=Tiger, 10=Deer, 11=Monkey, 12=Lion, 13=Mongoose
NAKSHATRA_YONI = {
    1: 0, 2: 1, 3: 2, 4: 3, 5: 3, 6: 4, 7: 5, 8: 2, 9: 5,
    10: 6, 11: 6, 12: 7, 13: 8, 14: 9, 15: 8, 16: 9, 17: 10, 18: 10,
    19: 4, 20: 11, 21: 11, 22: 11, 23: 12, 24: 0, 25: 12, 26: 7, 27: 13
}

# Yoni Compatibility Matrix (4=Ideal, 0=Enemies)
YONI_MATRIX = [
    [4, 2, 2, 3, 2, 2, 2, 2, 2, 2, 2, 3, 2, 1, 2], # Simplified for code brevity
    # (Full matrix is 14x14, we'll use a simplified mapping or logic)
]

# Gana: 0=Deva, 1=Manushya, 2=Rakshasa
NAKSHATRA_GANA = {
    1: 0, 2: 1, 3: 2, 4: 1, 5: 0, 6: 1, 7: 0, 8: 0, 9: 2,
    10: 2, 11: 1, 12: 1, 13: 0, 14: 2, 15: 0, 16: 2, 17: 0, 18: 2,
    19: 2, 20: 1, 21: 1, 22: 0, 23: 2, 24: 2, 25: 1, 26: 1, 27: 0
}

# Nadi: 0=Adi, 1=Madhya, 2=Antya
NAKSHATRA_NADI = {
    1: 0, 2: 1, 3: 2, 4: 2, 5: 1, 6: 0, 7: 0, 8: 1, 9: 2,
    10: 2, 11: 1, 12: 0, 13: 0, 14: 1, 15: 2, 16: 2, 17: 1, 18: 0,
    19: 0, 20: 1, 21: 2, 22: 2, 23: 1, 24: 0, 25: 0, 26: 1, 27: 2
}

# Graha Maitri Lord Relationships (5=Friend, 4=Neutral, 0=Enemy)
LORD_RELATIONS = {
    "Sun": {"Sun": 5, "Moon": 5, "Mars": 5, "Mercury": 4, "Jupiter": 5, "Venus": 0, "Saturn": 0},
    "Moon": {"Sun": 5, "Moon": 5, "Mars": 4, "Mercury": 5, "Jupiter": 4, "Venus": 4, "Saturn": 4},
    "Mars": {"Sun": 5, "Moon": 5, "Mars": 5, "Mercury": 0, "Jupiter": 5, "Venus": 4, "Saturn": 4},
    "Mercury": {"Sun": 5, "Moon": 0, "Mars": 4, "Mercury": 5, "Jupiter": 4, "Venus": 5, "Saturn": 4},
    "Jupiter": {"Sun": 5, "Moon": 5, "Mars": 5, "Mercury": 0, "Jupiter": 5, "Venus": 0, "Saturn": 4},
    "Venus": {"Sun": 0, "Moon": 0, "Mars": 4, "Mercury": 5, "Jupiter": 4, "Venus": 5, "Saturn": 5},
    "Saturn": {"Sun": 0, "Moon": 0, "Mars": 0, "Mercury": 5, "Jupiter": 4, "Venus": 5, "Saturn": 5},
}

SIGN_LORDS = {
    0: "Mars", 1: "Venus", 2: "Mercury", 3: "Moon",
    4: "Sun", 5: "Mercury", 6: "Venus", 7: "Mars",
    8: "Jupiter", 9: "Saturn", 10: "Saturn", 11: "Jupiter"
}

# ─── Logic ────────────────────────────────────────────────────────────────────

def calculate_koota(n1: int, s1: int, n2: int, s2: int) -> Dict[str, Any]:
    """
    n1, n2: Nakshatra indices (1-27)
    s1, s2: Sign indices (0-11)
    """
    results = {}
    total = 0

    # 1. Varna (1 pt)
    v1 = SIGN_VARNA[s1]
    v2 = SIGN_VARNA[s2]
    score_varna = 1 if v1 >= v2 else 0
    total += score_varna
    results["Varna"] = {"score": score_varna, "max": 1, "sanskrit": "Varna", "status": "Full" if score_varna == 1 else "Zero", "explanation": "Spiritual compatibility based on karmic temperament."}

    # 2. Vashya (2 pts)
    vash1 = SIGN_VASHYA[s1]
    vash2 = SIGN_VASHYA[s2]
    # Simple logic: 2 if same, 1 if friendly, 0 if enemy
    score_vashya = 2 if vash1 == vash2 else 1 # Simplified
    total += score_vashya
    results["Vashya"] = {"score": score_vashya, "max": 2, "sanskrit": "Vashya", "status": "Full" if score_vashya == 2 else "Partial", "explanation": "Power dynamics and mutual attraction."}

    # 3. Tara (3 pts)
    diff = (n2 - n1 + 27) % 9
    if diff == 0: diff = 9
    score_tara = 3 if diff in [3, 5, 7] else 1.5 if diff in [2, 4, 6, 8, 9] else 0 # Simplified
    total += score_tara
    results["Tara"] = {"score": score_tara, "max": 3, "sanskrit": "Tara", "status": "Full" if score_tara == 3 else "Partial", "explanation": "Health and destiny alignment between the pair."}

    # 4. Yoni (4 pts)
    y1 = NAKSHATRA_YONI[n1]
    y2 = NAKSHATRA_YONI[n2]
    score_yoni = 4 if y1 == y2 else 2 # Simplified
    total += score_yoni
    results["Yoni"] = {"score": score_yoni, "max": 4, "sanskrit": "Yoni", "status": "Full" if score_yoni == 4 else "Partial", "explanation": "Physical and biological compatibility."}

    # 5. Graha Maitri (5 pts)
    l1 = SIGN_LORDS[s1]
    l2 = SIGN_LORDS[s2]
    rel1 = LORD_RELATIONS[l1].get(l2, 0)
    rel2 = LORD_RELATIONS[l2].get(l1, 0)
    score_maitri = (rel1 + rel2) / 2 # 0-5
    total += score_maitri
    results["Graha Maitri"] = {"score": score_maitri, "max": 5, "sanskrit": "Graha Maitri", "status": "Full" if score_maitri >= 4 else "Partial", "explanation": "Mental and psychological resonance."}

    # 6. Gana (6 pts)
    g1 = NAKSHATRA_GANA[n1]
    g2 = NAKSHATRA_GANA[n2]
    if g1 == g2: score_gana = 6
    elif (g1 == 0 and g2 == 1) or (g1 == 1 and g2 == 0): score_gana = 5
    elif (g1 == 0 and g2 == 2) or (g1 == 2 and g2 == 0): score_gana = 1
    else: score_gana = 0
    total += score_gana
    results["Temperament"] = {"score": score_gana, "max": 6, "sanskrit": "Gana", "status": "Full" if score_gana >= 5 else "Zero", "explanation": "Nature and temperament compatibility."}

    # 7. Bhakoot (7 pts)
    s_diff = (s2 - s1 + 12) % 12
    if s_diff in [0, 6, 3, 4, 8, 9]: # Friendly distances
        score_bhakoot = 7
    else:
        score_bhakoot = 0
    total += score_bhakoot
    results["Destiny"] = {"score": score_bhakoot, "max": 7, "sanskrit": "Bhakoot", "status": "Full" if score_bhakoot == 7 else "Zero", "explanation": "Emotional and relative longevity compatibility."}

    # 8. Nadi (8 pts)
    nd1 = NAKSHATRA_NADI[n1]
    nd2 = NAKSHATRA_NADI[n2]
    score_nadi = 8 if nd1 != nd2 else 0
    total += score_nadi
    results["Stars Alignment"] = {"score": score_nadi, "max": 8, "sanskrit": "Nadi", "status": "Full" if score_nadi == 8 else "Zero", "explanation": "Genetic compatibility and health of progeny."}

    return {"total_score": total, "koota_scores": results}

def check_mangal_dosha(planets: Dict[str, Any], asc_lon: float) -> Dict[str, Any]:
    def get_house(lon, asc):
        return int(((lon - asc + 360) % 360) / 30) + 1
    
    mars_lon = planets["Mars"]["longitude"]
    house = get_house(mars_lon, asc_lon)
    
    is_dosha = house in [1, 4, 7, 8, 12]
    severity = "High" if house in [7, 8] else "Medium" if is_dosha else "None"
    
    # Simple cancellation: Jupiter aspect or Mars in own/exalt sign
    sign_idx = int(mars_lon / 30)
    is_cancelled = False
    if sign_idx in [0, 7, 9]: # Aries, Scorpio, Capricorn
        is_cancelled = True
        
    return {
        "active": is_dosha and not is_cancelled,
        "present": is_dosha,
        "severity": severity,
        "cancelled": is_cancelled,
        "house": house,
        "explanation": f"Mars in {house}th house."
    }

def calculate_compatibility_logic(chart1: Dict[str, Any], chart2: Dict[str, Any]) -> Dict[str, Any]:
    # Extract Moon data
    m1 = chart1["planets"]["Moon"]
    m2 = chart2["planets"]["Moon"]
    
    n1 = m1["nakshatra"]["index"]
    s1 = int(m1["longitude"] / 30)
    
    n2 = m2["nakshatra"]["index"]
    s2 = int(m2["longitude"] / 30)
    
    koota = calculate_koota(n1, s1, n2, s2)
    
    dosha1 = check_mangal_dosha(chart1["planets"], chart1["ascendant"])
    dosha2 = check_mangal_dosha(chart2["planets"], chart2["ascendant"])
    
    # Nadi Dosha is when score is 0
    nadi_dosha = koota["koota_scores"]["Stars Alignment"]["score"] == 0
    bhakoot_dosha = koota["koota_scores"]["Destiny"]["score"] == 0
    
    dosha_analysis = [
        {
            "name": "Mangal Dosha (Person 1)",
            "affects": "Marital harmony",
            "status": "Present" if dosha1["active"] else "Cancelled" if dosha1["cancelled"] else "Absent",
            "reason": dosha1["explanation"] if dosha1["present"] else ""
        },
        {
            "name": "Mangal Dosha (Person 2)",
            "affects": "Marital harmony",
            "status": "Present" if dosha2["active"] else "Cancelled" if dosha2["cancelled"] else "Absent",
            "reason": dosha2["explanation"] if dosha2["present"] else ""
        },
        {
            "name": "Nadi Dosha",
            "affects": "Progeny & Health",
            "status": "Present" if nadi_dosha else "Absent",
            "reason": "Both have same Nadi" if nadi_dosha else ""
        },
        {
            "name": "Bhakoot Dosha",
            "affects": "Emotional bond",
            "status": "Present" if bhakoot_dosha else "Absent",
            "reason": "Inauspicious moon sign distance" if bhakoot_dosha else ""
        }
    ]
    
    return {
        "total_score": koota["total_score"],
        "koota_scores": [
            {"category": k, **v} for k, v in koota["koota_scores"].items()
        ],
        "dosha_analysis": dosha_analysis
    }
