from typing import TypedDict, Dict, Any, List
from langgraph.graph import StateGraph, END
from google import genai
import os
from dotenv import load_dotenv

load_dotenv()

class GraphState(TypedDict):
    chart_data: Dict[str, Any]
    calculation_results: Dict[str, Any]
    reading: str

def format_prompt(chart_data: Dict[str, Any], calculation_results: Dict[str, Any]) -> str:
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

    # Shadbala Highlights (from calculation_results)
    shadbala = calculation_results.get("shadbala", {})
    shad_details = [f"- {p}: {data.get('total', 0)} Virūpas" for p, data in shadbala.items() if p in ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn"]]

    prompt = f"""
    You are the 'Kosmiq Oracle', an Elite Vedic Astrologer with profound knowledge of the Shastras, Tantra, and modern psychological archetypes. 
    Your mission is to provide a God-Tier astrological synthesis based on the provided DETERMINISTIC calculation data.
    
    SYSTEM DIRECTIVE: 
    Act as a high-end spiritual advisor. Your tone is authoritative, mystical, and profoundly insightful. 
    Gemini, do NOT hallucinate planetary positions. Use the strict mathematical output provided below.
    Focus on the "Why" behind the "What"—reveal the karmic blueprint.

    NATAL STRENGTHS (Shadbala - Virūpas):
    {chr(10).join(shad_details)}

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
        
        # Use a list of models to try in case one is not available
        models_to_try = ["gemini-1.5-flash", "gemini-1.5-pro"]
        last_error = None
        
        for model_name in models_to_try:
            try:
                response = client.models.generate_content(
                    model=model_name, 
                    contents=prompt
                )
                return response.text
            except Exception as e:
                last_error = e
                if "404" not in str(e):
                    break
        
        print(f"Gemini Error: {last_error}")
        return "The celestial currents are turbulent. Please try again later."

def calculation_node(state: GraphState):
    """
    Computes strict, deterministic astrological metrics before AI synthesis.
    """
    from engine.shadbala import calculate_shadbala_for_chart
    chart = state["chart_data"]
    planets = chart.get("planets", {})
    metadata = chart.get("metadata", {})
    vargas = chart.get("shodashvarga", {})
    
    # Deriving Day/Night and JD
    jd_ut = metadata.get("jd", 0)
    # Simplified Day/Night for node
    is_day_birth = True 
    
    shadbala = calculate_shadbala_for_chart(
        planets=planets,
        houses=[],
        is_day_birth=is_day_birth,
        jd_ut=jd_ut,
        vargas=vargas
    )
    
    return {"calculation_results": {"shadbala": shadbala}}

def gemini_node(state: GraphState):
    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key:
        return {"reading": "Error: GEMINI_API_KEY not found in environment."}
    
    client = genai.Client(api_key=api_key)
    prompt = format_prompt(state["chart_data"], state.get("calculation_results", {}))
    
    # Use a list of models to try in case one is not available
    models_to_try = ["gemini-1.5-flash", "gemini-1.5-pro"]
    last_error = None
    
    for model_name in models_to_try:
        try:
            response = client.models.generate_content(
                model=model_name,
                contents=prompt
            )
            return {"reading": response.text}
        except Exception as e:
            last_error = e
            if "404" not in str(e):
                break
    
    return {"reading": f"Error during AI synthesis: {str(last_error)}"}

def create_workflow():
    workflow = StateGraph(GraphState)
    
    workflow.add_node("calculate_metrics", calculation_node)
    workflow.add_node("generate_reading", gemini_node)
    
    workflow.set_entry_point("calculate_metrics")
    workflow.add_edge("calculate_metrics", "generate_reading")
    workflow.add_edge("generate_reading", END)
    
    return workflow.compile()

def format_compatibility_prompt(c1_sum: str, c2_sum: str, koota: List[Dict[str, Any]], dosha: List[Dict[str, Any]]) -> str:
    koota_str = "\n".join([f"- {k['category']} ({k['sanskrit']}): {k['score']}/{k['max']} - {k['explanation']}" for k in koota])
    dosha_str = "\n".join([f"- {d['name']}: {d['status']} ({d['reason']})" for d in dosha])
    
    prompt = f"""
    You are the 'Raj Jyotishi', the Royal Vedic Astrologer. 
    Analyze the compatibility between two individuals based on their ASHTA KOOTA (Gun Milan) scores and strict DOSHA analysis.
    
    SYSTEM DIRECTIVE:
    This is a deterministic mathematical report. Your job is to interpret these specific numbers into deep psychological and spiritual insights.
    
    PERSON 1 SUMMARY: {c1_sum}
    PERSON 2 SUMMARY: {c2_sum}
    
    DETERMINISTIC GUN MILAN SCORES (36-Point Scale):
    {koota_str}
    
    DOSHA ANALYSIS & MANGLIK STATUS:
    {dosha_str}

    INSTRUCTIONS:
    1. THE SOUL BOND: Analyze the overall score. Is this a union of convenience, karma, or divine purpose?
    2. THE FRICTION POINTS: Address any Doshas (especially Nadi or Manglik) with the gravity they deserve, but offer Vedic remedies.
    3. PROGENY & PROSPERITY: Specifically interpret the Nadi and Bhakoot scores regarding the long-term legacy of the couple.
    
    TONE & STYLE:
    - Authoritative, premium, and profoundly deep.
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
        
        # Use a list of models to try in case one is not available
        models_to_try = ["gemini-1.5-flash", "gemini-1.5-pro"]
        last_error = None
        
        for model_name in models_to_try:
            try:
                response = client.models.generate_content(
                    model=model_name,
                    contents=prompt
                )
                return response.text
            except Exception as e:
                last_error = e
                if "404" not in str(e):
                    break
        
        print(f"Gemini Compatibility Error: {last_error}")
        return "The celestial currents are too complex to synthesize right now."

# Global engine instance
astro_ai_engine = create_workflow()
