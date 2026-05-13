import swisseph as swe
from typing import Dict, Any, List

def calculate_upagrahas(jd_ut: float, lat: float, lon: float) -> Dict[str, float]:
    """
    Calculates positions of Gulika, Mandi, and other shadow planets.
    """
    # 1. Get Sunrise and Sunset
    res = swe.rise_trans(jd_ut, swe.SUN, swe.CALC_RISE, (lon, lat, 0), 0, 0, swe.FLG_SWIEPH)
    sunrise_jd = res[1][0]
    res = swe.rise_trans(jd_ut, swe.SUN, swe.CALC_SET, (lon, lat, 0), 0, 0, swe.FLG_SWIEPH)
    sunset_jd = res[1][0]
    
    is_day = sunrise_jd <= jd_ut < sunset_jd
    
    duration = (sunset_jd - sunrise_jd) if is_day else (1.0 - (sunset_jd - sunrise_jd))
    part_duration = duration / 8.0
    
    # 2. Gulika/Mandi Calculation
    # Day: Sat's portion start. Day parts: Sun(1), Mon(2), Mar(3), Mer(4), Jup(5), Ven(6), Sat(7), 8th is lord-less.
    # Day of week: 0=Sun, 1=Mon...
    day_of_week = int(jd_ut + 0.5) % 7 # Simplified
    # Correct day of week for sunrise
    dow = (day_of_week + 1) % 7 # 0=Sun
    
    # Gulika start part index (0-indexed)
    # Sat is 7th from Sun. For Sunday, Sat is 7th part.
    # Order: Sun, Mon, Tue, Wed, Thu, Fri, Sat
    parts_order = [6, 5, 4, 3, 2, 1, 0] # Saturday's index in the 8 parts for each starting day
    # Sunday start (Sun lord): Sat is 7th part (idx 6).
    # Monday start (Mon lord): Sat is 6th part (idx 5).
    gulika_part = (7 - dow + 7) % 7
    
    gulika_time = sunrise_jd + (gulika_part * part_duration)
    if not is_day:
        # Night calculation starts from sunset
        # Night order starts from 5th day lord from day lord
        night_dow = (dow + 4) % 7
        gulika_part_n = (7 - night_dow + 7) % 7
        gulika_time = sunset_jd + (gulika_part_n * part_duration)
        
    # Calculate Lagna at that time
    houses, ascmc = swe.houses_ex(gulika_time, lat, lon, b'W', swe.FLG_SIDEREAL)
    gulika_lon = ascmc[0]
    
    return {
        "Gulika": gulika_lon,
        "Mandi": (gulika_lon - 2.5 + 360) % 360 # Simplified offset
    }

def get_varga_position(longitude: float, varga: int, sign_idx: int = None) -> float:
    """
    Advanced varga calculation for Shodashvarga.
    """
    if sign_idx is None:
        sign_idx = int(longitude / 30)
    pos_in_sign = longitude % 30
    
    if varga == 1:
        return longitude
    
    if varga == 9: # Navamsa
        start_signs = [0, 9, 6, 3] # Ar, Cp, Li, Cn
        nav_idx = int(pos_in_sign / (30/9.0))
        varga_sign = (start_signs[sign_idx % 4] + nav_idx) % 12
        return (varga_sign * 30) + (pos_in_sign * 9 % 30)
        
    if varga == 10: # Dasamsa
        # Odd signs start from same sign, Even signs start from 9th sign
        start_sign = sign_idx if (sign_idx % 2 == 0) else (sign_idx + 8) % 12
        div_idx = int(pos_in_sign / 3.0)
        varga_sign = (start_sign + div_idx) % 12
        return (varga_sign * 30) + (pos_in_sign * 10 % 30)
        
    # Fallback for others
    return (longitude * varga) % 360
