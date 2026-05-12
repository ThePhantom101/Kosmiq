"use client";

import { useMemo } from "react";
import { useAstro } from "@/context/AstroContext";
import { derivePlanetMetrics, deriveBestHouse } from "@/utils/chart-strength-deriver";
import type { PlanetStrengthMetric, HouseStrength } from "@/types/overview";

interface LivePlanetData {
  strongestPlanet: PlanetStrengthMetric;
  weakestPlanet: PlanetStrengthMetric;
  bestHouse: HouseStrength;
  isLive: boolean;
  isLoading: boolean;
  error: string | null;
  hasChartData: boolean;
}

export function useChartStrengths(): LivePlanetData {
  const { data, isLoading, error } = useAstro();

  const derived = useMemo(() => {
    if (!data?.chart) return null;

    const planetMetrics = derivePlanetMetrics(data.chart);
    const bestHouseFromApi = deriveBestHouse(data.chart);

    return {
      ...planetMetrics,
      bestHouse: bestHouseFromApi ?? {
        house: 0,
        label: "Finding...",
        score: 0,
        planets: []
      },
    };
  }, [data]);

  const hasChartData = Boolean(data?.chart);

  const defaultMetric: PlanetStrengthMetric = {
    planet: "...",
    sanskritName: "...",
    score: 0,
    dignity: "Neutral",
    house: 1
  };

  return {
    strongestPlanet: derived?.strongestPlanet ?? defaultMetric,
    weakestPlanet: derived?.weakestPlanet ?? defaultMetric,
    bestHouse: derived?.bestHouse ?? {
      house: 0,
      label: "...",
      score: 0,
      planets: []
    },
    isLive: hasChartData,
    isLoading,
    error,
    hasChartData,
  };
}
