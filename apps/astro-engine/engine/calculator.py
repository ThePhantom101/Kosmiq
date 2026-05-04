import swisseph as swe
from datetime import datetime
from typing import Dict, Any, List

# Set Ephemeris Path if available
# swe.set_ephe_path('/usr/share/swisseph')

def get_varga_position(longitude: float, varga: int) -> float:
    """
    Calculates the longitude in a specific divisional chart (Varga).
    Formula: (Longitude % 30) * Varga, then mapped back to a sign.
    This is a simplified version; some vargas have complex mapping rules.
    """
    sign_idx = int(longitude / 30)
    pos_in_sign = longitude % 30
    varga_lon = (pos_in_sign * varga) % 360
    # Map back to the appropriate sign based on varga rules
    # For D9 (Navamsha):
    if varga == 9:
        # Standard Parasari Navamsha
        # Aries, Leo, Sag start from Aries
        # Taurus, Virgo, Cap start from Capricorn
        # Gemini, Libra, Aqua start from Libra
        # Cancer, Scorpio, Pisces start from Cancer
        start_signs = [0, 9, 6, 3] # Aries=0, Cap=9, Libra=6, Cancer=3
        nav_idx = int(pos_in_sign / (30/9))
        varga_sign = (start_signs[sign_idx % 4] + nav_idx) % 12
        return (varga_sign * 30) + (varga_lon % 30)
    
    return varga_lon # Fallback for others

def get_nakshatra(longitude: float) -> Dict[str, Any]:
    """
    Calculates Nakshatra and Pada from longitude.
    """
    nakshatras = [
        "Ashwini", "Bharani", "Krittika", "Rohini", "Mrigashira", "Ardra", 
        "Punarvasu", "Pushya", "Ashlesha", "Magha", "Purva Phalguni", "Uttara Phalguni", 
        "Hasta", "Chitra", "Swati", "Vishakha", "Anuradha", "Jyeshtha", 
        "Mula", "Purva Ashadha", "Uttara Ashadha", "Shravana", "Dhanishta", "Shatabhisha", 
        "Purva Bhadrapada", "Uttara Bhadrapada", "Revati"
    ]
    
    # Each Nakshatra is 13°20' (13.333333 degrees)
    nak_idx = int(longitude / (360/27))
    pos_in_nak = longitude % (360/27)
    # Each Pada is 3°20' (3.333333 degrees)
    pada = int(pos_in_nak / (360/(27*4))) + 1
    
    return {
        "name": nakshatras[nak_idx % 27],
        "pada": pada,
        "index": (nak_idx % 27) + 1
    }

def calculate_horoscope(
    year: int, month: int, day: int, 
    hour: float, minute: int, second: int,
    lat: float, lon: float, alt: float = 0
) -> Dict[str, Any]:
    """
    Calculates planetary positions and vargas using Lahiri Ayanamsa.
    """
    jd_ut = swe.julday(year, month, day, hour + minute/60.0 + second/3600.0)
    swe.set_sid_mode(swe.SIDM_LAHIRI)

    planets = {
        "Sun": swe.SUN,
        "Moon": swe.MOON,
        "Mars": swe.MARS,
        "Mercury": swe.MERCURY,
        "Jupiter": swe.JUPITER,
        "Venus": swe.VENUS,
        "Saturn": swe.SATURN,
        "Rahu": swe.MEAN_NODE, 
    }

    ayanamsa = swe.get_ayanamsa_ut(jd_ut)
    metadata = {
        "jd": jd_ut,
        "ayanamsa": ayanamsa,
        "ayanamsa_name": "Lahiri"
    }

    planetary_positions = {}
    vargas = {"D1": {}, "D9": {}, "D10": {}}
    
    for name, code in planets.items():
        res, flag = swe.calc_ut(jd_ut, code, swe.FLG_SIDEREAL | swe.FLG_SPEED)
        longitude = res[0]
        speed = res[3]
        
        planetary_positions[name] = {
            "longitude": longitude,
            "speed": speed,
            "is_retrograde": speed < 0,
            "nakshatra": get_nakshatra(longitude)
        }
        
        # Calculate Vargas
        vargas["D1"][name] = longitude
        vargas["D9"][name] = get_varga_position(longitude, 9)
        vargas["D10"][name] = get_varga_position(longitude, 10)
    
    # Ketu
    rahu_lon = planetary_positions["Rahu"]["longitude"]
    ketu_lon = (rahu_lon + 180) % 360
    planetary_positions["Ketu"] = {
        "longitude": ketu_lon,
        "speed": planetary_positions["Rahu"]["speed"],
        "is_retrograde": planetary_positions["Rahu"]["is_retrograde"],
        "nakshatra": get_nakshatra(ketu_lon)
    }
    
    for v in vargas:
        vargas[v]["Ketu"] = get_varga_position(ketu_lon, int(v[1:]) if v != "D1" else 1)

    # Calculate Ascendant (Lagna)
    houses, ascmc = swe.houses_ex(jd_ut, lat, lon, b'W', swe.FLG_SIDEREAL)
    asc_lon = ascmc[0]
    
    # Add Ascendant to Vargas
    vargas["D1"]["Lagna"] = asc_lon
    vargas["D9"]["Lagna"] = get_varga_position(asc_lon, 9)
    vargas["D10"]["Lagna"] = get_varga_position(asc_lon, 10)

    # Planetary Strengths (Simplified)
    strengths = {
        name: 60 + (pos["speed"] * 5) for name, pos in planetary_positions.items()
    }
    strengths["Lagna"] = 75

    return {
        "metadata": metadata,
        "planets": planetary_positions,
        "shodashvarga": vargas,
        "ascendant": asc_lon,
        "ascendant_nakshatra": get_nakshatra(asc_lon),
        "astro_score": 78,
        "planetary_strengths": strengths,
        "ashtakavarga": {}
    }
