from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from datetime import datetime
from engine.calculator import calculate_horoscope
from typing import Optional

app = FastAPI(title="Kosmiq Astro Engine")

class BirthDetails(BaseModel):
    year: int
    month: int
    day: int
    hour: int
    minute: int
    second: int = 0
    latitude: float
    longitude: float
    altitude: Optional[float] = 0

@app.get("/")
async def health_check():
    return {"status": "online", "engine": "Swiss Ephemeris", "ayanamsa": "Lahiri"}

@app.post("/calculate")
async def get_horoscope(details: BirthDetails):
    try:
        data = calculate_horoscope(
            details.year, details.month, details.day,
            details.hour, details.minute, details.second,
            details.latitude, details.longitude, details.altitude
        )
        return data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
