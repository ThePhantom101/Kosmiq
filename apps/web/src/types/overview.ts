export interface ChartHero {
  name: string;
  dateOfBirth: string;
  timeOfBirth: string;
  placeOfBirth: string;
  lagna: string;
  lagnaLord: string;
  moonSign: string;
  moonNakshatra: string;
  sunSign: string;
  ascendantDegree: number;
}

export interface PlanetStrengthMetric {
  planet: string;
  signification: string;
  score: number;
  dignity: "Exalted" | "Own Sign" | "Friendly" | "Neutral" | "Enemy" | "Debilitated";
  house: number;
}

export interface HouseStrength {
  house: number;
  label: string;
  score: number;
  planets: string[];
}

export interface DashaInfo {
  mahadasha: string;
  mahadashaLabel: string;
  antardasha: string;
  antardashaLabel: string;
  endsAt: string;
  percentComplete: number;
}

export interface TransitAlert {
  type: "Saturn Cycle" | "Mars Sensitivity" | "Period Change" | "Favorable Transit";
  severity: "warning" | "info" | "success" | "critical";
  title: string;
  description: string;
  activeUntil?: string;
}

export interface YogaSummary {
  count: number;
  active: string[];
  dormant: string[];
}

export interface OverviewMetrics {
  strongestPlanet: PlanetStrengthMetric;
  weakestPlanet: PlanetStrengthMetric;
  bestHouse: HouseStrength;
  currentDasha: DashaInfo;
  astroScore: number;
  yogaSummary: YogaSummary;
}

export interface LifeGlance {
  health: number;
  wealth: number;
  relationships: number;
  career: number;
  creativity: number;
  spirituality: number;
}

export interface ChartOverviewData {
  hero: ChartHero;
  metrics: OverviewMetrics;
  lifeGlance: LifeGlance;
  alerts: TransitAlert[];
}
