"use client";

import React, { useState, useEffect } from "react";
import { useAstro } from "@/context/AstroContext";
import { ChartResponse, CompatibilityResponse } from "@/types/astro";
import { 
  ChartPicker, 
  ScoreHero, 
  KootaBreakdown, 
  DoshaAnalysis, 
  DetailedNarrative, 
  SaveShare 
} from "@/components/compatibility";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Sparkles } from "lucide-react";

export default function CompatibilityPage() {
  const { data: meData } = useAstro();
  const [person1, setPerson1] = useState<ChartResponse | null>(meData?.chart || null);
  const [person2, setPerson2] = useState<ChartResponse | null>(null);
  const [result, setResult] = useState<CompatibilityResponse | null>(null);
  const [narrative, setNarrative] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isNarrativeLoading, setIsNarrativeLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Sync person1 with meData if it changes
  useEffect(() => {
    if (meData?.chart && !person1) {
      setPerson1(meData.chart);
    }
  }, [meData, person1]);

  const handleCalculate = async () => {
    if (!person1 || !person2) return;

    setIsLoading(true);
    setError(null);
    setResult(null);
    setNarrative(null);

    try {
      const response = await fetch("/api/compatibility/calculate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chart1: person1, chart2: person2 }),
      });

      if (!response.ok) throw new Error("Failed to calculate compatibility");

      const data = await response.json();
      setResult(data);

      // Trigger narrative fetch
      fetchNarrative(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchNarrative = async (compData: CompatibilityResponse) => {
    setIsNarrativeLoading(true);
    try {
      const response = await fetch("/api/compatibility/narrative", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chart1_summary: `Lagna: ${person1?.ascendant_nakshatra.name}, Moon: ${person1?.planets.Moon.nakshatra.name}`,
          chart2_summary: `Lagna: ${person2?.ascendant_nakshatra.name}, Moon: ${person2?.planets.Moon.nakshatra.name}`,
          koota_scores: compData.koota_scores,
          dosha_analysis: compData.dosha_analysis,
        }),
      });

      if (!response.ok) throw new Error("Failed to generate narrative");

      const data = await response.json();
      setNarrative(data.reading);
    } catch (err: any) {
      console.error(err);
    } finally {
      setIsNarrativeLoading(false);
    }
  };

  return (
    <div className="container max-w-5xl mx-auto py-8 px-4 space-y-12">
      {/* Header */}
      <div className="space-y-2 text-center">
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-b from-[#C9A84C] to-[#8A6D2B] bg-clip-text text-transparent">
          Compatibility (Gun Milan)
        </h1>
        <p className="text-zinc-400 max-w-2xl mx-auto">
          Discover the cosmic alignment between two souls using the ancient Ashta Koota system of Vedic matching.
        </p>
      </div>

      {/* SECTION 1: CHART PICKER */}
      <div className="grid md:grid-cols-2 gap-6 items-start">
        <ChartPicker
          label="Person 1"
          selectedChart={person1}
          onSelect={setPerson1}
          isMe={true}
        />
        <ChartPicker
          label="Person 2"
          selectedChart={person2}
          onSelect={setPerson2}
        />
      </div>

      <div className="flex justify-center">
        <button
          onClick={handleCalculate}
          disabled={!person1 || !person2 || isLoading}
          className="w-full md:w-96 h-16 text-xs uppercase tracking-[0.3em] font-black bg-gold hover:bg-gold/90 text-black rounded-sm shadow-[0_0_30px_rgba(197,160,89,0.3)] transition-all disabled:opacity-50 disabled:grayscale flex items-center justify-center"
        >
          {isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin mr-3" />
          ) : (
            <Sparkles className="w-5 h-5 mr-3" />
          )}
          Check Compatibility
        </button>
      </div>

      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-16 pt-8 border-t border-zinc-800"
          >
            {/* SECTION 2: OVERALL SCORE HERO */}
            <ScoreHero 
              score={result.total_score} 
              names={[person1?.metadata.name || "Person 1", person2?.metadata.name || "Person 2"]} 
            />

            {/* SECTION 3: ASHTA KOOTA BREAKDOWN */}
            <KootaBreakdown scores={result.koota_scores} />

            {/* SECTION 4: DOSHA ANALYSIS */}
            <DoshaAnalysis doshas={result.dosha_analysis} />

            {/* SECTION 5: DETAILED NARRATIVE */}
            <DetailedNarrative narrative={narrative} isLoading={isNarrativeLoading} />

            {/* SECTION 6: SAVE & SHARE */}
            <SaveShare result={result} />
          </motion.div>
        )}
      </AnimatePresence>

      {error && (
        <div className="p-4 bg-red-950/30 border border-red-500/50 rounded-xl text-red-200 text-center">
          {error}
        </div>
      )}
    </div>
  );
}
