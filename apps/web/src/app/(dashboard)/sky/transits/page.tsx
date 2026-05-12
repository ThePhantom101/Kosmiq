"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAstro } from "@/context/AstroContext";
import TransitChart from "@/components/sky/TransitChart";
import { CurrentTransitsResponse, TransitPlanetDetail } from "@/types/astro";
import { 
  Calendar, Info, AlertCircle, Zap, RefreshCcw, 
  ShieldAlert, Ghost, Sparkles, Moon, Sun, 
  Crosshair, Compass, Atom, Orbit, Star
} from "lucide-react";

import { IntelligenceCard } from "@/components/dashboard/IntelligenceCard";
import type { LucideIcon } from "lucide-react";

const planetIcons: Record<string, LucideIcon> = {
  Sun: Sun,
  Moon: Moon,
  Mars: Zap,
  Mercury: Crosshair,
  Jupiter: Star,
  Venus: Sparkles,
  Saturn: ShieldAlert,
  Rahu: Ghost,
  Ketu: Compass
};

export default function TransitsPage() {
  const { data: natalData } = useAstro();
  const [transitData, setTransitData] = useState<CurrentTransitsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTransits = async () => {
      const chartId = "me"; 
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
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-8">
        <div className="relative w-16 h-16">
           <div className="absolute inset-0 border-2 border-gold/10 rounded-full" />
           <div className="absolute inset-0 border-2 border-gold border-t-transparent rounded-full animate-spin" />
           <div className="absolute inset-0 flex items-center justify-center">
              <RefreshCcw className="w-6 h-6 text-gold/40" />
           </div>
        </div>
        <p className="text-gold/60 text-[10px] font-black tracking-[0.4em] uppercase animate-pulse">Synchronizing Live Sky</p>
      </div>
    );
  }

  if (error || !transitData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6 space-y-6">
        <div className="relative">
           <AlertCircle className="w-16 h-16 text-red-500/20" />
           <div className="absolute inset-0 blur-xl bg-red-500/10" />
        </div>
        <div className="space-y-2">
           <h2 className="text-2xl font-serif uppercase tracking-tight text-white">Gochar Desync</h2>
           <p className="text-xs text-zinc-500 uppercase font-black tracking-widest max-w-md mx-auto">We couldn't align with the current sky coordinates. Verify your natal profile context.</p>
        </div>
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
    <div className="max-w-7xl mx-auto px-4 py-12 pb-32 space-y-24">
      {/* HEADER: CELESTIAL MECHANICS */}
      <section className="flex flex-col md:flex-row items-center justify-between gap-8 pb-12 border-b border-white/5">
        <div className="space-y-4 text-center md:text-left">
           <div className="flex items-center justify-center md:justify-start gap-4">
              <span className="overline-label text-gold/60 tracking-[0.4em]">Gochar Analysis</span>
              <div className="h-[1px] w-12 bg-gold/20" />
           </div>
           <h1 className="text-6xl md:text-8xl font-serif text-white tracking-tighter uppercase leading-[0.8]">
             Celestial <br /> <span className="text-gold">Mechanics</span>
           </h1>
        </div>

        <div className="flex flex-col items-center md:items-end gap-3 bg-white/[0.02] border border-white/5 p-6 rounded-sm backdrop-blur-sm">
           <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Live Gochar Stream</span>
           </div>
           <div className="text-xl font-serif text-gold uppercase tracking-tight">{today}</div>
           <div className="text-[9px] text-zinc-700 font-mono uppercase">UTC Offset: +00:00 (Simulated)</div>
        </div>
      </section>

      {/* Special Alerts */}
      {transitData.alerts.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center gap-3 mb-6">
             <ShieldAlert className="w-4 h-4 text-red-500/60" />
             <span className="overline-label text-red-500/60">Orbital Anomalies</span>
          </div>
          <div className="grid gap-4">
            {transitData.alerts.map((alert, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-6 p-6 bg-red-950/5 border border-red-900/20 rounded-sm group overflow-hidden relative"
              >
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-red-500 opacity-20" />
                <Zap className="w-6 h-6 text-red-500 shrink-0 opacity-40 group-hover:opacity-100 transition-opacity" />
                <p className="text-xs font-bold text-red-200/60 leading-relaxed uppercase tracking-widest">{alert}</p>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
        {/* Left Column: Chart */}
        <div className="lg:col-span-5 space-y-12">
          <div className="hud-module p-8 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-gold/5 rounded-full blur-[100px] -mr-32 -mt-32" />
            {natalData?.chart?.shodashvarga?.D1 ? (
              <TransitChart 
                natalData={natalData.chart.shodashvarga.D1} 
                transitDetails={transitData.planets}
                title="Orbital Overlay (D1)"
              />
            ) : (
              <div className="aspect-square flex flex-col items-center justify-center border border-white/5 bg-white/[0.01] rounded-sm text-center p-12">
                <Ghost className="w-12 h-12 text-zinc-800 mb-4" />
                <p className="text-[10px] font-black text-zinc-700 uppercase tracking-widest">Natal profile required for dynamic mapping</p>
              </div>
            )}
          </div>

          <div className="p-8 bg-zinc-900/20 border border-white/5 rounded-sm space-y-6">
            <div className="flex items-center gap-3">
              <Info className="w-4 h-4 text-gold/40" />
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Gochar Mechanics</h3>
            </div>
            <p className="text-xs leading-relaxed text-zinc-400 italic">
              Gochar tracks the movement of planets across your natal houses. These cycles trigger specific themes and opportunities in your life. Fast-moving planets like Moon and Mercury affect daily moods, while slow-moving Saturn and Jupiter define major chapters.
            </p>
          </div>
        </div>

        {/* Right Column: Transit Cards */}
        <div className="lg:col-span-7">
          <div className="grid grid-cols-1 gap-8">
            {transitData.planets.map((planet, idx) => {
              const statusMap: Record<string, "Opportunity" | "Caution" | "Neutral"> = {
                Favorable: "Opportunity",
                Challenging: "Caution",
                Neutral: "Neutral"
              };
              
              return (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  key={planet.name}
                >
                  <IntelligenceCard
                    title={planet.name}
                    subtitle={`Transit: ${planet.sign} · ${planet.house}th House`}
                    status={statusMap[planet.favorability] || "Neutral"}
                    icon={(planetIcons[planet.name] || Sparkles) as LucideIcon}
                  >
                    <div className="space-y-6">
                       <div className="flex items-center justify-between">
                          <div className="flex items-baseline gap-2">
                             <span className="text-2xl font-serif text-white tracking-tighter">{planet.sign}</span>
                             <span className="text-[10px] text-zinc-600 font-black uppercase tracking-tighter">Cluster</span>
                          </div>
                          <div className={`px-3 py-1 rounded-sm text-[9px] font-black uppercase tracking-widest border ${
                            planet.favorability === 'Favorable' ? "border-gold/30 bg-gold/5 text-gold" :
                            planet.favorability === 'Challenging' ? "border-red-900/30 bg-red-950/10 text-red-500" :
                            "border-zinc-800 bg-zinc-900 text-zinc-500"
                          }`}>
                            {planet.favorability} Aspect
                          </div>
                       </div>
                       
                       <p className="text-xs text-zinc-400 leading-relaxed italic group-hover:text-zinc-300 transition-colors">
                          {planet.impact}
                       </p>
                    </div>
                  </IntelligenceCard>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
