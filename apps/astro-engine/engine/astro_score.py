from typing import Dict, Any, List

def calculate_astro_score(
    shadbala_data: Dict[str, Any], 
    transit_data: Dict[str, Any]
) -> int:
    """
    Aggregates natal strength (Shadbala) and current transits (Gochar) 
    into a single weighted score (0-100).
    """
    # 1. Extract weights from Shadbala (normalized to 1.0 sum)
    total_shad = sum(data["total"] for data in shadbala_data.values())
    if total_shad == 0: return 50
    
    # 2. Planet Weights based on Natal Strength
    weights = {p: data["total"] / total_shad for p, data in shadbala_data.items()}
    
    # 3. Transit Favorability (Expected 0-100 from compute_transit_score)
    # If transit_data contains a global score, we use that as a baseline.
    # But ideally we'd have per-planet transit favorability.
    
    base_transit_score = transit_data.get("score", 50)
    
    # Simple weighted aggregation
    # High Shadbala planets that are transiting favorably boost the score more.
    final_score = base_transit_score # Placeholder for more complex logic
    
    return int(max(0, min(100, final_score)))
