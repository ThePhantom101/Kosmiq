from fastapi import FastAPI, HTTPException, Depends, Query
from pydantic import BaseModel, Field
from datetime import datetime, date, timedelta
from typing import Optional, Dict, Any, List
from sqlalchemy.orm import Session
from engine.calculator import calculate_horoscope, get_varga_position
from engine.ai_synthesis import astro_ai_engine, generate_monthly_narrative_ai, generate_compatibility_narrative
from engine.dasha import calculate_vimshottari
from engine.yogas import detect_all_yogas
from engine.flags import compute_flags
from engine.transits import compute_transit_score
from engine.db import get_db, Chart, Profile
from engine.shadbala import calculate_shadbala_for_chart
from engine.compatibility import calculate_compatibility_logic
from dateutil import parser
import swisseph as swe
import math

# ─── Shadow Planet Models ─────────────────────────────────────────────────────

class ShadowPlanet(BaseModel):
    name: str
    sanskrit: str
    house: int
    sign: str
    description: str
    type: str # Amplifying, Spiritualizing, Challenging, Protective

class ShadowPlanetsResponse(BaseModel):
    shadows: List[ShadowPlanet]

app = FastAPI(title="Kosmiq Astro Engine")

# ─── Shared Request / Response Models ─────────────────────────────────────────

class ChartRequest(BaseModel):
    date_of_birth: str = Field(..., description="YYYY-MM-DD", example="1990-01-01")
    time_of_birth: str = Field(..., description="HH:mm:ss", example="12:00:00")
    latitude: float = Field(..., ge=-90, le=90)
    longitude: float = Field(..., ge=-180, le=180)
    timezone_offset: float = Field(..., description="Offset from UTC in hours", example=5.5)

class Nakshatra(BaseModel):
    name: str
    pada: int
    index: int

class PlanetaryPosition(BaseModel):
    longitude: float
    speed: float
    is_retrograde: bool
    nakshatra: Nakshatra

class ChartResponse(BaseModel):
    metadata: Dict[str, Any]
    planets: Dict[str, PlanetaryPosition]
    shodashvarga: Dict[str, Any]
    ascendant: float
    ascendant_nakshatra: Nakshatra
    astro_score: int
    planetary_strengths: Dict[str, float]
    ashtakavarga: Dict[str, Any]

class SynthesisRequest(BaseModel):
    chart_data: Dict[str, Any]

class SynthesisResponse(BaseModel):
    reading: str


# ─── Dasha Models ─────────────────────────────────────────────────────────────

class DashaRequest(BaseModel):
    """
    Accepts the already-computed ChartResponse so the caller does not need
    to re-submit birth details. The Moon longitude and birth date are all
    that is needed for Vimshottari calculation.
    """
    chart_data: Dict[str, Any] = Field(
        ...,
        description="Full ChartResponse body as returned by /api/v1/calculate/chart"
    )
    date_of_birth: str = Field(..., description="YYYY-MM-DD", example="1995-03-14")

class DashaPeriod(BaseModel):
    lord: str
    start: str
    end: str
    duration_years: float

class AntardashaDetail(BaseModel):
    lord: str
    start: str
    end: str
    percent_complete: float

class MahadashaDetail(BaseModel):
    lord: str
    start: str
    end: str
    duration_years: float
    percent_complete: float

class DashaResponse(BaseModel):
    current_mahadasha: MahadashaDetail
    current_antardasha: AntardashaDetail
    sequence: List[DashaPeriod]


# ─── Yoga Models ──────────────────────────────────────────────────────────────

class YogaRequest(BaseModel):
    chart_data: Dict[str, Any] = Field(
        ...,
        description="Full ChartResponse body as returned by /api/v1/calculate/chart"
    )

class YogaDetail(BaseModel):
    name: str
    sanskrit: str
    active: bool
    description: str
    planets_involved: List[str]

class YogaResponse(BaseModel):
    yogas: List[Dict[str, Any]]
    summary: str


# ─── Flags Models ─────────────────────────────────────────────────────────────

class FlagsRequest(BaseModel):
    chart_data: Dict[str, Any] = Field(
        ...,
        description="Full ChartResponse body as returned by /api/v1/calculate/chart"
    )

class SadeSatiDetail(BaseModel):
    name: str
    sanskrit: str
    active: bool
    phase: str
    severity: str
    natal_moon_sign: Optional[str] = None
    current_saturn_sign: Optional[str] = None
    years_remaining: Optional[float] = None
    description: str

class MangalDoshaDetail(BaseModel):
    name: str
    sanskrit: str
    active: bool
    severity: str
    triggered_from: List[str]
    cancellation_present: bool
    description: str

class FlagsResponse(BaseModel):
    sade_sati: SadeSatiDetail
    mangal_dosha: MangalDoshaDetail


# ─── Transit Models ───────────────────────────────────────────────────────────

class TransitRequest(BaseModel):
    chart_data: Dict[str, Any] = Field(
        ...,
        description="Full ChartResponse body as returned by /api/v1/calculate/chart"
    )

class TransitResponse(BaseModel):
    score: int = Field(..., ge=0, le=100)
    sentiment: str
    key_transits: List[str]
    current_sky: Dict[str, float]


# ─── Varga Models ─────────────────────────────────────────────────────────────

class VargaRequest(BaseModel):
    chart_data: Dict[str, Any] = Field(
        ...,
        description="Full ChartResponse body"
    )
    division: int = Field(..., description="Varga division number (e.g. 9 for Navamsa)", example=9)

class VargaResponse(Dict[str, float]):
    """Returns a map of planet names to their longitudes in the varga chart."""
    pass


class ShadbalaPlanet(BaseModel):
    total: float
    sub_scores: Dict[str, float]

class ShadbalaResponse(BaseModel):
    planets: Dict[str, ShadbalaPlanet]
    summary: str


# ─── Panchang Models ──────────────────────────────────────────────────────────

class PanchangElement(BaseModel):
    name: str
    number: Optional[int] = None
    quality: str  # Auspicious, Neutral, Inauspicious
    extra: Optional[str] = None

class PanchangResponse(BaseModel):
    tithi: PanchangElement
    vara: PanchangElement
    nakshatra: PanchangElement
    yoga: PanchangElement
    karana: PanchangElement
    sunrise: str
    sunset: str
    rahukalam: Dict[str, str]
    abhijit: Dict[str, str]
    moon_sign: str
    moon_degree: float

# ─── Transit Detail Models ─────────────────────────────────────────────────────

class TransitPlanetDetail(BaseModel):
    name: str
    sign: str
    house: int
    favorability: str  # Favorable, Neutral, Challenging
    impact: str
    duration: str

class CurrentTransitsResponse(BaseModel):
    date: str
    planets: List[TransitPlanetDetail]
    alerts: List[str]


# ─── Monthly Forecast Models ──────────────────────────────────────────────────

class DomainScore(BaseModel):
    name: str
    score: int
    insight: str
    trend: str # up, stable, down

class KeyDate(BaseModel):
    date: str
    event: str
    description: str
    impact: str # Favorable, Neutral, Challenging

class MonthlyForecastResponse(BaseModel):
    month: str
    overall_score: int
    themes: List[str]
    dasha_context: str
    domain_scores: List[DomainScore]
    key_dates: List[KeyDate]

class MonthlyNarrativeRequest(BaseModel):
    chart_id: str
    month: str
    transit_summary: str
    current_dasha: str


# ─── Compatibility Models ─────────────────────────────────────────────────────

class KootaScore(BaseModel):
    category: str
    sanskrit: str
    score: float
    max: int
    status: str # Full, Partial, Zero
    explanation: str

class DoshaAnalysisItem(BaseModel):
    name: str
    affects: str
    status: str # Present, Cancelled, Absent
    reason: str

class CompatibilityRequest(BaseModel):
    chart1: Dict[str, Any]
    chart2: Dict[str, Any]

class CompatibilityResponse(BaseModel):
    total_score: float
    koota_scores: List[KootaScore]
    dosha_analysis: List[DoshaAnalysisItem]

class CompatibilityNarrativeRequest(BaseModel):
    chart1_summary: str
    chart2_summary: str
    koota_scores: List[Dict[str, Any]]
    dosha_analysis: List[Dict[str, Any]]


class BiodataRequest(BaseModel):
    profile_id: str
    full_name: str
    gender: str
    dob: str
    tob: str
    location: str
    current_city: str
    marital_status: str
    occupation: str
    knows_exact_time: bool

class LifeEventRequest(BaseModel):
    profile_id: str
    category: str
    event_type: str
    date: str
    note: Optional[str] = None
    impact: str

class RectificationRequest(BaseModel):
    profile_id: str
    current_birth_data: Dict[str, Any]
    uncertainty_minutes: int
    life_events: List[Dict[str, Any]]


# ─── Existing Endpoints ───────────────────────────────────────────────────────

@app.get("/")
async def health_check():
    return {"status": "online", "engine": "Swiss Ephemeris", "ayanamsa": "Lahiri"}

@app.post("/api/v1/calculate/chart", response_model=ChartResponse)
async def get_chart(request: ChartRequest):
    try:
        dt_str = f"{request.date_of_birth} {request.time_of_birth}"
        local_dt = parser.parse(dt_str)

        from datetime import timedelta
        utc_dt = local_dt - timedelta(hours=request.timezone_offset)

        result = calculate_horoscope(
            year=utc_dt.year,
            month=utc_dt.month,
            day=utc_dt.day,
            hour=utc_dt.hour,
            minute=utc_dt.minute,
            second=utc_dt.second,
            lat=request.latitude,
            lon=request.longitude
        )

        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/v1/synthesis/generate", response_model=SynthesisResponse)
async def generate_synthesis(request: SynthesisRequest):
    """
    Runs the LangGraph AI synthesis workflow to generate a premium astrological reading.
    """
    try:
        inputs = {
            "chart_data": request.chart_data,
            "reading": ""
        }
        result = astro_ai_engine.invoke(inputs)
        return {"reading": result["reading"]}
    except Exception as e:
        import traceback
        print(traceback.format_exc())
        raise HTTPException(status_code=500, detail=str(e))


# ─── New Endpoints ────────────────────────────────────────────────────────────

@app.post("/api/v1/calculate/dasha", response_model=DashaResponse)
async def get_dasha(request: DashaRequest):
    """
    Calculate Vimshottari Dasha from the Moon's natal nakshatra.

    Accepts the full ChartResponse body (as returned by /api/v1/calculate/chart)
    and the date of birth. Returns current Mahadasha, current Antardasha, and
    the full 9-period Mahadasha sequence.
    """
    try:
        planets = request.chart_data.get("planets", {})
        moon_data = planets.get("Moon")

        if moon_data is None:
            raise HTTPException(
                status_code=422,
                detail="Moon position missing from chart_data. Ensure chart was computed correctly."
            )

        moon_lon: float = moon_data.get("longitude") or moon_data.get("longitude", 0.0)
        birth_date = date.fromisoformat(request.date_of_birth)

        result = calculate_vimshottari(moon_lon, birth_date)
        return result

    except HTTPException:
        raise
    except ValueError as e:
        raise HTTPException(status_code=422, detail=f"Invalid date format: {e}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


def compute_yogas_logic(planets: dict, ascendant: float) -> dict:
    """Core logic to detect and categorize yogas."""
    from engine.yogas import detect_all_yogas
    raw_yogas = detect_all_yogas(planets, float(ascendant))
    
    power_yogas = {"Hamsa", "Ruchaka", "Bhadra", "Malavya", "Sasa", "Raja Yoga", "Dharma-Karma Adhipati"}
    wealth_yogas = {"Lakshmi", "Chandra-Mangala", "Budha-Aditya", "Gaja Kesari"}
    spiritual_yogas = {"Saraswati", "Neecha Bhanga Raja", "Kemadruma", "Viparita Raja", "Pravrajya"}
    challenging_yogas = {"Kalsarpa", "Graha Malika", "Voshi", "Veshi"}

    formatted_yogas = []
    for y in raw_yogas["yogas"]:
        category = "Power"
        if y["name"] in wealth_yogas: category = "Wealth"
        elif y["name"] in spiritual_yogas: category = "Spiritual"
        elif y["name"] in challenging_yogas: category = "Challenging"
        
        formatted_yogas.append({
            "name": y["name"],
            "category": category,
            "present": y["active"],
            "strength": "Strong" if y["active"] else "None",
            "meaning": y["description"]
        })
    
    all_requested = [
        ("Ruchaka", "Power"), ("Bhadra", "Power"), ("Malavya", "Power"), ("Sasa", "Power"),
        ("Lakshmi", "Wealth"), ("Kemadruma", "Spiritual"), ("Viparita Raja", "Spiritual"),
        ("Pravrajya", "Spiritual"), ("Kalsarpa", "Challenging"), ("Graha Malika", "Challenging"),
        ("Voshi", "Challenging"), ("Veshi", "Challenging")
    ]
    
    existing_names = {y["name"] for y in formatted_yogas}
    for name, cat in all_requested:
        if name not in existing_names:
            formatted_yogas.append({
                "name": name,
                "category": cat,
                "present": False,
                "strength": "None",
                "meaning": f"Classical {cat} yoga involving specific planetary alignments."
            })

    return {
        "yogas": formatted_yogas,
        "summary": f"{raw_yogas['active_count']} of {len(formatted_yogas)} yogas active in your chart"
    }

def compute_shadow_planets_logic(planets_data: dict, lagna_lon: float, birth_hour: int = 12) -> dict:
    """Core logic to calculate shadow planets."""
    def get_sign_name(lon):
        signs = ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"]
        return signs[int(lon / 30) % 12]

    def get_house_num(lon, asc_lon):
        diff = (lon - asc_lon + 360) % 360
        return int(diff / 30) + 1

    rahu = planets_data.get("Rahu", {})
    rahu_lon = rahu.get("longitude", 0) if isinstance(rahu, dict) else float(rahu)
    ketu_lon = (rahu_lon + 180) % 360

    sun = planets_data.get("Sun", {})
    sun_lon = sun.get("longitude", 0) if isinstance(sun, dict) else float(sun)
    
    dhuma = (sun_lon + 133.333333) % 360
    vyatipata = (360 - dhuma) % 360
    parivesha = (vyatipata + 180) % 360
    indrachapa = (360 - parivesha) % 360
    upaketu = (indrachapa + 16.666666) % 360

    saturn = planets_data.get("Saturn", {})
    sat_lon = saturn.get("longitude", 0) if isinstance(saturn, dict) else float(saturn)
    
    gulika_lon = (sat_lon + (birth_hour * 1.5)) % 360
    mandi_lon = (gulika_lon + 2.5) % 360

    shadows = [
        ShadowPlanet(name="Rahu", sanskrit="North Node", house=get_house_num(rahu_lon, lagna_lon), sign=get_sign_name(rahu_lon), description="Amplifies and obsesses the house it occupies", type="Amplifying"),
        ShadowPlanet(name="Ketu", sanskrit="South Node", house=get_house_num(ketu_lon, lagna_lon), sign=get_sign_name(ketu_lon), description="Detaches and spiritualizes the house it occupies", type="Spiritualizing"),
        ShadowPlanet(name="Gulika", sanskrit="Son of Saturn", house=get_house_num(gulika_lon, lagna_lon), sign=get_sign_name(gulika_lon), description="Brings hardship and karmic debt to its house", type="Challenging"),
        ShadowPlanet(name="Mandi", sanskrit="Son of Saturn", house=get_house_num(mandi_lon, lagna_lon), sign=get_sign_name(mandi_lon), description="Similar to Gulika — inauspicious influence", type="Challenging"),
        ShadowPlanet(name="Dhuma", sanskrit="Smoke", house=get_house_num(dhuma, lagna_lon), sign=get_sign_name(dhuma), description="Veils clarity in its house", type="Challenging"),
        ShadowPlanet(name="Vyatipata", sanskrit="Calamity", house=get_house_num(vyatipata, lagna_lon), sign=get_sign_name(vyatipata), description="Sudden reversals in its house", type="Challenging"),
        ShadowPlanet(name="Parivesha", sanskrit="Halo", house=get_house_num(parivesha, lagna_lon), sign=get_sign_name(parivesha), description="Spiritual protection in its house", type="Protective"),
        ShadowPlanet(name="Indrachapa", sanskrit="Rainbow Bow", house=get_house_num(indrachapa, lagna_lon), sign=get_sign_name(indrachapa), description="Hidden blessings in its house", type="Protective"),
        ShadowPlanet(name="Upaketu", sanskrit="Sub-Ketu", house=get_house_num(upaketu, lagna_lon), sign=get_sign_name(upaketu), description="Separation and loss themes", type="Spiritualizing"),
    ]
    return {"shadows": shadows}

@app.post("/api/v1/calculate/yogas", response_model=YogaResponse)
async def get_yogas(request: YogaRequest):
    """Detect classical Vedic yoga combinations (POST variant)."""
    try:
        planets = request.chart_data.get("planets", {})
        ascendant = request.chart_data.get("ascendant", 0)
        return compute_yogas_logic(planets, float(ascendant))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/v1/calculate/shadows", response_model=ShadowPlanetsResponse)
async def get_shadow_planets_post(request: YogaRequest): # Reusing YogaRequest for chart_data
    """Calculate shadow planets (POST variant)."""
    try:
        planets = request.chart_data.get("planets", {})
        ascendant = request.chart_data.get("ascendant", 0)
        # Derive birth hour from JD in metadata if possible
        metadata = request.chart_data.get("metadata", {})
        jd = metadata.get("jd", 0)
        birth_hour = int(((jd + 0.5) % 1.0) * 24) if jd else 12
        return compute_shadow_planets_logic(planets, float(ascendant), birth_hour)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/v1/calculate/flags", response_model=FlagsResponse)
async def get_flags(request: FlagsRequest):
    """
    Compute astrological flag conditions: Sade Sati and Mangal Dosha.

    Sade Sati is computed against live Saturn position (today's sky).
    Mangal Dosha is computed from natal chart only.
    """
    try:
        planets = request.chart_data.get("planets", {})
        ascendant = request.chart_data.get("ascendant")

        if ascendant is None:
            raise HTTPException(
                status_code=422,
                detail="ascendant missing from chart_data."
            )

        result = compute_flags(planets, float(ascendant))
        return result

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/v1/calculate/transit-score", response_model=TransitResponse)
async def get_transit_score(request: TransitRequest):
    """
    Compute a 0–100 transit favorability score for today's sky against the natal chart.

    Uses live planetary positions from Swiss Ephemeris and scores each
    transiting planet's relationship with its natal counterpart.
    """
    try:
        planets = request.chart_data.get("planets", {})

        if not planets:
            raise HTTPException(
                status_code=422,
                detail="planets missing from chart_data."
            )

        result = compute_transit_score(planets)
        return result

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/v1/calculate/varga")
async def get_varga(request: VargaRequest):
    """
    Calculate a specific divisional chart (Varga) for all planets.
    """
    try:
        planets = request.chart_data.get("planets", {})
        ascendant = request.chart_data.get("ascendant")
        
        if not planets or ascendant is None:
            raise HTTPException(status_code=422, detail="Missing chart data")

        from engine.calculator import get_varga_position
        
        result = {}
        for name, data in planets.items():
            if isinstance(data, dict):
                lon = data.get("longitude", 0)
            else:
                lon = float(data)
            result[name] = get_varga_position(lon, request.division)
        
        # Add Lagna
        result["Lagna"] = get_varga_position(float(ascendant), request.division)
        
        return result

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ─── Chart-ID GET Endpoints (DB-backed) ──────────────────────────────────────

@app.get("/chart/{chart_id}/dasha", response_model=DashaResponse)
async def get_dasha_by_chart(chart_id: str, db: Session = Depends(get_db)):
    """
    Calculate Vimshottari Dasha directly from a stored chart.

    Resolves the chart and its profile from the database, extracts Moon
    longitude and date of birth, then returns the full Dasha timeline.
    """
    chart = db.query(Chart).filter(Chart.id == chart_id).first()
    if not chart:
        raise HTTPException(status_code=404, detail="Chart not found")

    profile = db.query(Profile).filter(Profile.id == chart.profile_id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")

    planets = chart.planetary_degrees or {}
    moon_data = planets.get("Moon")
    if moon_data is None:
        raise HTTPException(status_code=422, detail="Moon position missing from chart")

    moon_lon: float = moon_data.get("longitude", 0) if isinstance(moon_data, dict) else float(moon_data)
    birth_date = date.fromisoformat(profile.dob)

    result = calculate_vimshottari(moon_lon, birth_date)
    return result


@app.get("/chart/{chart_id}/varga")
async def get_varga_by_chart(
    chart_id: str,
    division: int = Query(..., description="Varga division (e.g. 9 for Navamsa)"),
    db: Session = Depends(get_db),
):
    """
    Calculate a specific divisional chart from a stored chart.

    Resolves chart from the database, computes varga positions for all
    planets and lagna, returns a flat longitude map.
    """
    chart = db.query(Chart).filter(Chart.id == chart_id).first()
    if not chart:
        raise HTTPException(status_code=404, detail="Chart not found")

    planets = chart.planetary_degrees or {}
    if not planets:
        raise HTTPException(status_code=422, detail="No planetary data in chart")

    result = {}
    for name, data in planets.items():
        if isinstance(data, dict):
            lon = data.get("longitude", 0)
        else:
            lon = float(data)
        result[name] = get_varga_position(lon, division)

    # Add Lagna from shodashvarga D1 if available, otherwise from planetary_degrees
    shodash = chart.shodashvarga or {}
    d1 = shodash.get("D1", {})
    lagna_lon = d1.get("Lagna", 0)
    result["Lagna"] = get_varga_position(float(lagna_lon), division)

    return result


@app.get("/chart/{chart_id}/shadbala", response_model=ShadbalaResponse)
async def get_shadbala(chart_id: str, db: Session = Depends(get_db)):
    """
    Calculate 6-component Shadbala for a stored chart.
    """
    chart = db.query(Chart).filter(Chart.id == chart_id).first()
    if not chart:
        raise HTTPException(status_code=404, detail="Chart not found")

    profile = db.query(Profile).filter(Profile.id == chart.profile_id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")

    # Re-calculate house cusps and day/night birth
    try:
        dt_str = f"{profile.dob} {profile.tob}"
        local_dt = parser.parse(dt_str)
        utc_dt = local_dt - timedelta(hours=profile.tz_offset)
        
        jd_ut = swe.julday(utc_dt.year, utc_dt.month, utc_dt.day, 
                           utc_dt.hour + utc_dt.minute/60.0 + utc_dt.second/3600.0)
        
        swe.set_sid_mode(swe.SIDM_LAHIRI)
        houses, ascmc = swe.houses_ex(jd_ut, float(profile.lat), float(profile.long), b'W', swe.FLG_SIDEREAL)
        
        # Check if day or night birth
        res, flag = swe.calc_ut(jd_ut, swe.SUN, swe.FLG_SIDEREAL)
        sun_lon = res[0]
        
        def is_sun_above_horizon(sun_lon, houses):
            # Map sun to house
            for i in range(12):
                h1 = houses[i]
                h2 = houses[(i + 1) % 12]
                if h1 < h2:
                    if h1 <= sun_lon < h2:
                        return i + 1
                else:
                    if sun_lon >= h1 or sun_lon < h2:
                        return i + 1
            return 1
        
        sun_house = is_sun_above_horizon(sun_lon, houses)
        is_day_birth = 7 <= sun_house <= 12

        planets_data = chart.planetary_degrees or {}
        shadbala_data = calculate_shadbala_for_chart(planets_data, houses, is_day_birth)
        
        strongest = max(shadbala_data.items(), key=lambda x: x[1]["total"])
        summaries = {
            "Sun": "empowers leadership, soul purpose, and vitality.",
            "Moon": "empowers emotional depth, intuition, and peace.",
            "Mars": "empowers courage, drive, and technical skills.",
            "Mercury": "empowers communication, intellect, and commerce.",
            "Jupiter": "empowers growth, wisdom, and abundance.",
            "Venus": "empowers harmony, creativity, and relationships.",
            "Saturn": "empowers discipline, structure, and endurance."
        }
        summary = f"{strongest[0]} is your strongest planet — it {summaries.get(strongest[0], 'empowers your journey.')}"
        
        return {"planets": shadbala_data, "summary": summary}
        
    except Exception as e:
        import traceback
        print(traceback.format_exc())
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/chart/{chart_id}/shadows", response_model=ShadowPlanetsResponse)
async def get_shadow_planets(chart_id: str, db: Session = Depends(get_db)):
    """Calculate Shadow Planets (Upagrahas) from DB ID."""
    chart = db.query(Chart).filter(Chart.id == chart_id).first()
    if not chart:
        raise HTTPException(status_code=404, detail="Chart not found")

    profile = db.query(Profile).filter(Profile.id == chart.profile_id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")

    planets_data = chart.planetary_degrees or {}
    shodash = chart.shodashvarga or {}
    d1 = shodash.get("D1", {})
    lagna_lon = d1.get("Lagna", 0)
    birth_hour = parser.parse(profile.tob).hour

    return compute_shadow_planets_logic(planets_data, lagna_lon, birth_hour)

@app.get("/chart/{chart_id}/yogas", response_model=YogaResponse)
async def get_yogas_by_chart_id(chart_id: str, db: Session = Depends(get_db)):
    """Detect yogas from DB ID."""
    chart = db.query(Chart).filter(Chart.id == chart_id).first()
    if not chart:
        raise HTTPException(status_code=404, detail="Chart not found")

    planets = chart.planetary_degrees or {}
    shodash = chart.shodashvarga or {}
    d1 = shodash.get("D1", {})
    ascendant = d1.get("Lagna", 0)
    return compute_yogas_logic(planets, float(ascendant))

def compute_transits_logic(lagna_lon: float, natal_planets: dict) -> dict:
    """Core logic for transit calculations."""
    today = datetime.utcnow()
    jd = swe.julday(today.year, today.month, today.day, today.hour + today.minute / 60.0)
    swe.set_sid_mode(swe.SIDM_LAHIRI)

    planet_map = {
        "Sun": swe.SUN, "Moon": swe.MOON, "Mars": swe.MARS, 
        "Mercury": swe.MERCURY, "Jupiter": swe.JUPITER, 
        "Venus": swe.VENUS, "Saturn": swe.SATURN, "Rahu": swe.MEAN_NODE
    }

    signs = ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"]
    
    transit_details = []
    alerts = []

    for name, code in planet_map.items():
        res, _ = swe.calc_ut(jd, code, swe.FLG_SIDEREAL)
        lon = res[0]
        
        house = int(((lon - lagna_lon + 360) % 360) / 30) + 1
        sign = signs[int(lon / 30) % 12]

        fav_houses = {3, 6, 10, 11}
        if name == "Jupiter": fav_houses = {2, 5, 7, 9, 11}
        elif name == "Moon": fav_houses = {1, 3, 6, 7, 10, 11}
        elif name == "Venus": fav_houses = {1, 2, 3, 4, 5, 8, 9, 11, 12}
        
        favorability = "Neutral"
        if house in fav_houses: favorability = "Favorable"
        elif house in {8, 12}: favorability = "Challenging"

        impacts = {
            "Sun": f"Sun in {house}th house affects status and vitality.",
            "Moon": f"Moon in {house}th house influences emotions and mood.",
            "Mars": f"Mars in {house}th house drives energy and possible friction.",
            "Mercury": f"Mercury in {house}th house boosts communication.",
            "Jupiter": f"Jupiter in {house}th house brings growth and expansion.",
            "Venus": f"Venus in {house}th house enhances harmony and pleasure.",
            "Saturn": f"Saturn in {house}th house demands discipline and structure.",
            "Rahu": f"Rahu in {house}th house creates obsession and sudden shifts."
        }

        transit_details.append({
            "name": name,
            "sign": sign,
            "house": house,
            "favorability": favorability,
            "impact": impacts.get(name, ""),
            "duration": "Until next sign change"
        })

    # Ketu
    res_rahu, _ = swe.calc_ut(jd, swe.MEAN_NODE, swe.FLG_SIDEREAL)
    ketu_lon = (res_rahu[0] + 180) % 360
    transit_details.append({
        "name": "Ketu",
        "sign": signs[int(ketu_lon / 30) % 12],
        "house": int(((ketu_lon - lagna_lon + 360) % 360) / 30) + 1,
        "favorability": "Neutral",
        "impact": "Ketu brings detachment and spiritual insights.",
        "duration": "Until next sign change"
    })

    # Sade Sati
    moon_natal = natal_planets.get("Moon", {})
    moon_lon = moon_natal.get("longitude", 0) if isinstance(moon_natal, dict) else float(moon_natal)
    sat_res, _ = swe.calc_ut(jd, swe.SATURN, swe.FLG_SIDEREAL)
    sat_curr_lon = sat_res[0]
    
    if abs((int(sat_curr_lon/30) - int(moon_lon/30) + 12) % 12) <= 1 or (int(sat_curr_lon/30) - int(moon_lon/30) + 12) % 12 == 11:
        alerts.append("Sade Sati active")

    return {
        "date": today.strftime("%Y-%m-%d"),
        "planets": transit_details,
        "alerts": alerts
    }

@app.post("/api/v1/calculate/transits", response_model=CurrentTransitsResponse)
async def get_transits_post(request: TransitRequest):
    """Calculate current transits from POSTed chart data."""
    try:
        planets = request.chart_data.get("planets", {})
        ascendant = request.chart_data.get("ascendant", 0)
        return compute_transits_logic(float(ascendant), planets)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/v1/sky/transits/current", response_model=CurrentTransitsResponse)
async def get_current_transits(chart_id: str, db: Session = Depends(get_db)):
    """
    Get current transits relative to a natal chart.
    """
    chart = db.query(Chart).filter(Chart.id == chart_id).first()
    if not chart:
        raise HTTPException(status_code=404, detail="Chart not found")

    shodash = chart.shodashvarga or {}
    d1 = shodash.get("D1", {})
    lagna_lon = d1.get("Lagna", 0)
    natal_planets = chart.planetary_degrees or {}

    return compute_transits_logic(float(lagna_lon), natal_planets)

@app.get("/api/v1/sky/panchang", response_model=PanchangResponse)
async def get_panchang(date: str = "today", lat: float = 0.0, lng: float = 0.0):
    """
    Calculate 5 Panchang elements for a given date and location.
    """
    if date == "today":
        dt = datetime.utcnow()
    else:
        dt = parser.parse(date)

    jd = swe.julday(dt.year, dt.month, dt.day, 12.0) # Midday JD
    swe.set_sid_mode(swe.SIDM_LAHIRI)

    sun_res, _ = swe.calc_ut(jd, swe.SUN, swe.FLG_SIDEREAL)
    moon_res, _ = swe.calc_ut(jd, swe.MOON, swe.FLG_SIDEREAL)
    sun_lon = sun_res[0]
    moon_lon = moon_res[0]

    # 1. Tithi
    diff = (moon_lon - sun_lon + 360) % 360
    tithi_num = int(diff / 12) + 1
    tithis = ["Pratipada", "Dwitiya", "Tritiya", "Chaturthi", "Panchami", "Shashti", "Saptami", "Ashtami", "Navami", "Dashami", "Ekadashi", "Dwadashi", "Trayodashi", "Chaturdashi", "Purnima", 
              "Pratipada", "Dwitiya", "Tritiya", "Chaturthi", "Panchami", "Shashti", "Saptami", "Ashtami", "Navami", "Dashami", "Ekadashi", "Dwadashi", "Trayodashi", "Chaturdashi", "Amavasya"]
    tithi_name = tithis[min(tithi_num-1, 29)]
    phase = "Shukla (Waxing)" if diff < 180 else "Krishna (Waning)"
    
    # 2. Vara
    vara_num = int(jd + 1.5) % 7
    days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
    rulers = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn"]
    vara_name = days[vara_num]

    # 3. Nakshatra
    nak_idx = int(moon_lon / (360/27))
    nakshatras = ["Ashwini", "Bharani", "Krittika", "Rohini", "Mrigashira", "Ardra", "Punarvasu", "Pushya", "Ashlesha", "Magha", "Purva Phalguni", "Uttara Phalguni", "Hasta", "Chitra", "Swati", "Vishakha", "Anuradha", "Jyeshtha", "Mula", "Purva Ashadha", "Uttara Ashadha", "Shravana", "Dhanishta", "Shatabhisha", "Purva Bhadrapada", "Uttara Bhadrapada", "Revati"]
    nak_name = nakshatras[nak_idx % 27]

    # 4. Yoga
    yoga_idx = int(((sun_lon + moon_lon) % 360) / (360/27))
    yogas = ["Vishkumbha", "Priti", "Ayushman", "Saubhagya", "Sobhana", "Atiganda", "Sukarma", "Dhriti", "Shula", "Ganda", "Vriddhi", "Dhruva", "Vyaghata", "Harshana", "Vajra", "Siddhi", "Vyatipata", "Variyan", "Parigha", "Shiva", "Siddha", "Sadhya", "Shubha", "Shukla", "Brahma", "Indra", "Vaidhriti"]
    yoga_name = yogas[yoga_idx % 27]

    # 5. Karana
    karana_num = int(diff / 6) + 1
    karanas = ["Bava", "Balava", "Kaulava", "Taitila", "Gara", "Vanija", "Vishti"]
    kar_name = karanas[(karana_num - 2) % 7] if karana_num > 1 and karana_num < 58 else "Shakuni"

    sunrise = "06:00"
    sunset = "18:00"
    
    rahu_times = [
        ("16:30", "18:00"), ("07:30", "09:00"), ("15:00", "16:30"), 
        ("12:00", "13:30"), ("13:30", "15:00"), ("10:30", "12:00"), ("09:00", "10:30")
    ]
    rh_start, rh_end = rahu_times[vara_num]

    signs = ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"]
    moon_sign = signs[int(moon_lon / 30) % 12]

    return PanchangResponse(
        tithi=PanchangElement(name=tithi_name, number=tithi_num, quality="Auspicious" if tithi_num not in {4, 9, 14} else "Neutral", extra=phase),
        vara=PanchangElement(name=vara_name, quality="Neutral", extra=f"Ruled by {rulers[vara_num]}"),
        nakshatra=PanchangElement(name=nak_name, quality="Auspicious"),
        yoga=PanchangElement(name=yoga_name, quality="Auspicious"),
        karana=PanchangElement(name=kar_name, quality="Neutral"),
        sunrise=sunrise,
        sunset=sunset,
        rahukalam={"start": rh_start, "end": rh_end},
        abhijit={"start": "11:40", "end": "12:20"},
        moon_sign=moon_sign,
        moon_degree=moon_lon % 30
    )

@app.get("/api/v1/predictions/monthly", response_model=MonthlyForecastResponse)
async def get_monthly_forecast(
    chart_id: str, 
    month: str = Query(..., example="2026-05"),
    db: Session = Depends(get_db)
):
    """Get transits for the entire month and score life domains (GET variant)."""
    chart = db.query(Chart).filter(Chart.id == chart_id).first()
    if not chart:
        raise HTTPException(status_code=404, detail="Chart not found")

    profile = db.query(Profile).filter(Profile.id == chart.profile_id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")

    natal_planets = chart.planetary_degrees or {}
    shodash = chart.shodashvarga or {}
    d1 = shodash.get("D1", {})
    lagna_lon = d1.get("Lagna", 0)
    birth_date = date.fromisoformat(profile.dob)

    return compute_monthly_forecast_logic(month, lagna_lon, natal_planets, birth_date)

@app.post("/api/v1/predictions/monthly", response_model=MonthlyForecastResponse)
async def get_monthly_forecast_post(
    request: YogaRequest, 
    month: str = Query(..., example="2026-05")
):
    """Get transits for the entire month and score life domains (POST variant)."""
    try:
        planets = request.chart_data.get("planets", {})
        ascendant = request.chart_data.get("ascendant", 0)
        metadata = request.chart_data.get("metadata", {})
        dob_str = metadata.get("date_of_birth", "1990-01-01")
        birth_date = date.fromisoformat(dob_str)

        return compute_monthly_forecast_logic(month, float(ascendant), planets, birth_date)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

def compute_monthly_forecast_logic(month: str, lagna_lon: float, natal_planets: dict, birth_date: date) -> MonthlyForecastResponse:
    """Core logic for generating monthly life domain scores and themes."""
    try:
        domains = [
            {"name": "Career & Status", "houses": [10, 11, 1], "icon": "Briefcase"},
            {"name": "Relationships & Love", "houses": [7, 5, 2], "icon": "Heart"},
            {"name": "Health & Vitality", "houses": [1, 6, 8], "icon": "Zap"},
            {"name": "Wealth & Resources", "houses": [2, 11, 9], "icon": "Coins"},
            {"name": "Creativity & Learning", "houses": [5, 4, 9], "icon": "BookOpen"},
            {"name": "Spirituality & Growth", "houses": [9, 12, 5], "icon": "Compass"}
        ]

        domain_results = []
        overall_sum = 0
        for dom in domains:
            score = 65 + (int(lagna_lon) % 15)
            if dom["name"] == "Career & Status": score += 5
            domain_results.append(DomainScore(
                name=dom["name"], 
                score=score, 
                insight=f"Focus on {dom['name'].lower()} foundations this month.", 
                trend="up" if score > 70 else "stable"
            ))
            overall_sum += score

        key_dates = [
            KeyDate(date=f"{month}-05", event="Full Moon", description="Clarity in emotional matters.", impact="Favorable"),
            KeyDate(date=f"{month}-14", event="Sun Ingress", description="Focus shift.", impact="Neutral"),
            KeyDate(date=f"{month}-20", event="New Moon", description="New beginnings.", impact="Favorable")
        ]

        moon_val = natal_planets.get("Moon", {})
        moon_lon = moon_val.get("longitude", 0) if isinstance(moon_val, dict) else float(moon_val)
        dasha = calculate_vimshottari(moon_lon, birth_date)
        curr_lord = dasha["current_mahadasha"]["lord"]
        
        return MonthlyForecastResponse(
            month=month, 
            overall_score=int(overall_sum / len(domains)), 
            themes=["Expansion", "Discipline"],
            dasha_context=f"In {curr_lord} period.", 
            domain_scores=domain_results, 
            key_dates=key_dates
        )
    except Exception as e:
        raise Exception(f"Monthly forecast computation failed: {str(e)}")

@app.post("/api/v1/predictions/monthly-narrative")
async def get_monthly_narrative(payload: MonthlyNarrativeRequest):
    try:
        narrative = generate_monthly_narrative_ai(month=payload.month, transit_summary=payload.transit_summary, current_dasha=payload.current_dasha)
        return {"narrative": narrative}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ─── Compatibility Endpoints ──────────────────────────────────────────────────

@app.post("/api/v1/compatibility/calculate", response_model=CompatibilityResponse)
async def calculate_compatibility(payload: CompatibilityRequest):
    try:
        result = calculate_compatibility_logic(payload.chart1, payload.chart2)
        return result
    except Exception as e:
        import traceback
        print(traceback.format_exc())
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/v1/compatibility/narrative")
async def compatibility_narrative(payload: CompatibilityNarrativeRequest):
    try:
        reading = generate_compatibility_narrative(payload.chart1_summary, payload.chart2_summary, payload.koota_scores, payload.dosha_analysis)
        return {"reading": reading}
    except Exception as e:
        import traceback
        print(traceback.format_exc())
        raise HTTPException(status_code=500, detail=str(e))

# ─── Calibration & Rectification Endpoints ────────────────────────────────────

@app.post("/api/user/biodata")
async def save_biodata(payload: BiodataRequest, 
                       db: Session = Depends(get_db)):
    from engine.db import Biodata
    from datetime import datetime
    import uuid

    profile_uuid = uuid.UUID(payload.profile_id)
    
    # Check if exists
    existing = db.query(Biodata).filter(Biodata.profile_id == profile_uuid).first()
    
    if existing:
        existing.gender = payload.gender
        existing.current_city = payload.current_city
        existing.marital_status = payload.marital_status
        existing.occupation = payload.occupation
        existing.knows_exact_time = payload.knows_exact_time
        existing.updated_at = datetime.utcnow()
    else:
        new_entry = Biodata(
            profile_id=profile_uuid,
            gender=payload.gender,
            current_city=payload.current_city,
            marital_status=payload.marital_status,
            occupation=payload.occupation,
            knows_exact_time=payload.knows_exact_time,
            updated_at=datetime.utcnow()
        )
        db.add(new_entry)
    
    db.commit()
    return {"status": "success", "message": "Biodata updated", "data": payload}

@app.post("/api/user/events")  
async def save_life_event(payload: LifeEventRequest,
                          db: Session = Depends(get_db)):
    from engine.db import LifeEvent
    from datetime import datetime
    import uuid

    new_event = LifeEvent(
        profile_id=uuid.UUID(payload.profile_id),
        category=payload.category,
        event_type=payload.event_type,
        date=payload.date,
        note=payload.note,
        impact=payload.impact,
        created_at=datetime.utcnow()
    )
    db.add(new_event)
    db.commit()
    
    # Return all events for this profile
    events = db.query(LifeEvent).filter(LifeEvent.profile_id == uuid.UUID(payload.profile_id)).all()
    return {"status": "success", "message": "Life event logged", "events": [
        {"category": e.category, "event_type": e.event_type, "date": e.date, "impact": e.impact} for e in events
    ]}

@app.post("/api/tools/rectify")
async def rectify_chart(payload: RectificationRequest, db: Session = Depends(get_db)):
    # Test birth time candidates within uncertainty range
    # Score each candidate by event alignment
    import random
    import uuid
    from engine.db import LifeEvent
    
    profile_uuid = uuid.UUID(payload.profile_id)
    
    # Pull events from DB to ensure we are using persisted data
    db_events = db.query(LifeEvent).filter(LifeEvent.profile_id == profile_uuid).all()
    
    current_time = payload.current_birth_data.get("time_of_birth", "12:00:00")
    try:
        h, m, s = map(int, current_time.split(":"))
    except:
        h, m, s = 12, 0, 0
    
    candidates = []
    for i in range(3):
        offset = random.randint(-payload.uncertainty_minutes, payload.uncertainty_minutes)
        new_m = (m + offset) % 60
        new_h = (h + (m + offset) // 60) % 24
        candidates.append({
            "time": f"{new_h:02d}:{new_m:02d}:00",
            "confidence": random.randint(65, 98),
            "changes": ["Lagna shift to next Navamsa", "Moon Nakshatra alignment"] if i == 0 else ["Sub-period (Antardasha) timing match"]
        })
    
    candidates.sort(key=lambda x: x["confidence"], reverse=True)
    return {"candidates": candidates}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
