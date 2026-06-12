"""
cnlunar Bazi Microservice
=========================
Wraps the cnlunar library (Hong Kong Observatory solar term data)
as a FastAPI HTTP service. Called by the Next.js backend.

cnlunar uses HK Observatory observed data for solar terms,
avoiding the 22-correction-value defect of the Shouxing empirical formula.

Endpoint:
  POST /calculate — full Bazi (八字) calculation
  GET  /health    — health check

Deploy to Railway / Fly.io free tier (~$0/month).
"""

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from datetime import datetime
from typing import Optional
import cnlunar


app = FastAPI(
    title="Bazi Calculator",
    version="1.0.0",
    description="Hong Kong Observatory-based Bazi (八字) calculation service"
)


class BirthInfo(BaseModel):
    """Birth information for Bazi calculation.

    - birth_date: ISO format date string "1998-05-15"
    - birth_time: 24-hour time string "14:30"
    - latitude: decimal degrees (e.g. 51.5074 for London)
    - longitude: decimal degrees (e.g. -0.1278 for London)
    """
    birth_date: str
    birth_time: str
    latitude: float
    longitude: float


class BaziResponse(BaseModel):
    """Complete Bazi calculation result.

    - year_pillar: 年柱, e.g. "戊寅"
    - month_pillar: 月柱, e.g. "丁巳"
    - day_pillar: 日柱, e.g. "壬戌"
    - hour_pillar: 时柱, e.g. "丁未"
    - day_master: 日主天干, e.g. "壬"
    - day_master_element: 日主五行, e.g. "水"
    - five_elements: count of each element in the chart
    - missing_elements: elements with count 0
    """
    year_pillar: str
    month_pillar: str
    day_pillar: str
    hour_pillar: str
    day_master: str
    day_master_element: str
    five_elements: dict
    missing_elements: list[str]


@app.post("/calculate", response_model=BaziResponse)
def calculate_bazi(info: BirthInfo):
    """Calculate a full Bazi (Four Pillars / 八字) chart.

    Uses cnlunar's Lunar calendar conversion and stem-branch computation.
    All pillar boundaries respect observed solar term times from
    the Hong Kong Observatory, not the empirical Shouxing formula.
    """
    try:
        # Parse birth datetime
        dt = datetime.strptime(
            f"{info.birth_date} {info.birth_time}",
            "%Y-%m-%d %H:%M"
        )

        # cnlunar Lunar object — handles solar term boundaries automatically
        lunar = cnlunar.Lunar(dt)

        # Get the Eight Characters (八字) — returns tuple of 4 pillars
        bazi = lunar.getEightChar()

        return BaziResponse(
            year_pillar=bazi[0],
            month_pillar=bazi[1],
            day_pillar=bazi[2],
            hour_pillar=bazi[3],
            day_master=bazi[2][0],  # First char of day pillar is the day master
            day_master_element=lunar.getDayMasterElement(),
            five_elements=lunar.getFiveElementCount(),
            missing_elements=lunar.getMissingElements(),
        )
    except ValueError as e:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid date/time format. Use YYYY-MM-DD and HH:MM. Error: {str(e)}"
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Bazi calculation failed: {str(e)}"
        )


@app.get("/health")
def health():
    """Health check endpoint for Railway/Fly.io monitoring."""
    return {"status": "ok", "service": "cnlunar-bazi", "version": "1.0.0"}


# For local development:
#   cd services/cnlunar
#   pip install -r requirements.txt
#   uvicorn main:app --host 0.0.0.0 --port 8000 --reload
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
