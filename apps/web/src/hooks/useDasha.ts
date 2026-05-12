"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { useParams } from "next/navigation";
import type { DashaResponse, DashaPeriod } from "../types/dasha";

const DASHA_YEARS: Record<string, number> = {
  Sun: 6,
  Moon: 10,
  Mars: 7,
  Rahu: 18,
  Jupiter: 16,
  Saturn: 19,
  Mercury: 17,
  Ketu: 7,
  Venus: 20,
};

const DASHA_SEQUENCE = [
  "Ketu", "Venus", "Sun", "Moon", "Mars",
  "Rahu", "Jupiter", "Saturn", "Mercury",
];

const TOTAL_CYCLE_YEARS = 120;

function getDashaSequenceFrom(lord: string): string[] {
  const start = DASHA_SEQUENCE.indexOf(lord);
  if (start === -1) return DASHA_SEQUENCE;
  return [...DASHA_SEQUENCE.slice(start), ...DASHA_SEQUENCE.slice(0, start)];
}

function addYears(dateStr: string, years: number): string {
  const date = new Date(dateStr);
  const days = Math.round(years * 365.25);
  date.setDate(date.getDate() + days);
  return date.toISOString().split("T")[0];
}

function buildAntardashas(mahadasha: DashaPeriod): DashaPeriod[] {
  const sequence = getDashaSequenceFrom(mahadasha.lord);
  const subPeriods: DashaPeriod[] = [];
  let cursor = mahadasha.start;

  for (const lord of sequence) {
    const duration = (mahadasha.duration_years * DASHA_YEARS[lord]) / TOTAL_CYCLE_YEARS;
    const end = addYears(cursor, duration);
    subPeriods.push({
      lord,
      start: cursor,
      end,
      duration_years: duration,
    });
    cursor = end;
  }

  return subPeriods;
}

export function useDasha() {
  const params = useParams<{ id: string }>();
  const id = params?.id ?? "me";
  const [data, setData] = useState<DashaResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDasha = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      let response;
      if (id === "me") {
        const saved = localStorage.getItem("kosmiq_chart_data");
        const chartData = saved ? JSON.parse(saved) : null;
        
        if (!chartData?.chart?.metadata) {
          throw new Error("No chart data found in sanctuary");
        }

        response = await fetch(`/api/chart/me/dasha`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(chartData.chart.metadata),
        });
      } else {
        response = await fetch(`/api/chart/${id}/dasha`);
      }

      if (!response.ok) throw new Error("Failed to fetch dasha data");
      const json = await response.json();
      setData(json);
    } catch (err: any) {
      setError(err.message || "Failed to fetch dasha data");
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    let isMounted = true;
    
    if (id && isMounted) {
      // Defer to next tick to avoid "sync setState in effect" lint error
      Promise.resolve().then(() => {
        if (isMounted) fetchDasha();
      });
    }
    
    return () => {
      isMounted = false;
    };
  }, [fetchDasha, id]);

  const augmentedData = useMemo(() => {
    if (!data) return null;

    const full_dasha_tree = data.sequence.map((maha) => ({
      ...maha,
      sub_periods: buildAntardashas(maha),
    }));

    return {
      ...data,
      full_dasha_tree,
    };
  }, [data]);

  return {
    data: augmentedData,
    isLoading,
    error,
    retry: fetchDasha,
  };
}
