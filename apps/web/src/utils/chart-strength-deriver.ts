import type { ChartResponse } from "@/types/astro";
import type { PlanetStrengthMetric, HouseStrength } from "@/types/overview";

const PLANET_SANSKRIT: Record<string, string> = {
  Sun: "Surya",
  Moon: "Chandra",
  Mars: "Mangala",
  Mercury: "Budha",
  Jupiter: "Guru",
  Venus: "Shukra",
  Saturn: "Shani",
  Rahu: "Rahu",
  Ketu: "Ketu",
};

// Exclude Lagna — it's the ascendant point, not a graha
const GRAHAS = Object.keys(PLANET_SANSKRIT);

/**
 * Derives planet house placement from longitude.
 * House 1 starts at the ascendant longitude.
 */
function planetHouse(planetLon: number, ascLon: number): number {
  const diff = (planetLon - ascLon + 360) % 360;
  return Math.floor(diff / 30) + 1;
}

/**
 * Normalizes raw speed-based strength scores to 0–100.
 * The engine outputs: 60 + (speed * 5), where speed can be negative.
 * We normalize across all grahas so relative ordering is preserved.
 */
function normalizeScores(raw: Record<string, number>): Record<string, number> {
  const values = GRAHAS.map((p) => raw[p] ?? 60).filter(isFinite);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min;

  if (range === 0) {
    return Object.fromEntries(GRAHAS.map((p) => [p, 50]));
  }

  return Object.fromEntries(
    GRAHAS.map((p) => {
      const rawVal = raw[p] ?? 60;
      const normalized = Math.round(((rawVal - min) / range) * 100);
      return [p, Math.max(0, Math.min(100, normalized))];
    })
  );
}

export interface DerivedPlanetMetrics {
  strongestPlanet: PlanetStrengthMetric;
  weakestPlanet: PlanetStrengthMetric;
}

export function derivePlanetMetrics(chart: ChartResponse): DerivedPlanetMetrics {
  const normalized = normalizeScores(chart.planetary_strengths);

  let strongestName = GRAHAS[0];
  let weakestName = GRAHAS[0];

  for (const planet of GRAHAS) {
    if (normalized[planet] > normalized[strongestName]) strongestName = planet;
    if (normalized[planet] < normalized[weakestName]) weakestName = planet;
  }

  const toMetric = (name: string): PlanetStrengthMetric => {
    const score = normalized[name];
    const planetData = chart.planets[name];
    const house = planetData
      ? planetHouse(planetData.longitude, chart.ascendant)
      : 1;

    return {
      planet: name,
      sanskritName: PLANET_SANSKRIT[name] ?? name,
      score,
      dignity: scoreToDignity(score),
      house,
    };
  };

  return {
    strongestPlanet: toMetric(strongestName),
    weakestPlanet: toMetric(weakestName),
  };
}

function scoreToDignity(score: number): PlanetStrengthMetric["dignity"] {
  if (score >= 85) return "Exalted";
  if (score >= 70) return "Own Sign";
  if (score >= 55) return "Friendly";
  if (score >= 40) return "Neutral";
  if (score >= 20) return "Enemy";
  return "Debilitated";
}

/**
 * Best house from ashtakavarga bindhu scores.
 * The backend currently returns ashtakavarga as an empty object `{}`.
 * Returns null when data is unavailable so the caller can fall back gracefully.
 */
export function deriveBestHouse(chart: ChartResponse): HouseStrength | null {
  const avData = chart.ashtakavarga as Record<string, unknown>;

  // Backend returns {} until ashtakavarga is implemented
  if (!avData || Object.keys(avData).length === 0) {
    return null;
  }

  // When the backend populates ashtakavarga, expected shape:
  // { house_totals: { "1": number, "2": number, ..., "12": number },
  //   house_planets: { "1": string[], ..., "12": string[] } }
  const totals = avData["house_totals"] as Record<string, number> | undefined;
  if (!totals) return null;

  let bestHouseNum = 1;
  let bestScore = 0;

  for (const [house, score] of Object.entries(totals)) {
    if (score > bestScore) {
      bestScore = score;
      bestHouseNum = Number(house);
    }
  }

  const housePlanets = (avData["house_planets"] as Record<string, string[]> | undefined) ?? {};
  const normalizedScore = Math.min(100, Math.round((bestScore / 48) * 100)); // max bindhu = 48

  return {
    house: bestHouseNum,
    label: `House ${bestHouseNum}`,
    score: normalizedScore,
    planets: housePlanets[String(bestHouseNum)] ?? [],
  };
}
