"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { 
  Briefcase, 
  Heart, 
  Zap, 
  Coins, 
  BookOpen, 
  Compass, 
  ArrowUpRight, 
  ArrowRight, 
  ArrowDownRight,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Calendar,
  Sparkles,
  ShieldCheck,
  AlertCircle
} from "lucide-react";
import Link from "next/link";
import { IntelligenceCard } from "@/components/dashboard/IntelligenceCard";
import { useAstro } from "@/context/AstroContext";
import type { LucideIcon } from "lucide-react";
import { 
  MonthlyForecastResponse 
} from "@/types/astro";
import { format, addMonths, subMonths, startOfMonth, parseISO } from "date-fns";
import { Suspense } from "react";

const domainIcons: Record<string, React.ElementType> = {
  "Career & Status": Briefcase,
  "Relationships & Love": Heart,
  "Health & Vitality": Zap,
  "Wealth & Resources": Coins,
  "Creativity & Learning": BookOpen,
  "Spirituality & Growth": Compass,
};

function MonthlyForecastSkeleton() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <Loader2 className="w-8 h-8 text-gold animate-spin" />
      <p className="text-gray-400 font-medium tracking-widest uppercase text-xs">Aligning the Stars...</p>
    </div>
  );
}

function MonthlyForecastContent() {
  const { data: natalData } = useAstro();
  const searchParams = useSearchParams();
  const router = useRouter();
  const params = useParams<{ id?: string }>();
  
  const id = params?.id || "me";
  const initialMonth = searchParams.get("month") || format(new Date(), "yyyy-MM");
  
  const [currentMonth, setCurrentMonth] = useState(initialMonth);
  const [forecast, setForecast] = useState<MonthlyForecastResponse | null>(null);
  const [narrative, setNarrative] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [narrativeLoading, setNarrativeLoading] = useState(true);

  const fetchNarrative = useCallback(async (month: string, forecastData: MonthlyForecastResponse) => {
    try {
      const response = await fetch("/api/predictions/monthly-narrative", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          month,
          transit_summary: forecastData.domain_scores.map(d => `${d.name}: ${d.insight}`).join(". "),
          current_dasha: forecastData.dasha_context
        }),
      });

      if (!response.ok) throw new Error("Failed to fetch narrative");
      const data = await response.json();
      setNarrative(data.narrative);
    } catch (err) {
      console.error("Narrative fetch error:", err);
      setNarrative("AI narrative is currently unavailable. Please check back shortly.");
    } finally {
      setNarrativeLoading(false);
    }
  }, []);

  const fetchForecast = useCallback(async (month: string) => {
    try {
      let response;
      if (id === "me" && natalData) {
        response = await fetch(`/api/predictions/monthly?month=${month}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ chart_data: natalData.chart }),
        });
      } else {
        response = await fetch(`/api/predictions/monthly?chart_id=${id}&month=${month}`);
      }

      if (!response.ok) throw new Error("Failed to fetch forecast");
      const data = await response.json();
      setForecast(data);
      
      const isFutureMonth = parseISO(`${month}-01`) > startOfMonth(new Date());
      if (!isFutureMonth) {
        fetchNarrative(month, data);
      } else {
        setNarrative("Detailed personal narratives are generated at the start of each month. Check back as the date approaches for your deep-dive reading.");
        setNarrativeLoading(false);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [id, natalData, fetchNarrative]);

  useEffect(() => {
    fetchForecast(currentMonth);
  }, [currentMonth, fetchForecast]);

  const handleMonthChange = (direction: "prev" | "next" | "current") => {
    const baseDate = parseISO(`${currentMonth}-01`);
    let newDate;
    if (direction === "prev") newDate = subMonths(baseDate, 1);
    else if (direction === "next") newDate = addMonths(baseDate, 1);
    else newDate = new Date();

    const newMonthStr = format(newDate, "yyyy-MM");
    setLoading(true);
    setNarrativeLoading(true);
    setCurrentMonth(newMonthStr);
    router.push(`/predictions/monthly?month=${newMonthStr}`);
  };

  if (loading && !forecast) {
    return <MonthlyForecastSkeleton />;
  }

  if (!natalData?.chart && id === "me") {
    return (
      <div className="h-[70vh] flex flex-col items-center justify-center text-center space-y-8 max-w-md mx-auto">
        <div className="relative">
          <div className="absolute inset-0 bg-gold/20 blur-2xl rounded-full animate-pulse" />
          <Calendar className="w-16 h-16 text-gold/40 relative z-10" />
        </div>
        
        <div className="space-y-3">
          <h2 className="text-2xl font-serif text-gold uppercase tracking-tight">
            Fate Awaits Initialization
          </h2>
          <p className="text-sm text-gray-500 leading-relaxed uppercase tracking-widest font-bold opacity-50">
            Monthly forecasts require your birth blueprint to calculate transit influences.
          </p>
        </div>

        <Link
          href="/new-chart"
          className="hud-button px-10 py-4 bg-gold text-black text-[10px] font-black uppercase tracking-[0.2em]"
        >
          Generate Your Chart
        </Link>
      </div>
    );
  }

  const monthName = format(parseISO(`${currentMonth}-01`), "MMMM yyyy");
  const isFuture = parseISO(`${currentMonth}-01`) > startOfMonth(new Date());

  return (
    <div className="max-w-6xl mx-auto space-y-24 pb-32 pt-8 px-4 sm:px-8">
      {/* HEADER: CELESTIAL ALIGNMENT */}
      <section className="relative flex flex-col lg:flex-row items-center gap-16 pb-16 border-b border-white/5">
        <div className="relative w-64 h-64 shrink-0">
          {/* Outer Ring */}
          <div className="absolute inset-0 rounded-full border border-gold/10 scale-110" />
          <div className="absolute inset-0 rounded-full border border-white/5 scale-125" />
          
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="128"
              cy="128"
              r="120"
              stroke="rgba(197, 160, 89, 0.05)"
              strokeWidth="4"
              fill="transparent"
            />
            <motion.circle
              cx="128"
              cy="128"
              r="120"
              stroke="var(--gold)"
              strokeWidth="4"
              fill="transparent"
              strokeDasharray={2 * Math.PI * 120}
              initial={{ strokeDashoffset: 2 * Math.PI * 120 }}
              animate={{ strokeDashoffset: 2 * Math.PI * 120 * (1 - (forecast?.overall_score || 0) / 100) }}
              transition={{ duration: 2, ease: "easeOut" }}
              strokeLinecap="round"
              className="drop-shadow-[0_0_10px_rgba(197,160,89,0.3)]"
            />
          </svg>
          
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="text-sm font-mono text-zinc-500 uppercase tracking-widest mb-1">Resonance</span>
            <span className="text-7xl font-serif text-gold leading-none">{forecast?.overall_score}</span>
            <span className="text-[10px] uppercase tracking-[0.3em] text-zinc-600 mt-4 font-black">Score Index</span>
          </div>
          
          {/* Decorative Markers */}
          {[0, 90, 180, 270].map(deg => (
            <div key={deg} className="absolute inset-0 flex items-center justify-center pointer-events-none" style={{ transform: `rotate(${deg}deg)` }}>
              <div className="w-full flex justify-between px-2">
                 <div className="w-1 h-[1px] bg-gold/40" />
                 <div className="w-1 h-[1px] bg-gold/40" />
              </div>
            </div>
          ))}
        </div>

        <div className="flex-1 space-y-8 text-center lg:text-left">
          <div className="space-y-4">
            <div className="flex items-center justify-center lg:justify-start gap-3">
               <span className="overline-label text-gold/60">{monthName} Roadmap</span>
               <div className="h-[1px] w-12 bg-gold/20" />
            </div>
            <h1 className="text-6xl md:text-8xl font-serif text-white tracking-tighter uppercase leading-[0.9]">
              The <span className="text-gold">Monthly</span> <br />Transmission
            </h1>
            <p className="text-zinc-500 max-w-xl text-xs font-bold leading-relaxed uppercase tracking-[0.2em] opacity-80">
              Personalized cosmic velocity for your unique natal blueprint. <br /> 
              Current Dasha: <span className="text-white">{forecast?.dasha_context}</span>
            </p>
          </div>

          <div className="flex flex-wrap justify-center lg:justify-start gap-4">
            {forecast?.themes.map((theme, i) => (
              <div key={i} className="px-5 py-2 border border-white/10 bg-white/[0.02] text-zinc-400 text-[10px] font-black uppercase tracking-widest rounded-sm hover:border-gold/30 transition-colors">
                {theme}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DOMAIN DIAGNOSTICS */}
      <section className="space-y-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
           <div className="space-y-2">
              <h2 className="text-2xl font-serif text-white uppercase tracking-tight">Domain Resonance</h2>
              <p className="text-[10px] text-zinc-600 uppercase font-black tracking-widest">Energy distribution across life sectors</p>
           </div>
           <div className="flex gap-8">
              <div className="flex items-center gap-2">
                 <div className="w-2 h-2 rounded-full bg-gold" />
                 <span className="text-[9px] font-black text-zinc-500 uppercase">Growth</span>
              </div>
              <div className="flex items-center gap-2">
                 <div className="w-2 h-2 rounded-full bg-zinc-800" />
                 <span className="text-[9px] font-black text-zinc-500 uppercase">Maintenance</span>
              </div>
           </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {forecast?.domain_scores.map((domain, i) => {
            const Icon = (domainIcons[domain.name] || Sparkles) as LucideIcon;
            const isHigh = domain.score >= 70;
            const isLow = domain.score < 40;
            
            return (
              <IntelligenceCard
                key={domain.name}
                title={domain.name}
                subtitle="Sectoral Analysis"
                status={isHigh ? "Opportunity" : isLow ? "Caution" : "Neutral"}
                icon={Icon}
              >
                <div className="space-y-6">
                  <div className="flex items-end justify-between">
                     <div className="text-4xl font-serif text-white">{domain.score}</div>
                     <div className="flex flex-col items-end">
                        <div className="flex items-center gap-1.5 mb-1">
                           {domain.trend === "up" && <ArrowUpRight className="w-3 h-3 text-gold" />}
                           {domain.trend === "stable" && <ArrowRight className="w-3 h-3 text-zinc-500" />}
                           {domain.trend === "down" && <ArrowDownRight className="w-3 h-3 text-red-500" />}
                           <span className={`text-[8px] font-black uppercase tracking-widest ${
                             domain.trend === "up" ? "text-gold" : 
                             domain.trend === "stable" ? "text-zinc-500" : "text-red-500"
                           }`}>
                             {domain.trend}
                           </span>
                        </div>
                        <span className="text-[8px] text-zinc-600 uppercase font-bold tracking-tighter">Current Momentum</span>
                     </div>
                  </div>

                  <div className="h-0.5 w-full bg-white/5 overflow-hidden">
                     <motion.div
                       initial={{ width: 0 }}
                       animate={{ width: `${domain.score}%` }}
                       className={`h-full ${isHigh ? 'bg-gold' : isLow ? 'bg-red-900' : 'bg-white/40'}`}
                     />
                  </div>

                  <p className="text-xs text-zinc-400 leading-relaxed min-h-[3em]">
                    {domain.insight}
                  </p>
                </div>
              </IntelligenceCard>
            );
          })}
        </div>
      </section>

      {/* NARRATIVE & DATES */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-16">
        
        <div className="lg:col-span-3 space-y-8">
           <div className="flex items-center gap-4">
              <h2 className="text-2xl font-serif text-white uppercase tracking-tight">The Synthesis</h2>
              <div className="h-[1px] flex-1 bg-white/5" />
              <Sparkles className="w-5 h-5 text-gold/40" />
           </div>

           <div className="hud-module p-12 bg-black/40 border border-white/5 relative overflow-hidden">
              {/* Decorative Corner */}
              <div className="absolute top-0 left-0 w-8 h-8 border-t border-l border-gold/20" />
              
              {narrativeLoading ? (
                <div className="flex flex-col items-center justify-center py-20 gap-6">
                  <div className="relative">
                    <Loader2 className="w-8 h-8 text-gold animate-spin" />
                    <div className="absolute inset-0 blur-xl bg-gold/20" />
                  </div>
                  <span className="text-[10px] uppercase tracking-[0.4em] text-gold/60 font-black animate-pulse">Encoding Cosmic Stream...</span>
                </div>
              ) : (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-8"
                >
                  {narrative?.split("\n\n").map((para, i) => (
                    <p key={i} className="text-zinc-300 leading-relaxed text-lg font-light first-letter:text-4xl first-letter:font-serif first-letter:text-gold first-letter:mr-1 first-letter:float-left">
                      {para}
                    </p>
                  ))}
                  
                  {isFuture && (
                    <div className="pt-8 border-t border-white/5 flex items-start gap-4">
                       <AlertCircle className="w-4 h-4 text-gold/40 mt-1" />
                       <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest leading-loose">
                         Future-dated forecasts utilize macro-transit vectors. Final precision narratives are synthesized 48 hours prior to the month's commencement.
                       </p>
                    </div>
                  )}
                </motion.div>
              )}
           </div>
        </div>

        <div className="lg:col-span-2 space-y-8">
           <div className="flex items-center gap-4">
              <Calendar className="w-5 h-5 text-gold/40" />
              <h2 className="text-2xl font-serif text-white uppercase tracking-tight">Auspicious Gates</h2>
              <div className="h-[1px] flex-1 bg-white/5" />
           </div>

           <div className="space-y-4">
             {forecast?.key_dates.map((item, i) => (
               <motion.div
                 key={i}
                 initial={{ opacity: 0, x: 20 }}
                 animate={{ opacity: 1, x: 0 }}
                 transition={{ delay: 0.1 * i }}
                 className="hud-module p-6 border border-white/5 bg-white/[0.01] group hover:border-gold/20 transition-all"
               >
                 <div className="flex gap-6 items-start">
                    <div className="text-center min-w-[40px]">
                       <span className="text-3xl font-serif text-gold block leading-none">{item.date.split("-")[2]}</span>
                       <span className="text-[9px] text-zinc-600 font-black uppercase tracking-tighter">Day</span>
                    </div>
                    <div className="flex-1 space-y-2">
                       <div className="flex items-center justify-between">
                          <h4 className="text-sm font-bold text-white uppercase tracking-wider">{item.event}</h4>
                          <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-full border ${
                            item.impact === "Favorable" ? "border-gold/30 bg-gold/5 text-gold" :
                            item.impact === "Neutral" ? "border-zinc-800 bg-zinc-900 text-zinc-500" :
                            "border-red-900/30 bg-red-950/10 text-red-500"
                          }`}>
                            {item.impact}
                          </span>
                       </div>
                       <p className="text-xs text-zinc-500 leading-relaxed line-clamp-2 italic">
                         {item.description}
                       </p>
                    </div>
                 </div>
               </motion.div>
             ))}
           </div>
        </div>
      </div>

      {/* NAVIGATION: TEMPORAL SHIFT */}
      <section className="pt-16 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-8">
        <button 
          onClick={() => handleMonthChange("prev")}
          className="group flex items-center gap-4 px-8 py-4 border border-white/5 hover:border-gold/30 transition-all rounded-sm"
        >
          <ChevronLeft className="w-4 h-4 text-zinc-600 group-hover:text-gold transition-colors" />
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 group-hover:text-white">Previous Orbit</span>
        </button>

        <button 
          onClick={() => handleMonthChange("current")}
          className="hud-button bg-gold text-black px-12 py-4 text-[10px] font-black uppercase tracking-[0.4em]"
        >
          Reset To Current
        </button>

        <button 
          onClick={() => handleMonthChange("next")}
          className="group flex items-center gap-4 px-8 py-4 border border-white/5 hover:border-gold/30 transition-all rounded-sm"
        >
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 group-hover:text-white">Next Orbit</span>
          <ChevronRight className="w-4 h-4 text-zinc-600 group-hover:text-gold transition-colors" />
        </button>
      </section>
    </div>
  );
}


export default function MonthlyForecastPage() {
  return (
    <Suspense fallback={<MonthlyForecastSkeleton />}>
      <MonthlyForecastContent />
    </Suspense>
  );
}
