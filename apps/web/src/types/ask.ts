export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: number;
}

export interface ChartContextData {
  userName: string;
  lagnaSign: string;
  moonSign: string;
  currentMahadasha: string;
  currentMahadashaPercent: number;
  currentAntardasha: string;
  currentAntardashaPercent: number;
  topPlanets: PlanetStrengthBrief[];
  alerts: ChartAlert[];
  planetaryPositions: Record<string, PlanetPositionBrief>;
  planetaryStrengths: Record<string, number>;
  ashtakavarga: Record<string, unknown>;
  ascendantDegree: number;
}

export interface PlanetStrengthBrief {
  name: string;
  strength: number;
  house: number;
}

export interface PlanetPositionBrief {
  longitude: number;
  sign: string;
  nakshatra: string;
  isRetrograde: boolean;
}

export interface ChartAlert {
  type: "sade_sati" | "mangal_dosha" | "rahu_ketu_transit";
  label: string;
  active: boolean;
}

export interface AskRequest {
  message: string;
  history: ChatMessage[];
  chartContext: ChartContextData;
}

export interface AskStreamChunk {
  text?: string;
  done?: boolean;
  error?: string;
}
