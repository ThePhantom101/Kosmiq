export interface Nakshatra {
  name: string;
  pada: number;
  index: number;
}

export interface PlanetaryPosition {
  longitude: number;
  speed: number;
  is_retrograde: boolean;
  sign: string;
  house: number;
  dignity: string;
  nakshatra: Nakshatra & { lord: string };
}

export type PlanetData = PlanetaryPosition;

export interface Metadata {
  jd: number;
  ayanamsa: number;
  ayanamsa_name: string;
  name?: string;
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
  profile?: {
    id: string;
  };
}

export interface TransitPlanetDetail {
  name: string;
  sign: string;
  house: number;
  favorability: "Favorable" | "Neutral" | "Challenging";
  impact: string;
  duration: string;
}

export interface CurrentTransitsResponse {
  date: string;
  planets: TransitPlanetDetail[];
  alerts: string[];
}

export interface PanchangElement {
  name: string;
  number?: number;
  quality: "Auspicious" | "Neutral" | "Inauspicious";
  extra?: string;
}

export interface PanchangResponse {
  tithi: PanchangElement;
  vara: PanchangElement;
  nakshatra: PanchangElement;
  yoga: PanchangElement;
  karana: PanchangElement;
  sunrise: string;
  sunset: string;
  rahukalam: { start: string; end: string };
  abhijit: { start: string; end: string };
  moon_sign: string;
  moon_degree: number;
}

export interface DomainScore {
  name: string;
  score: number;
  insight: string;
  trend: "up" | "stable" | "down";
}

export interface KeyDate {
  date: string;
  event: string;
  description: string;
  impact: "Favorable" | "Neutral" | "Challenging";
}

export interface MonthlyForecastResponse {
  month: string;
  overall_score: number;
  themes: string[];
  dasha_context: string;
  domain_scores: DomainScore[];
  key_dates: KeyDate[];
}

export interface MonthlyNarrativeRequest {
  chart_id: string;
  month: string;
  transit_summary: string;
  current_dasha: string;
}

export interface KootaScore {
  category: string;
  sanskrit: string;
  score: number;
  max: number;
  status: "Full" | "Partial" | "Zero";
  explanation: string;
}

export interface DoshaAnalysisItem {
  name: string;
  affects: string;
  status: "Present" | "Cancelled" | "Absent";
  reason: string;
}

export interface CompatibilityResponse {
  total_score: number;
  koota_scores: KootaScore[];
  dosha_analysis: DoshaAnalysisItem[];
}

export interface CompatibilityNarrativeRequest {
  chart1_summary: string;
  chart2_summary: string;
  koota_scores: KootaScore[];
  dosha_analysis: DoshaAnalysisItem[];
}
