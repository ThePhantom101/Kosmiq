"use client";

import React, { useMemo } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { useAstro } from "@/context/AstroContext";
import { ChartShell } from "@/components/ChartShell";
import { IntelligenceCard } from "@/components/dashboard/IntelligenceCard";
import { RadarStrengthChart } from "@/components/dashboard/RadarStrengthChart";
import { 
  BarChart3, 
  Activity, 
  AlertCircle,
  TrendingUp,
  LayoutGrid,
  Sparkles
} from "lucide-react";

const HOUSE_THEMES = [
  "Self", "Wealth", "Siblings", "Home", "Children", "Health",
  "Partner", "Transformation", "Wisdom", "Career", "Network", "Liberation"
];

export default function AshtakavargaPage() {
  const params = useParams<{ id: string }>();
  const { data: astroData } = useAstro();
  
  const houseTotals = useMemo(() => {
    const avData = (astroData?.chart?.ashtakavarga as any)?.house_totals;
    return avData || {
      "1": 28, "2": 24, "3": 31, "4": 22, "5": 29, "6": 33,
      "7": 21, "8": 19, "9": 35, "10": 26, "11": 38, "12": 23
    };
  }, [astroData]);

  const radarData = useMemo(() => {
    return HOUSE_THEMES.map((theme, i) => ({
      label: `H${i+1}`,
      value: (houseTotals[String(i + 1)] / 40) * 100 // Normalize against a max of 40 bindus
    }));
  }, [houseTotals]);

  const rankedHouses = useMemo(() => {
    return Object.entries(houseTotals)
      .map(([num, score]) => ({ 
        num: parseInt(num), 
        score: score as number, 
        theme: HOUSE_THEMES[parseInt(num)-1] 
      }))
      .sort((a, b) => b.score - a.score);
  }, [houseTotals]);

  const strongestHouses = rankedHouses.slice(0, 3);
  const weakestHouses = rankedHouses.slice(-3).reverse();

  return (
    <ChartShell>
      <div className="max-w-6xl mx-auto px-4 sm:px-8 pb-32 space-y-20">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 pt-8 border-b border-white/5 pb-8">
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <span className="overline-label text-gold/60">Ashtakavarga Resonance</span>
              <div className="h-[1px] w-8 bg-gold/20" />
            </div>
            <h1 className="text-5xl font-serif text-white tracking-tight uppercase">
              Sectoral <span className="text-gold">Potency</span>
            </h1>
            <p className="text-zinc-500 max-w-xl text-xs font-medium leading-relaxed uppercase tracking-widest">
              A collective numerical evaluation of planetary support across the twelve domains of life.
            </p>
          </div>
          
          <div className="flex items-center gap-4 bg-white/5 px-6 py-3 border border-white/10 rounded-sm">
             <div className="flex flex-col items-end">
                <span className="text-[10px] text-zinc-500 uppercase font-bold">Average Bindus</span>
                <span className="text-xl font-mono text-gold">28.5</span>
             </div>
             <div className="h-8 w-[1px] bg-white/10" />
             <LayoutGrid className="w-5 h-5 text-gold/40" />
          </div>
        </div>

        {/* Visual Diagnostics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
           <div className="relative">
              <div className="absolute inset-0 bg-gold/5 blur-[120px] rounded-full" />
              <RadarStrengthChart data={radarData} size={450} />
           </div>

           <div className="space-y-8">
              <IntelligenceCard
                title="Field Signature"
                subtitle="Energy Distribution"
                status="Opportunity"
                icon={Sparkles}
              >
                <p className="text-sm text-zinc-300 leading-relaxed">
                  The radar chart visualizes the "shape" of your karmic field. Symmetrical distribution indicates a balanced life, while sharp peaks represent specialized genius or high-yield sectors.
                </p>
                
                <div className="mt-8 grid grid-cols-2 gap-4">
                   <div className="p-4 bg-white/[0.02] border border-white/5 rounded-sm">
                      <div className="text-[10px] text-zinc-500 uppercase font-black tracking-widest mb-1">Max Expansion</div>
                      <div className="text-xl font-serif text-gold">{rankedHouses[0].theme}</div>
                   </div>
                   <div className="p-4 bg-white/[0.02] border border-white/5 rounded-sm">
                      <div className="text-[10px] text-zinc-500 uppercase font-black tracking-widest mb-1">Core Contrast</div>
                      <div className="text-xl font-serif text-white">{rankedHouses[rankedHouses.length-1].theme}</div>
                   </div>
                </div>
              </IntelligenceCard>
           </div>
        </div>

        {/* House Grid */}
        <div className="space-y-8">
          <h3 className="overline-label text-zinc-600 flex items-center gap-3">
            <div className="h-[1px] w-6 bg-zinc-800" />
            Domain Analysis Grid
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
            {HOUSE_THEMES.map((theme, i) => {
              const score = houseTotals[String(i + 1)] || 0;
              const isStrong = score >= 28;
              const isWeak = score < 20;

              return (
                <motion.div
                  key={theme}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.05 }}
                  className={`hud-module group relative p-6 flex flex-col items-center justify-center gap-4 transition-all duration-500 border ${
                    isStrong 
                      ? 'border-gold/30 bg-gold/[0.03] shadow-[0_0_30px_rgba(197,160,89,0.03)]' 
                      : isWeak 
                        ? 'border-red-900/20 bg-red-950/10'
                        : 'border-white/5 bg-white/[0.01]'
                  } hover:border-gold/50`}
                >
                  <span className="text-[10px] font-mono text-zinc-600 uppercase group-hover:text-gold/60 transition-colors">H{i+1}</span>
                  
                  <div className="relative">
                     <div className="text-4xl font-serif text-white group-hover:scale-110 transition-transform duration-500">{score}</div>
                     {isStrong && (
                       <div className="absolute -top-1 -right-4">
                          <TrendingUp className="w-3 h-3 text-gold animate-pulse" />
                       </div>
                     )}
                  </div>

                  <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest group-hover:text-gold transition-colors">{theme}</span>
                  
                  <div className="w-full space-y-1">
                    <div className="flex justify-between text-[8px] font-mono text-zinc-700 uppercase">
                      <span>Power</span>
                      <span>{Math.round((score/56)*100)}%</span>
                    </div>
                    <div className="w-full h-[1px] bg-white/5 overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${(score / 56) * 100}%` }}
                        className={`h-full ${isStrong ? 'bg-gold' : isWeak ? 'bg-red-500/50' : 'bg-white/40'}`}
                      />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Intelligence Insights */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-8 border-t border-white/5">
          <div className="space-y-8">
            <h3 className="overline-label text-gold/40 flex items-center gap-3">
              <div className="h-[1px] w-6 bg-gold/20" />
              Strategic Advantage
            </h3>
            <div className="space-y-4">
              {strongestHouses.map((h, i) => (
                <div key={h.num} className="flex items-center justify-between p-6 bg-white/[0.02] border border-white/5 group hover:border-gold/30 transition-all rounded-sm">
                  <div className="flex items-center gap-6">
                    <span className="text-3xl font-serif text-gold/10 group-hover:text-gold/20 transition-colors">0{i + 1}</span>
                    <div>
                      <div className="text-sm font-bold text-white uppercase tracking-widest">{h.theme}</div>
                      <div className="text-[10px] text-zinc-600 font-medium mt-1">Primary Strength Cluster</div>
                    </div>
                  </div>
                  <div className="text-2xl font-mono font-bold text-gold">{h.score}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-8">
            <h3 className="overline-label text-zinc-600 flex items-center gap-3">
              <div className="h-[1px] w-6 bg-zinc-800" />
              Growth Thresholds
            </h3>
            <div className="space-y-4">
              {weakestHouses.map((h, i) => (
                <div key={h.num} className="flex items-center justify-between p-6 bg-white/[0.01] border border-white/5 group hover:border-white/10 transition-all opacity-60 hover:opacity-100 rounded-sm">
                  <div className="flex items-center gap-6">
                    <span className="text-3xl font-serif text-zinc-800 group-hover:text-zinc-700 transition-colors">0{i + 1}</span>
                    <div>
                      <div className="text-sm font-bold text-zinc-400 uppercase tracking-widest">{h.theme}</div>
                      <div className="text-[10px] text-zinc-600 font-medium mt-1">Conscious Evolution Required</div>
                    </div>
                  </div>
                  <div className="text-2xl font-mono font-bold text-zinc-500">{h.score}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <IntelligenceCard
            title="Statistical Probability"
            subtitle="Realization Factor"
            status="Opportunity"
            icon={Activity}
          >
            <p className="text-xs text-zinc-500 leading-relaxed uppercase tracking-wider">
              Bindu counts indicate the ease with which planets in a specific house can manifest their results. Scores above 28 suggest high "Realization Efficiency".
            </p>
          </IntelligenceCard>

          <IntelligenceCard
            title="Mitigation Strategy"
            subtitle="Low Yield Sectors"
            status="Caution"
            icon={AlertCircle}
          >
            <p className="text-xs text-zinc-500 leading-relaxed uppercase tracking-wider">
              Sectors with scores below 20 represent "Energy Leakage". These areas require more discipline and specific astrological remedies to stabilize.
            </p>
          </IntelligenceCard>
        </div>

      </div>
    </ChartShell>
  );
}
