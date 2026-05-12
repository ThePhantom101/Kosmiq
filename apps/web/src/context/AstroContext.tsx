"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { CombinedChartResponse } from "@/types/astro";

import { calculateChart } from "@/actions/calculate";

interface AstroContextType {
  data: CombinedChartResponse | null;
  setData: (data: CombinedChartResponse | null) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  error: string | null;
  setError: (error: string | null) => void;
  refresh: () => Promise<void>;
}

const AstroContext = createContext<AstroContextType | undefined>(undefined);

export function AstroProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<CombinedChartResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Persistence
  useEffect(() => {
    const saved = localStorage.getItem("kosmiq_chart_data");
    if (saved) {
      try {
        setData(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse saved chart data");
      }
    }
  }, []);

  const setAndSaveData = (newData: CombinedChartResponse | null) => {
    setData(newData);
    if (newData) {
      localStorage.setItem("kosmiq_chart_data", JSON.stringify(newData));
    } else {
      localStorage.removeItem("kosmiq_chart_data");
    }
  };

  const refresh = async () => {
    if (!data?.birth_data) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await calculateChart({
        date_of_birth: data.birth_data.date,
        time_of_birth: data.birth_data.time.includes(":") ? data.birth_data.time + ":00" : data.birth_data.time,
        latitude: data.birth_data.latitude,
        longitude: data.birth_data.longitude,
        timezone_offset: data.birth_data.timezone_offset,
      });

      const enrichedResult: CombinedChartResponse = {
        ...result,
        birth_data: data.birth_data
      };
      
      setAndSaveData(enrichedResult);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AstroContext.Provider value={{ 
      data, 
      setData: setAndSaveData, 
      isLoading, 
      setIsLoading,
      error,
      setError,
      refresh
    }}>
      {children}
    </AstroContext.Provider>
  );
}

export function useAstro() {
  const context = useContext(AstroContext);
  if (context === undefined) {
    throw new Error("useAstro must be used within an AstroProvider");
  }
  return context;
}
