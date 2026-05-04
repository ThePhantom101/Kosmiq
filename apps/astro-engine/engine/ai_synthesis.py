from typing import TypedDict, Dict, Any
from langgraph.graph import StateGraph, END
from google import genai
import os
from dotenv import load_dotenv

load_dotenv()

class GraphState(TypedDict):
    chart_data: Dict[str, Any]
    reading: str

def format_prompt(chart_data: Dict[str, Any]) -> str:
    # Extract key astrological info
    planets = chart_data.get("planets", {})
    vargas = chart_data.get("shodashvarga", {})
    ascendant = chart_data.get("ascendant", 0)
    
    # Simple logic to determine sign from longitude
    signs = ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", 
             "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"]
    
    def get_sign(lon):
        return signs[int(lon / 30)]

    lagna_sign = get_sign(ascendant)
    moon_info = planets.get("Moon", {})
    moon_sign = get_sign(moon_info.get("longitude", 0)) if isinstance(moon_info, dict) else "Unknown"
    
    # Construct details for each planet
    planet_details = []
    for name, data in planets.items():
        if isinstance(data, dict):
            lon = data.get("longitude", 0)
            sign = get_sign(lon)
            is_retro = " (Retrograde)" if data.get("is_retrograde") else ""
            planet_details.append(f"- {name}: {sign}{is_retro} at {lon % 30:.2f}°")
        else:
            planet_details.append(f"- {name}: Unknown")

    details_str = "\n".join(planet_details)
    
    # D9 and D10 highlights
    d9 = vargas.get("D9", {})
    d10 = vargas.get("D10", {})
    
    d9_details = [f"{p}: {get_sign(l)}" for p, l in d9.items() if isinstance(l, (int, float))]
    d10_details = [f"{p}: {get_sign(l)}" for p, l in d10.items() if isinstance(l, (int, float))]

    prompt = f"""
    You are the 'Kosmiq Oracle', an Elite Vedic Astrologer with profound knowledge of the Shastras, Tantra, and modern psychological archetypes. 
    Your mission is to provide a God-Tier astrological synthesis based on the provided chart data.
    
    SYSTEM DIRECTIVE: 
    Act as a high-end spiritual advisor. Your tone is authoritative, mystical, and profoundly insightful. 
    Avoid generic horoscope clichés. Use evocative, premium copywriting. 
    Focus on the "Why" behind the "What"—reveal the karmic blueprint.

    BIRTH CHART DATA (D1 - Rashi):
    - Lagna (Ascendant): {lagna_sign}
    - Moon Sign: {moon_sign}
    - Planetary Positions:
    {details_str}
    
    DIVISIONAL INSIGHTS:
    - Navamsha (D9 - Soul's Path): {", ".join(d9_details[:5])}...
    - Dashamsha (D10 - Career/Karma): {", ".join(d10_details[:5])}...

    INSTRUCTIONS:
    1. THE ESSENCE: Craft a powerful, poetic opening statement that captures the soul's primary frequency.
    2. ARCHITECTURE OF SELF: Analyze the interplay between the Lagna ({lagna_sign}) and the Moon ({moon_sign}). How does the outer personality mask or reveal the inner emotional waters?
    3. CELESTIAL ALIGNMENTS: Identify the 2-3 most dominant planetary placements. Don't just list them; weave a narrative of their impact on the individual's destiny.
    4. THE KOSMIQ PATH: Conclude with a high-impact synthesis of their spiritual trajectory and core life purpose.
    
    Deliver this as a premium, structured reading. Use bolding and elegant spacing.
    """
    return prompt

def gemini_node(state: GraphState):
    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key:
        return {"reading": "Error: GEMINI_API_KEY not found in environment."}
    
    client = genai.Client(api_key=api_key)
    prompt = format_prompt(state["chart_data"])
    
    try:
        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt
        )
        return {"reading": response.text}
    except Exception as e:
        return {"reading": f"Error during AI synthesis: {str(e)}"}

def create_workflow():
    workflow = StateGraph(GraphState)
    
    workflow.add_node("generate_reading", gemini_node)
    workflow.set_entry_point("generate_reading")
    workflow.add_edge("generate_reading", END)
    
    return workflow.compile()

# Global engine instance
astro_ai_engine = create_workflow()
