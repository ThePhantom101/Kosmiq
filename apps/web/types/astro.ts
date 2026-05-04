export interface Nakshatra {
  name: string;
  pada: number;
  index: number;
}

export interface PlanetaryPosition {
  longitude: number;
  speed: number;
  is_retrograde: boolean;
  nakshatra: Nakshatra;
}

export interface Metadata {
  jd: number;
  ayanamsa: number;
  ayanamsa_name: string;
}

export interface ShodashvargaChart {
  Sun: number;
  Moon: number;
  Mars: number;
  Mercury: number;
  Jupiter: number;
  Venus: number;
  Saturn: number;
  Rahu: number;
  Ketu: number;
  Lagna: number;
}

export interface ChartResponse {
  metadata: Metadata;
  planets: Record<string, PlanetaryPosition>;
  shodashvarga: Record<string, ShodashvargaChart>;
  ascendant: number;
  ascendant_nakshatra: Nakshatra;
  astro_score: number;
  planetary_strengths: Record<string, number>;
  ashtakavarga: Record<string, unknown>;
}

export interface ChartRequest {
  date_of_birth: string;
  time_of_birth: string;
  latitude: number;
  longitude: number;
  timezone_offset: number;
}

export interface SynthesisResponse {
  reading: string;
}

export interface CombinedChartResponse {
  chart: ChartResponse;
  reading: string;
}
