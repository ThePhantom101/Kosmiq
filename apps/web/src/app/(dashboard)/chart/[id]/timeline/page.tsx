"use client";

import React from "react";
import { motion } from "framer-motion";
import { 
  Sun, Moon, Star, Shield, 
  Clock, Users, Heart,
  AlertCircle,
  RefreshCw, Globe, Sparkles,
  ChevronRight,
  LucideIcon
} from "lucide-react";
import { useDasha } from "@/hooks/useDasha";
import { ChartShell } from "@/components/ChartShell";
import { VimshottariTimeline } from "@/components/dashboard/VimshottariTimeline";
import { IntelligenceCard } from "@/components/dashboard/IntelligenceCard";

const PLANET_DATA: Record<string, { icon: LucideIcon, color: string, meaning: string }> = {
  Sun: { icon: Sun, color: "text-gold", meaning: "Authority, father, self-confidence, government, health" },
  Moon: { icon: Moon, color: "text-white", meaning: "Mind, mother, emotions, public life, travel" },
  Mars: { icon: Shield, color: "text-red-400", meaning: "Energy, siblings, property, courage, conflict" },
  Rahu: { icon: Globe, color: "text-blue-400", meaning: "Ambition, foreign, technology, obsession, illusion" },
  Jupiter: { icon: Star, color: "text-gold", meaning: "Wisdom, growth, children, teachers, spirituality" },
  Saturn: { icon: Clock, color: "text-zinc-500", meaning: "Discipline, karma, delays, service, longevity" },
  Mercury: { icon: Users, color: "text-gold/80", meaning: "Communication, business, intelligence, skin, friends" },
  Ketu: { icon: Sparkles, color: "text-zinc-400", meaning: "Spirituality, detachment, past life, mysticism, loss" },
  Venus: { icon: Heart, color: "text-white/90", meaning: "Love, luxury, arts, marriage, vehicles, beauty" },
};

export default function DashaTimelinePage() {
  const { data, isLoading, error, retry } = useDasha();

  if (isLoading) {
    return (
      <ChartShell>
        <div className="space-y-12 animate-pulse px-8">
          <div className="h-64 w-full bg-white/5 rounded-sm border border-gold/10" />
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-24 w-full bg-white/5 rounded-sm" />
            ))}
          </div>
        </div>
      </ChartShell>
    );
  }

  if (error) {
    return (
      <ChartShell>
        <div className="flex flex-col items-center justify-center py-32 text-center px-8">
          <AlertCircle className="w-16 h-16 text-red-400/20 mb-6" />
          <h2 className="text-2xl font-serif text-white mb-2 tracking-tight uppercase">Timeline Unavailable</h2>
          <p className="text-zinc-500 mb-8 max-w-md text-xs">{error}</p>
          <button 
            onClick={retry}
            className="flex items-center gap-2 px-8 py-4 bg-gold text-black font-bold rounded-sm uppercase tracking-widest text-[10px] hover:bg-gold/80 transition-all"
          >
            <RefreshCw className="w-4 h-4" />
            Recalibrate Cycles
          </button>
        </div>
      </ChartShell>
    );
  }

  if (!data) return null;

  const currentMaha = data.current_mahadasha;
  const currentAntar = data.current_antardasha;

  return (
    <ChartShell>
      <div className="max-w-5xl mx-auto px-4 sm:px-8 pb-32 space-y-16">
        
        {/* Header & Status */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 pt-8">
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <span className="overline-label text-gold/60">Karmic Trajectory</span>
              <div className="h-[1px] w-8 bg-gold/20" />
            </div>
            <h1 className="text-5xl font-serif text-white tracking-tight uppercase">
              Life <span className="text-gold">Timelines</span>
            </h1>
            <p className="text-zinc-500 max-w-xl text-xs font-medium leading-relaxed uppercase tracking-widest">
              The 120-year cycle of planetary maturity and influence.
            </p>
          </div>

          <div className="hud-module p-6 bg-gold/[0.03] border border-gold/20 min-w-[280px]">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] text-gold uppercase font-black tracking-widest">Active Influence</span>
              <div className="flex h-2 w-2 rounded-full bg-gold animate-pulse" />
            </div>
            <div className="space-y-1">
              <h3 className="text-2xl font-serif text-white">{currentMaha.lord}</h3>
              <p className="text-[10px] text-zinc-500 font-mono uppercase tracking-widest">
                {currentAntar.lord} Sub-period
              </p>
            </div>
          </div>
        </div>

        {/* Hero Card: Deep Insights */}
        <IntelligenceCard
          title={`${currentMaha.lord} — ${currentAntar.lord} Period`}
          subtitle="Synthesis of Current Cycle"
          status="Transition"
          icon={PLANET_DATA[currentMaha.lord]?.icon || Star}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="space-y-6">
              <div className="p-5 bg-white/[0.03] border border-white/10 rounded-sm relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-1 h-full bg-gold opacity-30" />
                <p className="text-sm text-zinc-300 leading-relaxed italic">
                  &ldquo;This {currentMaha.lord} phase emphasizes {PLANET_DATA[currentMaha.lord]?.meaning.toLowerCase()}. 
                  The current {currentAntar.lord} antardasha funnels this energy into {PLANET_DATA[currentAntar.lord]?.meaning.toLowerCase()}.&rdquo;
                </p>
              </div>
              
              <div className="flex items-center justify-between px-2">
                <div className="flex flex-col">
                  <span className="text-[9px] text-zinc-600 uppercase font-bold tracking-widest">Start Date</span>
                  <span className="text-xs text-white font-mono">{new Date(currentMaha.start).toLocaleDateString()}</span>
                </div>
                <div className="flex flex-col text-right">
                  <span className="text-[9px] text-zinc-600 uppercase font-bold tracking-widest">End Date</span>
                  <span className="text-xs text-white font-mono">{new Date(currentMaha.end).toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between text-[10px] font-mono text-gold/60 uppercase tracking-widest">
                  <span>Maturity Progress</span>
                  <span>{currentMaha.percent_complete}%</span>
                </div>
                <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${currentMaha.percent_complete}%` }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className="h-full bg-gold shadow-[0_0_15px_rgba(197,160,89,0.3)]"
                  />
                </div>
              </div>

              <div className="flex items-center gap-4 pt-4">
                <button className="flex-1 px-4 py-3 bg-white/5 border border-white/10 text-[10px] text-white uppercase font-black tracking-widest hover:bg-white/10 transition-all flex items-center justify-center gap-2">
                  View Remedies
                  <ChevronRight className="w-3 h-3" />
                </button>
                <button className="flex-1 px-4 py-3 bg-white/5 border border-white/10 text-[10px] text-white uppercase font-black tracking-widest hover:bg-white/10 transition-all flex items-center justify-center gap-2">
                  Detailed Report
                  <ChevronRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        </IntelligenceCard>

        {/* Full Interactive Timeline */}
        <section className="space-y-8">
          <div className="flex items-center justify-between border-b border-gold/10 pb-4">
            <h2 className="text-xs font-mono text-gold uppercase tracking-[0.4em] font-black">
              120 Year Evolutionary Sequence
            </h2>
            <div className="flex items-center gap-4 text-[10px] text-zinc-600 uppercase font-bold tracking-widest">
              <span>Past</span>
              <div className="w-8 h-[1px] bg-zinc-800" />
              <span className="text-gold">Present</span>
              <div className="w-8 h-[1px] bg-zinc-800" />
              <span>Future</span>
            </div>
          </div>

          <VimshottariTimeline 
            mahadashas={data.full_dasha_tree} 
            currentMahaLord={currentMaha.lord} 
          />
        </section>

      </div>
    </ChartShell>
  );
}
