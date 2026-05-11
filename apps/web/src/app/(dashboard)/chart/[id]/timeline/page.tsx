"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Sun, Moon, Star, Shield, 
  Clock, Users, Heart,
  ChevronDown, ChevronUp, AlertCircle,
  RefreshCw, Globe, Sparkles
} from "lucide-react";
import { useDasha } from "@/hooks/useDasha";
import { ChartShell } from "@/components/ChartShell";
import type { DashaPeriod } from "@/types/dasha";

const PLANET_DATA: Record<string, { icon: React.ElementType, color: string, meaning: string }> = {
  Sun: { icon: Sun, color: "text-gold", meaning: "Authority, father, self-confidence, government, health" },
  Moon: { icon: Moon, color: "text-white", meaning: "Mind, mother, emotions, public life, travel" },
  Mars: { icon: Shield, color: "text-gold/90", meaning: "Energy, siblings, property, courage, conflict" },
  Rahu: { icon: Globe, color: "text-gold/60", meaning: "Ambition, foreign, technology, obsession, illusion" },
  Jupiter: { icon: Star, color: "text-gold", meaning: "Wisdom, growth, children, teachers, spirituality" },
  Saturn: { icon: Clock, color: "text-gray-400", meaning: "Discipline, karma, delays, service, longevity" },
  Mercury: { icon: Users, color: "text-gold/80", meaning: "Communication, business, intelligence, skin, friends" },
  Ketu: { icon: Sparkles, color: "text-gold/70", meaning: "Spirituality, detachment, past life, mysticism, loss" },
  Venus: { icon: Heart, color: "text-white/90", meaning: "Love, luxury, arts, marriage, vehicles, beauty" },
};

export default function DashaTimelinePage() {
  const { data, isLoading, error, retry } = useDasha();

  if (isLoading) {
    return (
      <ChartShell>
        <div className="space-y-8 animate-pulse px-8">
          <div className="h-48 w-full bg-white/5 rounded-xl border border-gold/10" />
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-16 w-full bg-white/5 rounded-lg" />
            ))}
          </div>
        </div>
      </ChartShell>
    );
  }

  if (error) {
    return (
      <ChartShell>
        <div className="flex flex-col items-center justify-center py-20 text-center px-8">
          <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">Failed to load timeline</h2>
          <p className="text-gray-400 mb-6 max-w-md">{error}</p>
          <button 
            onClick={retry}
            className="flex items-center gap-2 px-6 py-3 bg-gold text-black font-bold rounded-lg hover:bg-gold/80 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Retry
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
      <div className="max-w-5xl mx-auto px-4 sm:px-8 pb-20 space-y-12">
        
        {/* Section 1: Hero Card */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-2xl border-2 border-gold/30 bg-gradient-to-br from-black to-gold/5 p-6 sm:p-10 shadow-[0_0_50px_-12px_rgba(201,168,76,0.2)]"
        >
          <div className="flex flex-col sm:flex-row items-center gap-8 relative z-10">
            {/* Planet Icon */}
            <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center shrink-0">
              {React.createElement(PLANET_DATA[currentMaha.lord]?.icon || Star, { 
                className: `w-12 h-12 sm:w-16 sm:h-16 ${PLANET_DATA[currentMaha.lord]?.color || "text-gold"}` 
              })}
            </div>

            {/* Text Content */}
            <div className="flex-1 text-center sm:text-left space-y-2">
              <div className="flex flex-col sm:flex-row sm:items-baseline gap-2">
                <h1 className="text-4xl sm:text-6xl font-black text-gold uppercase tracking-tighter">
                  {currentMaha.lord}
                </h1>
                <span className="text-sm font-mono text-gold/60 uppercase tracking-widest">
                  Mahadasha
                </span>
              </div>
              
              <div className="flex flex-wrap justify-center sm:justify-start items-center gap-x-4 gap-y-1">
                <p className="text-xl sm:text-2xl font-bold text-white/90">
                  {currentAntar.lord} <span className="text-xs font-mono text-white/40 uppercase tracking-widest ml-1">Antardasha</span>
                </p>
                <div className="h-1 w-1 rounded-full bg-gold/30 hidden sm:block" />
                <p className="text-sm font-mono text-white/60">
                  {new Date(currentMaha.start).toLocaleDateString()} → {new Date(currentMaha.end).toLocaleDateString()}
                </p>
              </div>

              {/* Progress Bar */}
              <div className="mt-6 space-y-2">
                <div className="flex justify-between text-[10px] font-mono text-gold/60 uppercase tracking-widest">
                  <span>Progress</span>
                  <span>{currentMaha.percent_complete}%</span>
                </div>
                <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${currentMaha.percent_complete}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="h-full bg-gold shadow-[0_0_10px_rgba(201,168,76,0.5)]"
                  />
                </div>
              </div>

              {/* Plain English Meaning */}
              <p className="mt-6 text-sm sm:text-base text-white/70 leading-relaxed max-w-2xl italic">
                &ldquo;{PLANET_DATA[currentMaha.lord]?.meaning.split(',')[0]} period favors {PLANET_DATA[currentMaha.lord]?.meaning.split(',').slice(1).join(',')}. 
                You are in a {currentAntar.lord} sub-period — {PLANET_DATA[currentAntar.lord]?.meaning.toLowerCase()} are themes.&rdquo;
              </p>
            </div>
          </div>
          
          {/* Decorative Background Element */}
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-gold/5 rounded-full blur-3xl" />
        </motion.section>

        {/* Section 2: Full Timeline */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-mono text-gold uppercase tracking-[0.3em] font-black">
              Full Vimshottari Timeline
            </h2>
            <span className="text-[10px] font-mono text-white/30 uppercase">120 Year Cycle</span>
          </div>

          <div className="relative">
            {/* Vertical Line */}
            <div className="absolute left-[19px] top-0 bottom-0 w-[1px] bg-gold/10" />

            <div className="space-y-4">
              {data.full_dasha_tree.map((maha, idx) => (
                <MahadashaRow 
                  key={maha.lord + maha.start} 
                  maha={maha} 
                  isCurrent={maha.lord === currentMaha.lord} 
                  isPast={new Date(maha.end) < new Date()}
                  idx={idx}
                />
              ))}
            </div>
          </div>
        </section>
      </div>
    </ChartShell>
  );
}

function MahadashaRow({ maha, isCurrent, isPast, idx }: { 
  maha: DashaPeriod, 
  isCurrent: boolean, 
  isPast: boolean,
  idx: number 
}) {
  const [isExpanded, setIsExpanded] = useState(isCurrent);
  const isFuture = !isCurrent && !isPast;

  return (
    <motion.div 
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: isPast ? 0.5 : 1, x: 0 }}
      transition={{ delay: idx * 0.05 }}
      className={`relative pl-12 group`}
    >
      {/* Timeline Dot */}
      <div className={`absolute left-0 w-10 h-10 flex items-center justify-center z-10 transition-transform ${isExpanded ? 'scale-110' : ''}`}>
        <div className={`w-3 h-3 rounded-full border-2 transition-all duration-500 ${
          isCurrent ? 'bg-gold border-gold shadow-[0_0_10px_#C9A84C]' : 
          isPast ? 'bg-black border-gold/20' : 
          'bg-black border-white/40 group-hover:border-gold/50'
        }`} />
      </div>

      {/* Main Row Content */}
      <div 
        onClick={() => setIsExpanded(!isExpanded)}
        className={`cursor-pointer rounded-xl border p-4 transition-all duration-300 ${
          isCurrent 
            ? 'border-gold/40 bg-gold/5 shadow-[inset_0_0_20px_rgba(201,168,76,0.05)]' 
            : 'border-white/5 bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/10'
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {React.createElement(PLANET_DATA[maha.lord]?.icon || Star, { 
              className: `w-5 h-5 ${isCurrent ? 'text-gold' : isFuture ? 'text-white/80' : 'text-white/40'}` 
            })}
            <div>
              <h3 className={`text-lg font-black uppercase tracking-tighter ${
                isCurrent ? 'text-gold' : isFuture ? 'text-white' : 'text-white/50'
              }`}>
                {maha.lord}
              </h3>
              <p className="text-[10px] font-mono text-white/30 uppercase tracking-widest">
                {maha.duration_years} Years
              </p>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-mono text-white/60">
                {new Date(maha.start).getFullYear()} — {new Date(maha.end).getFullYear()}
              </p>
              <p className="text-[10px] font-mono text-white/30 uppercase">
                {new Date(maha.start).toLocaleDateString(undefined, { month: 'short' })} → {new Date(maha.end).toLocaleDateString(undefined, { month: 'short' })}
              </p>
            </div>
            {isExpanded ? <ChevronUp className="w-4 h-4 text-gold/50" /> : <ChevronDown className="w-4 h-4 text-white/20" />}
          </div>
        </div>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="mt-6 pt-6 border-t border-white/5 grid grid-cols-1 sm:grid-cols-3 gap-3">
                {maha.sub_periods?.map((sub: DashaPeriod) => (
                  <AntardashaTile key={sub.lord + sub.start} sub={sub} />
                ))}
              </div>
              <p className="mt-4 text-[10px] font-mono text-gold/40 italic text-center uppercase tracking-widest">
                {PLANET_DATA[maha.lord]?.meaning}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

function AntardashaTile({ sub }: { sub: DashaPeriod }) {
  const isCurrentSub = new Date(sub.start) <= new Date() && new Date() < new Date(sub.end);
  const isPastSub = new Date(sub.end) < new Date();
  
  return (
    <div className={`p-3 rounded-lg border flex flex-col gap-1 transition-all ${
      isCurrentSub 
        ? 'border-gold/30 bg-gold/10' 
        : 'border-white/5 bg-white/5'
    } ${isPastSub ? 'opacity-40' : 'opacity-100'}`}>
      <div className="flex justify-between items-center">
        <span className={`text-xs font-bold uppercase ${isCurrentSub ? 'text-gold' : 'text-white/80'}`}>
          {sub.lord}
        </span>
        {isCurrentSub && (
          <span className="flex h-1.5 w-1.5 rounded-full bg-gold animate-pulse" />
        )}
      </div>
      <div className="flex justify-between items-baseline text-[9px] font-mono text-white/40 uppercase">
        <span>{new Date(sub.start).toLocaleDateString(undefined, { month: 'short', year: '2-digit' })}</span>
        <span>{sub.duration_years.toFixed(1)}y</span>
      </div>
      
      {/* Tooltip on hover/click - using a simple title attribute for now, or could expand to complex UI */}
      <div className="mt-2 text-[8px] text-white/30 leading-tight group-hover:text-white/50 transition-colors">
        {PLANET_DATA[sub.lord]?.meaning.split(',').slice(0, 2).join(',')}...
      </div>
    </div>
  );
}
