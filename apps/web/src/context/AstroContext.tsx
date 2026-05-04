"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { CombinedChartResponse } from "../../types/astro";

interface AstroContextType {
  data: CombinedChartResponse | null;
  setData: (data: CombinedChartResponse | null) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

const AstroContext = createContext<AstroContextType | undefined>(undefined);

export function AstroProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<CombinedChartResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Persistence (Optional for now)
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

  return (
    <AstroContext.Provider value={{ data, setData: setAndSaveData, isLoading, setIsLoading }}>
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
