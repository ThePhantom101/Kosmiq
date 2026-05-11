"use server";

import { ChartRequest, ChartResponse, CombinedChartResponse, SynthesisResponse } from "@/types/astro";

const ASTRO_ENGINE_URL = (process.env.ASTRO_ENGINE_URL && !process.env.ASTRO_ENGINE_URL.includes("localhost")) 
  ? process.env.ASTRO_ENGINE_URL 
  : "https://astro-engine-809930924347.asia-south1.run.app";

export async function calculateChart(data: ChartRequest): Promise<CombinedChartResponse> {
  // 1. Calculate the mathematical chart
  const chartResponse = await fetch(`${ASTRO_ENGINE_URL}/api/v1/calculate/chart`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!chartResponse.ok) {
    const errorData = await chartResponse.json().catch(() => ({}));
    throw new Error(errorData.detail || "Failed to calculate mathematical chart");
  }

  const chartData: ChartResponse = await chartResponse.json();

  // 2. Generate the AI synthesis reading
  const synthesisResponse = await fetch(`${ASTRO_ENGINE_URL}/api/v1/synthesis/generate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ chart_data: chartData }),
  });

  if (!synthesisResponse.ok) {
    const errorData = await synthesisResponse.json().catch(() => ({}));
    throw new Error(errorData.detail || "Failed to generate cosmic reading");
  }

  const synthesisData: SynthesisResponse = await synthesisResponse.json();

  return {
    chart: chartData,
    reading: synthesisData.reading,
  };
}
