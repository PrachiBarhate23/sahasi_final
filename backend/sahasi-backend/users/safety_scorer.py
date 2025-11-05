# users/safety_scorer.py
"""
Simplified safety scorer for Sahasi (women's safety).
Rule: if NONE of the key public POIs are nearby -> DANGEROUS.
      otherwise -> SAFE.

Provides SafetyScorer.process(entry) -> numeric score (0-100).
"""

import datetime
import requests
from functools import lru_cache

OVERPASS_URL = "https://overpass-api.de/api/interpreter"

# scoring constants
SAFE_SCORE = 90
DANGEROUS_SCORE = 10
DEFAULT_RADIUS = 600  # meters
CACHE_MAXSIZE = 512

# list of OSM tags we consider safety-providing
POI_TAG_QUERIES = [
    'node["amenity"="police"]',
    'node["amenity"="hospital"]',
    'node["amenity"="clinic"]',
    'node["amenity"="shelter"]',
    'node["amenity"="atm"]',
    'node["amenity"="bank"]',
    'node["amenity"~"restaurant|cafe|fast_food|bar|pub"]',
    'node["tourism"="hotel"]',
    'node["tourism"="hostel"]'
]


def build_overpass_query(lat, lon, radius=DEFAULT_RADIUS):
    """Build Overpass QL query that searches for any of the POI types around (lat,lon)."""
    parts = []
    for q in POI_TAG_QUERIES:
        # around:{radius},{lat},{lon}
        parts.append(f'{q}(around:{radius},{lat},{lon});')
    query = "[out:json][timeout:15];(" + "".join(parts) + ");out 1;"
    return query

@lru_cache(maxsize=CACHE_MAXSIZE)
def any_poi_nearby_cached(lat_rounded, lon_rounded, radius):
    """
    Cached wrapper that actually queries Overpass.
    We pass rounded lat/lon to cache repeated nearby checks (reduce API load).
    """
    lat = float(lat_rounded)
    lon = float(lon_rounded)
    query = build_overpass_query(lat, lon, radius)
    try:
        resp = requests.post(OVERPASS_URL, data={"data": query}, timeout=15)
        resp.raise_for_status()
        data = resp.json()
        elements = data.get("elements", [])
        return len(elements) > 0
    except Exception:
        # On any Overpass failure assume "unknown" -> treat as SAFE (conservative) or
        # you can change to treat as DANGEROUS if you prefer. We'll treat as SAFE to avoid false alarms.
        return True

def any_poi_nearby(lat, lon, radius=DEFAULT_RADIUS):
    """
    Rounds coordinates to 3 decimal places (~100m) for caching, then checks cache/query.
    Returns True if any POI found, False otherwise.
    """
    # round to reduce overpass hits for very close coords
    lat_r = round(float(lat), 3)
    lon_r = round(float(lon), 3)
    return any_poi_nearby_cached(lat_r, lon_r, radius)

class SafetyScorer:
    """
    Simple scorer:
      - If no POIs from list nearby -> return DANGEROUS_SCORE (10)
      - If any POI nearby -> return SAFE_SCORE (90)
    Maintains very small state to allow potential smoothing later.
    """

    def __init__(self):
        self.prev_score = SAFE_SCORE
        self.prev_entry = None

    def process(self, entry):
        """
        entry: dict with keys:
            - lat or 'lat'
            - lon or 'lon'
            - time (isoformat string or datetime) optional
        returns: integer score 0-100
        """
        # normalize inputs
        lat = entry.get("lat") if entry.get("lat") is not None else entry.get("latitude")
        lon = entry.get("lon") if entry.get("lon") is not None else entry.get("longitude")
        if lat is None or lon is None:
            # missing coords -> return previous or medium
            return self.prev_score

        # optional time parsing (not used in strict rule, but kept)
        t = entry.get("time")
        if isinstance(t, str):
            try:
                t = datetime.datetime.fromisoformat(t)
            except Exception:
                t = None

        # Check POIs nearby
        try:
            has_poi = any_poi_nearby(lat, lon, DEFAULT_RADIUS)
        except Exception:
            # if anything unexpected happens, default to safe to avoid false alarms
            has_poi = True

        # If there are absolutely NO POIs of the listed categories -> mark DANGEROUS
        if not has_poi:
            score = DANGEROUS_SCORE
        else:
            score = SAFE_SCORE

        # Optional smoothing: do a tiny interpolation with previous to avoid instant flips
        smoothed = int(round((0.8 * score) + (0.2 * self.prev_score)))
        self.prev_score = smoothed
        self.prev_entry = {"lat": lat, "lon": lon, "time": t}
        return smoothed
