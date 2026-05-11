from typing import TypedDict, Dict, Any, List
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

def format_monthly_narrative_prompt(month: str, transit_summary: str, current_dasha: str) -> str:
    prompt = f"""
    You are the 'Kosmiq Oracle', an Elite Vedic Astrologer. 
    Generate a personalized monthly forecast for the month of {month}.
    
    CONTEXT:
    - Current Dasha Period: {current_dasha}
    - Key Transit Influences this month: {transit_summary}

    STRUCTURE YOUR RESPONSE IN EXACTLY 3 PARAGRAPHS:
    Para 1: Overall month energy based on the Dasha and major transits. Tone: Mystical but practical.
    Para 2: Key opportunities, favorable windows for action, and where the luck is flowing.
    Para 3: Potential challenges, areas for caution, and simple Vedic remedies (like meditation, colors, or specific activities).

    TONE & STYLE:
    - Authoritative, premium, and insightful.
    - No generic sun-sign fluff.
    - Use evocative language.
    - 250-300 words total.
    """
    return prompt

def generate_monthly_narrative_ai(month: str, transit_summary: str, current_dasha: str) -> str:
    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key:
        return "The stars are veiled. (API Key missing)"
    
    try:
        client = genai.Client(api_key=api_key)
        prompt = format_monthly_narrative_prompt(month, transit_summary, current_dasha)
        
        response = client.models.generate_content(
            model="gemini-2.5-flash", 
            contents=prompt
        )
        return response.text
    except Exception as e:
        print(f"Gemini Error: {e}")
        return "The celestial currents are turbulent. Please try again later."

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

def format_compatibility_prompt(c1_sum: str, c2_sum: str, koota: List[Dict[str, Any]], dosha: List[Dict[str, Any]]) -> str:
    koota_str = "\n".join([f"- {k['category']} ({k['sanskrit']}): {k['score']}/{k['max']} - {k['explanation']}" for k in koota])
    dosha_str = "\n".join([f"- {d['name']}: {d['status']} ({d['reason']})" for d in dosha])
    
    prompt = f"""
    You are the 'Raj Jyotishi', the Royal Vedic Astrologer. 
    Analyze the compatibility between two individuals based on their Ashta Koota (Gun Milan) scores and Dosha analysis.
    
    PERSON 1 SUMMARY: {c1_sum}
    PERSON 2 SUMMARY: {c2_sum}
    
    GUN MILAN SCORES:
    {koota_str}
    
    DOSHA ANALYSIS:
    {dosha_str}

    STRUCTURE YOUR RESPONSE IN EXACTLY 3 PARAGRAPHS:
    Para 1: Overall relationship dynamic and soul-level resonance. Tone: Authoritative, mystical, and deep.
    Para 2: The primary strengths of this match—where do they naturally align?
    Para 3: The key challenges and karmic hurdles, with specific advice on how to navigate them using Vedic wisdom.

    TONE & STYLE:
    - Avoid cliches. Use profound, high-end copywriting.
    - Focus on the spiritual and psychological interplay.
    - 300-350 words total.
    """
    return prompt

def generate_compatibility_narrative(c1_sum: str, c2_sum: str, koota: List[Dict[str, Any]], dosha: List[Dict[str, Any]]) -> str:
    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key:
        return "The stars are silent. (API Key missing)"
    
    try:
        client = genai.Client(api_key=api_key)
        prompt = format_compatibility_prompt(c1_sum, c2_sum, koota, dosha)
        
        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt
        )
        return response.text
    except Exception as e:
        print(f"Gemini Compatibility Error: {e}")
        return "The celestial currents are too complex to synthesize right now."

# Global engine instance
astro_ai_engine = create_workflow()
