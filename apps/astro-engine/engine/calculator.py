import swisseph as swe
from datetime import datetime
from typing import Dict, Any, List

# Set Ephemeris Path (if needed, but usually default is fine for basic planets)
# swe.set_ephe_path('/usr/share/swisseph')

def calculate_horoscope(
    year: int, month: int, day: int, 
    hour: int, minute: int, second: int,
    lat: float, lon: float, alt: float = 0
) -> Dict[str, Any]:
    """
    Calculates planetary positions and vargas using Lahiri Ayanamsa.
    """
    # 1. Convert to Julian Day
    jd_ut = swe.julday(year, month, day, hour + minute/60.0 + second/3600.0)

    # 2. Set Ayanamsa to Lahiri
    swe.set_sid_mode(swe.SIDM_LAHIRI)

    planets = {
        "Sun": swe.SUN,
        "Moon": swe.MOON,
        "Mars": swe.MARS,
        "Mercury": swe.MERCURY,
        "Jupiter": swe.JUPITER,
        "Venus": swe.VENUS,
        "Saturn": swe.SATURN,
        "Rahu": swe.MEAN_NODE, # Usually Mean Node is used in Vedic
    }

    results = {}
    
    # Calculate Ayanamsa value
    ayanamsa = swe.get_ayanamsa_ut(jd_ut)
    results["metadata"] = {
        "jd": jd_ut,
        "ayanamsa": ayanamsa,
        "ayanamsa_name": "Lahiri"
    }

    # 3. Calculate Planetary Positions (Sidereal)
    planetary_positions = {}
    for name, code in planets.items():
        # SEFLG_SIDEREAL (64*1024) + SEFLG_SPEED (256)
        res = swe.calc_ut(jd_ut, code, swe.FLG_SIDEREAL | swe.FLG_SPEED)
        longitude = res[0]
        speed = res[3]
        
        planetary_positions[name] = {
            "longitude": longitude,
            "speed": speed,
            "is_retrograde": speed < 0
        }
    
    # Calculate Ketu (180 degrees from Rahu)
    rahu_lon = planetary_positions["Rahu"]["longitude"]
    ketu_lon = (rahu_lon + 180) % 360
    planetary_positions["Ketu"] = {
        "longitude": ketu_lon,
        "speed": planetary_positions["Rahu"]["speed"],
        "is_retrograde": planetary_positions["Rahu"]["is_retrograde"]
    }

    results["planets"] = planetary_positions

    # 4. Calculate Houses and Ascendant (Lagna)
    # Using Placidus or Koch? In Vedic, usually Whole Sign or Sripati.
    # But first we need the Ascendant (Lagna).
    # 'P' for Placidus, 'W' for Whole Sign
    houses, ascmc = swe.houses_ex(jd_ut, lat, lon, b'W', swe.FLG_SIDEREAL)
    
    results["houses"] = list(houses)
    results["ascendant"] = ascmc[0]
    results["mc"] = ascmc[1]

    # 5. Calculate Shodashvarga (simplified for D1, D9, D10 example)
    # Varga Longitude = (Sidereal Longitude * Division Number) % 360
    vargas = {
        "D1": 1,
        "D2": 2,
        "D3": 3,
        "D4": 4,
        "D7": 7,
        "D9": 9,
        "D10": 10,
        "D12": 12,
        "D16": 16,
        "D20": 20,
        "D24": 24,
        "D27": 27,
        "D30": 30,
        "D40": 40,
        "D45": 45,
        "D60": 60
    }

    shodashvarga = {}
    for v_name, v_div in vargas.items():
        varga_data = {}
        for p_name, p_data in planetary_positions.items():
            v_lon = (p_data["longitude"] * v_div) % 360
            varga_data[p_name] = v_lon
        
        # Add Ascendant to varga
        varga_data["Ascendant"] = (results["ascendant"] * v_div) % 360
        shodashvarga[v_name] = varga_data

    results["shodashvarga"] = shodashvarga

    return results
