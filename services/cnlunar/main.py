"""
cnlunar Bazi Microservice (v2 — cnlunar 0.2.x compatible)
===========================================================
Wraps the cnlunar library as a FastAPI HTTP service.
cnlunar uses HK Observatory observed solar term data,
avoiding the 22-correction-value defect of the Shouxing empirical formula.

Endpoint:
  POST /calculate — full Bazi (八字) calculation
  GET  /health    — health check
"""

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from datetime import datetime
import cnlunar


app = FastAPI(
    title="Bazi Calculator",
    version="2.0.0",
    description="HK Observatory-based Bazi calculation service"
)

# ── 天干五行映射 ──
STEM_ELEMENT: dict[str, str] = {
    "甲": "木", "乙": "木",
    "丙": "火", "丁": "火",
    "戊": "土", "己": "土",
    "庚": "金", "辛": "金",
    "壬": "水", "癸": "水",
}

# ── 地支五行映射 ──
BRANCH_ELEMENT: dict[str, str] = {
    "寅": "木", "卯": "木",
    "巳": "火", "午": "火",
    "辰": "土", "戌": "土", "丑": "土", "未": "土",
    "申": "金", "酉": "金",
    "亥": "水", "子": "水",
}

# ── 五行名称 ──
FIVE_ELEMENTS = ["金", "木", "水", "火", "土"]

ELEMENT_NAMES: dict[str, str] = {
    "金": "Metal", "木": "Wood", "水": "Water", "火": "Fire", "土": "Earth",
}


class BirthInfo(BaseModel):
    birth_date: str  # "1995-06-15"
    birth_time: str  # "14:30"
    latitude: float  # 39.9042
    longitude: float  # 116.4074


class BaziResponse(BaseModel):
    year_pillar: str
    month_pillar: str
    day_pillar: str
    hour_pillar: str
    day_master: str
    day_master_element: str
    five_elements: dict  # {"金": 1, "木": 2, ...}
    missing_elements: list[str]


def _count_elements(pillars: list[str]) -> dict[str, int]:
    """Count Five Elements across all four pillars."""
    counts: dict[str, int] = {el: 0 for el in FIVE_ELEMENTS}
    for pillar in pillars:
        if len(pillar) >= 2:
            stem = pillar[0]
            branch = pillar[1]
            if stem in STEM_ELEMENT:
                counts[STEM_ELEMENT[stem]] += 1
            if branch in BRANCH_ELEMENT:
                counts[BRANCH_ELEMENT[branch]] += 1
    return counts


def _get_missing(counts: dict[str, int]) -> list[str]:
    """Elements with count == 0."""
    return [el for el in FIVE_ELEMENTS if counts.get(el, 0) == 0]


@app.post("/calculate", response_model=BaziResponse)
def calculate_bazi(info: BirthInfo):
    """Calculate a full Bazi chart from birth date/time/location."""
    try:
        dt = datetime.strptime(
            f"{info.birth_date} {info.birth_time}", "%Y-%m-%d %H:%M"
        )
        lunar = cnlunar.Lunar(dt)

        # ── Four Pillars (cnlunar 0.2.x API) ──
        year_pillar = lunar.get_year8Char()
        month_pillar = lunar.get_month8Char()
        day_pillar = lunar.get_day8Char()
        hour_pillar = lunar.get_twohour8Char()

        pillars = [year_pillar, month_pillar, day_pillar, hour_pillar]

        # ── Day Master (日柱天干) ──
        day_master = day_pillar[0] if day_pillar else ""
        day_master_element = STEM_ELEMENT.get(day_master, "未知")

        # ── Five Elements ──
        five_elements = _count_elements(pillars)
        missing_elements = _get_missing(five_elements)

        return BaziResponse(
            year_pillar=year_pillar,
            month_pillar=month_pillar,
            day_pillar=day_pillar,
            hour_pillar=hour_pillar,
            day_master=day_master,
            day_master_element=day_master_element,
            five_elements={
                ELEMENT_NAMES.get(k, k): v for k, v in five_elements.items()
            },
            missing_elements=[
                ELEMENT_NAMES.get(e, e) for e in missing_elements
            ],
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=f"Invalid input: {e}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Bazi failed: {e}")


@app.get("/health")
def health():
    return {"status": "ok", "service": "cnlunar-bazi", "version": "2.0.0"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
