import type { CombinedChartResponse } from "@/types/astro";
import type { DashaResponse } from "@/types/dasha";
import type {
  ChartContextData,
  PlanetStrengthBrief,
  PlanetPositionBrief,
  ChartAlert,
} from "@/types/ask";

const SIGNS = [
  "Aries", "Taurus", "Gemini", "Cancer",
  "Leo", "Virgo", "Libra", "Scorpio",
  "Sagittarius", "Capricorn", "Aquarius", "Pisces",
];

function longitudeToSign(longitude: number): string {
  const index = Math.floor(longitude / 30) % 12;
  return SIGNS[index];
}

function getTopPlanets(
  strengths: Record<string, number>,
  positions: Record<string, { longitude: number }>,
  count: number
): PlanetStrengthBrief[] {
  return Object.entries(strengths)
    .sort(([, a], [, b]) => b - a)
    .slice(0, count)
    .map(([name, strength]) => ({
      name,
      strength,
      house: positions[name]
        ? Math.floor(positions[name].longitude / 30) + 1
        : 0,
    }));
}

function detectAlerts(
  positions: Record<string, { longitude: number }>,
  ascendant: number
): ChartAlert[] {
  const alerts: ChartAlert[] = [];

  const moonSign = positions.Moon
    ? Math.floor(positions.Moon.longitude / 30)
    : -1;
  const saturnSign = positions.Saturn
    ? Math.floor(positions.Saturn.longitude / 30)
    : -1;

  if (moonSign >= 0 && saturnSign >= 0) {
    const diff = ((saturnSign - moonSign + 12) % 12);
    if (diff === 0 || diff === 1 || diff === 11) {
      alerts.push({
        type: "sade_sati",
        label: "Sade Sati active — Saturn transiting near Moon",
        active: true,
      });
    }
  }

  const marsHouse = positions.Mars
    ? (Math.floor(positions.Mars.longitude / 30) -
        Math.floor(ascendant / 30) +
        12) %
        12 +
      1
    : -1;

  if ([1, 2, 4, 7, 8, 12].includes(marsHouse)) {
    alerts.push({
      type: "mangal_dosha",
      label: `Mangal Dosha — Mars in house ${marsHouse}`,
      active: true,
    });
  }

  return alerts;
}

export function buildChartContext(
  astroData: CombinedChartResponse | null,
  dashaData: DashaResponse | null
): ChartContextData | null {
  if (!astroData?.chart) return null;

  const chart = astroData.chart;

  const planetPositions: Record<string, PlanetPositionBrief> = {};
  for (const [name, pos] of Object.entries(chart.planets)) {
    planetPositions[name] = {
      longitude: pos.longitude,
      sign: longitudeToSign(pos.longitude),
      nakshatra: pos.nakshatra.name,
      isRetrograde: pos.is_retrograde,
    };
  }

  const topPlanets = getTopPlanets(
    chart.planetary_strengths ?? {},
    chart.planets,
    3
  );

  const alerts = detectAlerts(chart.planets, chart.ascendant);

  return {
    userName: "Chart Holder",
    lagnaSign: longitudeToSign(chart.ascendant),
    moonSign: chart.planets.Moon
      ? longitudeToSign(chart.planets.Moon.longitude)
      : "Unknown",
    currentMahadasha: dashaData?.current_mahadasha?.lord ?? "Unknown",
    currentMahadashaPercent: dashaData?.current_mahadasha?.percent_complete ?? 0,
    currentAntardasha: dashaData?.current_antardasha?.lord ?? "Unknown",
    currentAntardashaPercent: dashaData?.current_antardasha?.percent_complete ?? 0,
    topPlanets,
    alerts,
    planetaryPositions: planetPositions,
    planetaryStrengths: chart.planetary_strengths ?? {},
    ashtakavarga: chart.ashtakavarga ?? {},
    ascendantDegree: chart.ascendant,
  };
}
