"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAstro } from "@/context/AstroContext";
import TransitChart from "@/components/sky/TransitChart";
import { CurrentTransitsResponse, TransitPlanetDetail } from "@/types/astro";
import { Calendar, Info, AlertCircle, Zap } from "lucide-react";

export default function TransitsPage() {
  const { data: natalData } = useAstro();
  const [transitData, setTransitData] = useState<CurrentTransitsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTransits = async () => {
      // Use "me" as default if no data, or get ID from context
      const chartId = natalData?.chart?.metadata?.jd ? "me" : "me"; 
      // Actually, if we have natalData, we might have an ID, but for now "me" is the contract
      
      try {
        const res = await fetch(`/api/sky/transits?chart_id=${chartId}`);
        if (!res.ok) throw new Error("Failed to fetch transit data");
        const json = await res.json();
        setTransitData(json);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTransits();
  }, [natalData]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <div className="w-12 h-12 border-2 border-gold/20 border-t-gold rounded-full animate-spin"></div>
        <p className="text-gold/60 text-sm animate-pulse tracking-widest uppercase">Calculating Gochar...</p>
      </div>
    );
  }

  if (error || !transitData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6">
        <AlertCircle className="w-12 h-12 text-red-500 mb-4 opacity-50" />
        <h2 className="text-xl font-light text-white mb-2">Transit Data Unavailable</h2>
        <p className="text-white/40 max-w-md">We couldn't align with the current sky. Please ensure your birth chart is set.</p>
      </div>
    );
  }

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 pb-24">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 space-y-4 md:space-y-0">
        <div>
          <h1 className="text-4xl font-light tracking-tight text-white mb-1">
            Current Transits
          </h1>
          <p className="text-gold text-xs uppercase tracking-[0.4em] font-medium opacity-80">
            Gochar
          </p>
        </div>
        
        <div className="flex items-center space-x-3 bg-white/5 border border-white/10 px-4 py-2 rounded-full backdrop-blur-md">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]"></div>
          <span className="text-[10px] uppercase tracking-widest text-white/60 font-medium">Live Sky</span>
          <div className="w-px h-3 bg-white/10"></div>
          <span className="text-[10px] uppercase tracking-widest text-gold font-semibold">{today}</span>
        </div>
      </div>

      {/* Special Alerts */}
      <AnimatePresence>
        {transitData.alerts.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 space-y-3"
          >
            {transitData.alerts.map((alert, idx) => (
              <div key={idx} className="flex items-center space-x-3 bg-red-500/10 border border-red-500/20 p-4 rounded-xl">
                <Zap className="w-5 h-5 text-red-500 shrink-0" />
                <p className="text-sm text-red-200/80">{alert}</p>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left Column: Chart */}
        <div className="lg:col-span-5 space-y-8">
          <div className="bg-black/40 border border-white/5 rounded-3xl p-8 backdrop-blur-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gold/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-gold/10 transition-colors"></div>
            {natalData?.chart?.shodashvarga?.D1 ? (
              <TransitChart 
                natalData={natalData.chart.shodashvarga.D1} 
                transitDetails={transitData.planets}
                title="Transit Overlay (D1)"
              />
            ) : (
              <div className="aspect-square flex items-center justify-center border border-white/10 rounded-2xl bg-white/5 italic text-white/20 text-sm">
                Natal chart required for overlay
              </div>
            )}
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <div className="flex items-center space-x-3 mb-4">
              <Info className="w-4 h-4 text-gold opacity-60" />
              <h3 className="text-xs uppercase tracking-widest text-white/60 font-medium">About Transits</h3>
            </div>
            <p className="text-xs leading-relaxed text-white/40">
              Gochar tracks the movement of planets across your natal houses. These cycles trigger specific themes and opportunities in your life. Fast-moving planets like Moon and Mercury affect daily moods, while slow-moving Saturn and Jupiter define major chapters.
            </p>
          </div>
        </div>

        {/* Right Column: Transit Cards */}
        <div className="lg:col-span-7">
          <div className="grid grid-cols-1 gap-4">
            {transitData.planets.map((planet, idx) => (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                key={planet.name}
                className="bg-white/[0.03] border border-white/5 hover:border-gold/30 hover:bg-white/[0.05] transition-all p-5 rounded-2xl group"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl font-bold border ${
                      planet.favorability === "Favorable" ? "border-gold/40 bg-gold/5 text-gold" :
                      planet.favorability === "Challenging" ? "border-red-500/40 bg-red-500/5 text-red-400" :
                      "border-white/10 bg-white/5 text-white/60"
                    }`}>
                      {planet.name.substring(0, 2)}
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="text-lg font-medium text-white group-hover:text-gold transition-colors">{planet.name}</h3>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-white/40 uppercase tracking-tighter">
                          {planet.sign}
                        </span>
                      </div>
                      <p className="text-xs text-white/40 mt-1 italic">
                        Transiting your <span className="text-white/60 font-medium">{planet.house}th House</span>
                      </p>
                    </div>
                  </div>

                  <div className={`text-[10px] uppercase tracking-widest px-3 py-1 rounded-full border ${
                    planet.favorability === "Favorable" ? "border-gold/50 text-gold bg-gold/10" :
                    planet.favorability === "Challenging" ? "border-red-500/50 text-red-400 bg-red-500/10" :
                    "border-white/20 text-white/60 bg-white/5"
                  }`}>
                    {planet.favorability}
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-white/[0.03]">
                  <p className="text-sm text-white/70 leading-relaxed">
                    {planet.impact}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
