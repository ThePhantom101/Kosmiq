"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import { useAstro } from "@/context/AstroContext";

export interface Yoga {
  name: string;
  category: "Power" | "Wealth" | "Spiritual" | "Challenging";
  present: boolean;
  strength: string;
  meaning: string;
}

export interface YogasResponse {
  yogas: Yoga[];
  summary: string;
}

export function useYogas() {
  const params = useParams<{ id: string }>();
  const id = params?.id ?? "me";
  const { data: astroData } = useAstro();
  
  const [data, setData] = useState<YogasResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchYogas = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const url = `/api/chart/${id}/yogas`;
      const options: RequestInit = id === "me" ? {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chart_data: astroData?.chart }),
      } : {
        method: "GET",
      };

      const response = await fetch(url, options);
      if (!response.ok) throw new Error("Failed to fetch yogas");
      const json = await response.json();
      setData(json);
    } catch (err: any) {
      console.error("Yogas fetch failed:", err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [id, astroData]);

  useEffect(() => {
    if (id && (id !== "me" || astroData?.chart)) {
      fetchYogas();
    }
  }, [fetchYogas, id, astroData]);

  return {
    data,
    isLoading,
    error,
    retry: fetchYogas,
  };
}
