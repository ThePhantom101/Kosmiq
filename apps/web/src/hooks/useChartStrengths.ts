"use client";

import { useMemo } from "react";
import { useAstro } from "@/context/AstroContext";
import { derivePlanetMetrics, deriveBestHouse } from "@/utils/chart-strength-deriver";
import { mockOverviewData } from "@/utils/overview-mock";
import type { PlanetStrengthMetric, HouseStrength } from "@/types/overview";

interface LivePlanetData {
  strongestPlanet: PlanetStrengthMetric;
  weakestPlanet: PlanetStrengthMetric;
  bestHouse: HouseStrength;
  isLive: boolean;
  isLoading: boolean;
  hasChartData: boolean;
}

/**
 * Derives live metric card data from the active chart in AstroContext.
 * Falls back to mock data on each field individually:
 * - strongestPlanet / weakestPlanet: live when chart is available
 * - bestHouse: mock until backend implements ashtakavarga bindhu scores
 */
export function useChartStrengths(): LivePlanetData {
  const { data, isLoading } = useAstro();

  const derived = useMemo(() => {
    if (!data?.chart) return null;

    const planetMetrics = derivePlanetMetrics(data.chart);
    const bestHouseFromApi = deriveBestHouse(data.chart);

    return {
      ...planetMetrics,
      bestHouse: bestHouseFromApi ?? mockOverviewData.metrics.bestHouse,
    };
  }, [data]);

  const hasChartData = Boolean(data?.chart);

  return {
    strongestPlanet: derived?.strongestPlanet ?? mockOverviewData.metrics.strongestPlanet,
    weakestPlanet: derived?.weakestPlanet ?? mockOverviewData.metrics.weakestPlanet,
    bestHouse: derived?.bestHouse ?? mockOverviewData.metrics.bestHouse,
    isLive: hasChartData,
    isLoading,
    hasChartData,
  };
}
