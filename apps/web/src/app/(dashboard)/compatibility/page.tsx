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
    <div className="max-w-6xl mx-auto space-y-24 pb-32 pt-12 px-4 sm:px-8">
      {/* HEADER: HARMONIC INTERSECTION */}
      <section className="text-center space-y-8">
        <div className="flex flex-col items-center space-y-4">
           <div className="flex items-center gap-4">
              <div className="h-[1px] w-12 bg-gold/20" />
              <span className="overline-label text-gold/60 tracking-[0.4em]">Synastry Analysis</span>
              <div className="h-[1px] w-12 bg-gold/20" />
           </div>
           <h1 className="text-6xl md:text-8xl font-serif text-white tracking-tighter uppercase leading-[0.8]">
             Karmic <br /> <span className="text-gold">Intersection</span>
           </h1>
           <p className="text-zinc-500 max-w-2xl mx-auto text-xs font-bold leading-relaxed uppercase tracking-[0.2em] opacity-80 pt-4">
             Synthesizing the Eight Factor variables and energy distribution to map the resonance between two unique natal signatures.
           </p>
        </div>
      </section>

      {/* SECTION 1: CHART SELECTION */}
      <section className="space-y-12">
        <div className="grid md:grid-cols-2 gap-12 relative">
           {/* Connection Line Decor */}
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 hidden md:block z-0">
              <div className="w-24 h-[1px] bg-white/5 relative">
                 <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rotate-45 border border-gold/40 bg-black" />
              </div>
           </div>

          <ChartPicker
            label="Prime Subject"
            selectedChart={person1}
            onSelect={setPerson1}
            isMe={true}
          />
          <ChartPicker
            label="Secondary Subject"
            selectedChart={person2}
            onSelect={setPerson2}
          />
        </div>

        <div className="flex justify-center pt-8">
          <button
            onClick={handleCalculate}
            disabled={!person1 || !person2 || isLoading}
            className="hud-button bg-gold text-black px-16 py-6 text-[10px] font-black uppercase tracking-[0.4em] disabled:opacity-30 flex items-center gap-4 group"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Sparkles className="w-4 h-4 group-hover:rotate-12 transition-transform" />
            )}
            Initiate Synthesis
          </button>
        </div>
      </section>

      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-32"
          >
            {/* OVERALL SCORE HERO */}
            <ScoreHero 
              score={result.total_score} 
              names={[person1?.metadata.name || "Subject A", person2?.metadata.name || "Subject B"]} 
            />

            {/* ASHTA KOOTA BREAKDOWN */}
            <KootaBreakdown scores={result.koota_scores} />

            {/* DOSHA ANALYSIS */}
            <DoshaAnalysis doshas={result.dosha_analysis} />

            {/* DETAILED NARRATIVE */}
            <DetailedNarrative narrative={narrative} isLoading={isNarrativeLoading} />

            {/* SAVE & SHARE */}
            <section className="flex justify-center pb-24">
               <SaveShare result={result} />
            </section>
          </motion.div>
        )}
      </AnimatePresence>

      {error && (
        <div className="p-8 hud-module bg-red-950/10 border border-red-500/20 text-red-500 text-center text-xs font-bold uppercase tracking-widest">
          {error}
        </div>
      )}
    </div>
  );
}
