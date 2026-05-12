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
import { useAstro } from "@/context/AstroContext";
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
      
      // After forecast loads, fetch narrative (only for present/past months)
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
    const timer = setTimeout(() => {
      fetchForecast(currentMonth);
    }, 0);
    return () => clearTimeout(timer);
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
          <p className="text-sm text-gray-500 leading-relaxed">
            Monthly forecasts require your birth blueprint to calculate transit influences. Initialize your chart to unlock your cosmic roadmap.
          </p>
        </div>

        <Link
          href="/new-chart"
          className="px-8 py-3 bg-gold text-black text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-white transition-all rounded-sm shadow-lg shadow-gold/10"
        >
          Generate Your Chart
        </Link>
      </div>
    );
  }

  const monthName = format(parseISO(`${currentMonth}-01`), "MMMM yyyy");
  const isFuture = parseISO(`${currentMonth}-01`) > startOfMonth(new Date());

  return (
    <div className="max-w-7xl mx-auto space-y-12 pb-20">
      {/* SECTION 1: MONTH HERO */}
      <section className="relative overflow-hidden rounded-3xl border border-gold/10 bg-black/40 backdrop-blur-md p-8 md:p-12">
        <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
          <Sparkles className="w-32 h-32 text-gold" />
        </div>
        
        <div className="flex flex-col md:flex-row items-center gap-12">
          {/* Progress Ring */}
          <div className="relative w-48 h-48 shrink-0">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="96"
                cy="96"
                r="88"
                stroke="currentColor"
                strokeWidth="8"
                fill="transparent"
                className="text-gold/5"
              />
              <motion.circle
                cx="96"
                cy="96"
                r="88"
                stroke="currentColor"
                strokeWidth="8"
                fill="transparent"
                strokeDasharray={552.92}
                initial={{ strokeDashoffset: 552.92 }}
                animate={{ strokeDashoffset: 552.92 - (552.92 * (forecast?.overall_score || 0)) / 100 }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className="text-gold"
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-5xl font-light text-gold leading-none">{forecast?.overall_score}</span>
              <span className="text-[10px] uppercase tracking-[0.2em] text-gray-500 mt-1">Monthly Score</span>
            </div>
          </div>

          <div className="flex-1 text-center md:text-left space-y-6">
            <div className="space-y-1">
              <h1 className="text-4xl md:text-6xl font-light tracking-tight text-white">{monthName}</h1>
              <p className="text-gold/60 text-sm tracking-wide uppercase">
                Personalized for {natalData?.chart.shodashvarga?.D1?.Lagna ? "You" : "User"} · Moon in {natalData?.chart.planets?.Moon?.nakshatra?.name || "Transit"}
              </p>
            </div>

            <div className="flex flex-wrap justify-center md:justify-start gap-3">
              {forecast?.themes.map((theme, i) => (
                <span key={i} className="px-4 py-1.5 rounded-full border border-gold/20 bg-gold/5 text-gold text-xs font-medium tracking-wider uppercase">
                  {theme}
                </span>
              ))}
            </div>

            <div className="p-4 rounded-xl border border-gold/10 bg-white/5 flex items-start gap-4">
              <ShieldCheck className="w-5 h-5 text-gold shrink-0 mt-0.5" />
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-widest font-bold mb-1">Dasha Context</p>
                <p className="text-sm text-gray-200 leading-relaxed">{forecast?.dasha_context}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: LIFE DOMAIN SCORES */}
      <section className="space-y-6">
        <div className="flex items-end justify-between">
          <h2 className="text-xl font-light tracking-widest uppercase text-gold">Life Domains</h2>
          <span className="text-[10px] uppercase tracking-[0.2em] text-gray-500">How energy flows this month</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {forecast?.domain_scores.map((domain, i) => {
            const Icon = domainIcons[domain.name] || Sparkles;
            const isHigh = domain.score >= 70;
            const isLow = domain.score < 40;
            
            return (
              <motion.div
                key={domain.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className={`p-6 rounded-2xl border transition-all duration-300 ${
                  isHigh ? "border-gold/30 bg-gold/5 shadow-[0_0_20px_rgba(201,168,76,0.05)]" : 
                  isLow ? "border-red-900/30 bg-red-900/5" : 
                  "border-white/10 bg-white/5"
                }`}
              >
                <div className="flex items-start justify-between mb-6">
                  <div className={`p-2.5 rounded-lg ${isHigh ? "bg-gold/10 text-gold" : "bg-white/5 text-gray-400"}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex items-center gap-1.5">
                    {domain.trend === "up" && <ArrowUpRight className="w-4 h-4 text-green-500" />}
                    {domain.trend === "stable" && <ArrowRight className="w-4 h-4 text-gray-500" />}
                    {domain.trend === "down" && <ArrowDownRight className="w-4 h-4 text-red-500" />}
                    <span className={`text-xs uppercase tracking-tighter ${
                      domain.trend === "up" ? "text-green-500" : 
                      domain.trend === "stable" ? "text-gray-500" : "text-red-500"
                    }`}>
                      {domain.trend}
                    </span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-white mb-2">{domain.name}</h3>
                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${domain.score}%` }}
                        transition={{ duration: 1, delay: 0.5 + i * 0.1 }}
                        className={`h-full rounded-full ${isHigh ? "bg-gold" : isLow ? "bg-red-800" : "bg-gray-600"}`}
                      />
                    </div>
                  </div>
                  <p className="text-xs text-gray-400 leading-relaxed line-clamp-2">
                    {domain.insight}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* SECTION 3: KEY DATES */}
        <section className="space-y-6">
          <div className="flex items-end justify-between">
            <h2 className="text-xl font-light tracking-widest uppercase text-gold">Auspicious Windows</h2>
            <Calendar className="w-5 h-5 text-gold/40" />
          </div>
          <div className="space-y-4">
            {forecast?.key_dates.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + i * 0.1 }}
                className="group flex gap-6 p-4 rounded-xl border border-white/5 bg-white/5 hover:bg-white/[0.08] transition-colors"
              >
                <div className="flex flex-col items-center justify-center min-w-[60px] border-r border-white/10 pr-4">
                  <span className="text-lg font-light text-gold">{item.date.split("-")[2]}</span>
                  <span className="text-[10px] uppercase text-gray-500">Day</span>
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium text-white">{item.event}</h4>
                    <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                      item.impact === "Favorable" ? "bg-green-500/10 text-green-500" :
                      item.impact === "Neutral" ? "bg-gray-500/10 text-gray-500" :
                      "bg-red-500/10 text-red-500"
                    }`}>
                      {item.impact}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 leading-relaxed">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* SECTION 4: MONTHLY NARRATIVE */}
        <section className="space-y-6">
          <div className="flex items-end justify-between">
            <h2 className="text-xl font-light tracking-widest uppercase text-gold">The Narrative</h2>
            <Sparkles className="w-5 h-5 text-gold/40" />
          </div>
          <div className="relative min-h-[400px] p-8 rounded-3xl border border-gold/10 bg-white/5">
            {narrativeLoading ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
                <Loader2 className="w-6 h-6 text-gold animate-spin" />
                <span className="text-[10px] uppercase tracking-[0.2em] text-gray-500">Synthesizing Insight...</span>
              </div>
            ) : (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="prose prose-invert prose-sm max-w-none"
              >
                {narrative?.split("\n\n").map((para, i) => (
                  <p key={i} className="text-gray-300 leading-relaxed text-base font-light mb-6 last:mb-0">
                    {para}
                  </p>
                ))}
              </motion.div>
            )}
            
            {isFuture && !narrativeLoading && (
              <div className="mt-8 pt-6 border-t border-white/10 flex items-start gap-3">
                <AlertCircle className="w-4 h-4 text-gold/60 shrink-0 mt-0.5" />
                <p className="text-[10px] text-gray-500 uppercase tracking-wider leading-relaxed">
                  Future forecasts focus on macro transit energy. Detailed personal AI narratives are finalized as the month approaches.
                </p>
              </div>
            )}
          </div>
        </section>
      </div>

      {/* SECTION 5: MONTH NAVIGATION */}
      <section className="pt-12 border-t border-white/5 flex items-center justify-between">
        <button 
          onClick={() => handleMonthChange("prev")}
          className="flex items-center gap-2 px-6 py-3 rounded-full border border-white/10 hover:border-gold/30 hover:bg-gold/5 transition-all group"
        >
          <ChevronLeft className="w-4 h-4 text-gray-400 group-hover:text-gold" />
          <span className="text-xs uppercase tracking-widest font-bold text-gray-500 group-hover:text-gold">Previous</span>
        </button>

        <button 
          onClick={() => handleMonthChange("current")}
          className="px-8 py-3 rounded-full bg-gold text-black text-xs uppercase tracking-[0.2em] font-bold hover:scale-105 active:scale-95 transition-all"
        >
          Current Month
        </button>

        <button 
          onClick={() => handleMonthChange("next")}
          className="flex items-center gap-2 px-6 py-3 rounded-full border border-white/10 hover:border-gold/30 hover:bg-gold/5 transition-all group"
        >
          <span className="text-xs uppercase tracking-widest font-bold text-gray-500 group-hover:text-gold">Next</span>
          <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-gold" />
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
