"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useAstro } from "@/context/AstroContext";
import { ChartShell } from "@/components/ChartShell";
import { IntelligenceCard } from "@/components/dashboard/IntelligenceCard";
import { RadarStrengthChart } from "@/components/dashboard/RadarStrengthChart";
import { 
  Zap, 
  BarChart3, 
  Shield, 
  Info, 
  AlertCircle,
  ChevronRight,
  TrendingUp,
  Activity
} from "lucide-react";

// --- Constants & Types ---

const HOUSE_THEMES = [
  "Self", "Wealth", "Siblings", "Home", "Children", "Health",
  "Partner", "Transformation", "Wisdom", "Career", "Network", "Liberation"
];

const PLANET_ORDER = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn"];

interface ShadbalaPlanet {
  total: number;
  sub_scores: Record<string, number>;
}

interface ShadbalaData {
  planets: Record<string, ShadbalaPlanet>;
  summary: string;
}

export default function StrengthsPage() {
  const params = useParams<{ id: string }>();
  const id = params?.id ?? "me";
  const { data: astroData } = useAstro();
  
  const [shadbala, setShadbala] = useState<ShadbalaData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchShadbala = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      let res;
      if (id === "me") {
        if (!astroData?.chart?.metadata) throw new Error("No chart data found in sanctuary");
        res = await fetch(`/api/chart/me/shadbala`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(astroData.chart.metadata),
        });
      } else {
        res = await fetch(`/api/chart/${id}/shadbala`);
      }

      if (!res.ok) throw new Error("Connection failed");
      setShadbala(await res.json());
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [id, astroData]);

  useEffect(() => {
    fetchShadbala();
  }, [fetchShadbala]);

  const radarData = useMemo(() => {
    if (!shadbala) return [];
    return PLANET_ORDER.map(p => ({
      label: p,
      value: shadbala.planets[p]?.total || 0
    }));
  }, [shadbala]);

  if (loading) {
    return (
      <ChartShell>
        <div className="max-w-5xl mx-auto px-8 space-y-12 animate-pulse">
          <div className="h-10 w-64 bg-white/5 rounded" />
          <div className="h-[400px] w-full bg-white/5 rounded-sm border border-gold/10" />
        </div>
      </ChartShell>
    );
  }

  return (
    <ChartShell>
      <div className="max-w-5xl mx-auto px-4 sm:px-8 pb-32 space-y-16">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 pt-8 border-b border-white/5 pb-8">
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <span className="overline-label text-gold/60">Energetic Quantization</span>
              <div className="h-[1px] w-8 bg-gold/20" />
            </div>
            <h1 className="text-5xl font-serif text-white tracking-tight uppercase">
              Shadbala <span className="text-gold">Energy</span>
            </h1>
            <p className="text-zinc-500 max-w-xl text-xs font-medium leading-relaxed uppercase tracking-widest">
              Mapping the weighted strength of every cosmic influence in your field.
            </p>
          </div>

          <div className="flex items-center gap-4 bg-white/5 px-6 py-3 border border-white/10 rounded-sm">
             <div className="flex flex-col items-end">
                <span className="text-[10px] text-zinc-500 uppercase font-bold">System Status</span>
                <span className="text-sm font-black text-gold uppercase tracking-tighter">Diagnostic Active</span>
             </div>
             <div className="h-8 w-[1px] bg-white/10" />
             <Zap className="w-5 h-5 text-gold/40" />
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-12"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <RadarStrengthChart data={radarData} size={380} />
            
            <div className="space-y-6">
              <IntelligenceCard
                title="Energy Synthesis"
                subtitle="Shadbala Overview"
                status="Opportunity"
                icon={TrendingUp}
              >
                <p className="text-sm text-zinc-300 leading-relaxed mb-6">
                  {shadbala?.summary || "Planetary resonance is balanced. Higher spikes indicate areas of natural dominance and karmic ease."}
                </p>
                
                <div className="space-y-4">
                  {radarData.map((p: any) => (
                    <div key={p.label} className="flex items-center justify-between p-3 bg-white/[0.02] border border-white/5 group hover:border-gold/20 transition-all">
                      <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400 group-hover:text-white w-20">{p.label}</span>
                      <div className="flex items-center gap-4 flex-1 mx-4">
                         <div className="h-[1px] flex-1 bg-white/5 relative">
                            <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: `${p.value}%` }}
                              className="absolute top-0 left-0 h-full bg-gold/40"
                            />
                         </div>
                      </div>
                      <span className="text-xs font-mono text-gold">{p.value}</span>
                    </div>
                  ))}
                </div>
              </IntelligenceCard>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
             <IntelligenceCard
                title="Dominant Planet"
                subtitle="Primary Influence"
                status="Opportunity"
                icon={Shield}
             >
                <p className="text-xs text-zinc-500 leading-relaxed uppercase tracking-wider">
                  The planet with the highest Shadbala score represents your most reliable energetic resource and the lens through which you most easily manifest your intentions.
                </p>
             </IntelligenceCard>

             <IntelligenceCard
                title="Diagnostic Focus"
                subtitle="Refinement Areas"
                status="Caution"
                icon={AlertCircle}
             >
                <p className="text-xs text-zinc-500 leading-relaxed uppercase tracking-wider">
                  Lower scores indicate planets that may be "underpowered" in the chart, requiring more conscious cultivation or external support to function at their peak.
                </p>
             </IntelligenceCard>
          </div>
        </motion.div>

      </div>
    </ChartShell>
  );
}
