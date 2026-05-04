from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional, Dict, Any
from engine.calculator import calculate_horoscope
from engine.ai_synthesis import astro_ai_engine
from dateutil import parser

app = FastAPI(title="Kosmiq Astro Engine")

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

@app.get("/")
async def health_check():
    return {"status": "online", "engine": "Swiss Ephemeris", "ayanamsa": "Lahiri"}

@app.post("/api/v1/calculate/chart", response_model=ChartResponse)
async def get_chart(request: ChartRequest):
    try:
        # Combine date and time
        dt_str = f"{request.date_of_birth} {request.time_of_birth}"
        local_dt = parser.parse(dt_str)
        
        # Convert to UTC by subtracting the offset
        # UTC = Local - Offset
        # e.g., 12:00 IST (UTC+5.5) -> 12:00 - 5.5 = 06:30 UTC
        # We handle potential day wraps by using the combined datetime
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
        # Prepare inputs for LangGraph
        inputs = {
            "chart_data": request.chart_data,
            "reading": ""
        }
        
        # Execute the workflow
        result = astro_ai_engine.invoke(inputs)
        
        return {"reading": result["reading"]}
    except Exception as e:
        import traceback
        print(traceback.format_exc())
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
