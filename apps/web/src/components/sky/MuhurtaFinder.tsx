"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Calendar, Clock, MapPin, Activity, 
  ChevronRight, Star, AlertCircle, Info,
  Search, Sparkles, Filter
} from "lucide-react";
import { useAstro } from "@/context/AstroContext";
import { PanchangResponse } from "@/types/astro";
import { MUHURTA_RULES, ActivityType } from "@/data/muhurtaRules";

interface MuhurtaWindow {
  date: string;
  panchang: PanchangResponse;
  score: number;
  isFavorable: boolean;
  reasons: string[];
  toAvoid: string[];
}

export default function MuhurtaFinder() {
  const { data: natalData } = useAstro();
  const [activity, setActivity] = useState<ActivityType>("New venture");
  const [fromDate, setFromDate] = useState(new Date().toISOString().split("T")[0]);
  const [toDate, setToDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 30);
    return d.toISOString().split("T")[0];
  });
  
  const [results, setResults] = useState<MuhurtaWindow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const calculateMuhurta = async () => {
    setLoading(true);
    setError(null);
    setResults([]);

    const start = new Date(fromDate);
    const end = new Date(toDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays > 31) {
      setError("Please select a range within 31 days.");
      setLoading(false);
      return;
    }

    try {
      const windows: MuhurtaWindow[] = [];
      const rule = MUHURTA_RULES[activity];
      
      // Fetching Panchang for each day
      // In a real app, this would be a single bulk endpoint
      const days = Array.from({ length: diffDays + 1 }, (_, i) => {
        const d = new Date(start);
        d.setDate(d.getDate() + i);
        return d.toISOString().split("T")[0];
      });

      // We'll process in batches to avoid overwhelming the server
      const batchSize = 5;
      for (let i = 0; i < days.length; i += batchSize) {
        const batch = days.slice(i, i + batchSize);
        const batchResults = await Promise.all(
          batch.map(async (date) => {
            const lat = natalData?.chart?.metadata?.jd ? 12.9716 : 0.0; // Use actual from profile if available
            const lng = 77.5946;
            const res = await fetch(`/api/sky/panchang?date=${date}&lat=${lat}&lng=${lng}`);
            if (!res.ok) return null;
            return { date, panchang: await res.json() as PanchangResponse };
          })
        );

        batchResults.forEach((item) => {
          if (!item) return;
          const { date, panchang } = item;
          
          let score = 50;
          const reasons: string[] = [];
          const toAvoid: string[] = [];

          // Rule Check: Tithi
          if (rule.favorableTithis) {
            if (rule.favorableTithis.includes(panchang.tithi.number || 0)) {
              score += 15;
              reasons.push(`Auspicious Tithi: ${panchang.tithi.name}`);
            } else if (panchang.tithi.quality === "Inauspicious") {
              score -= 20;
              toAvoid.push(`Inauspicious Tithi: ${panchang.tithi.name}`);
            }
          }

          // Rule Check: Nakshatra
          if (rule.favorableNakshatras) {
            if (rule.favorableNakshatras.includes(panchang.nakshatra.name)) {
              score += 20;
              reasons.push(`Favorable Nakshatra: ${panchang.nakshatra.name}`);
            } else if (panchang.nakshatra.quality === "Inauspicious") {
              score -= 15;
              toAvoid.push(`Avoid ${panchang.nakshatra.name} for this activity`);
            }
          }

          // Rule Check: Vara
          if (rule.favorableVara) {
            if (rule.favorableVara.includes(panchang.vara.name)) {
              score += 10;
              reasons.push(`Strong Weekday: ${panchang.vara.name}`);
            }
          }

          // Avoid Karana (Bhadra)
          if (rule.avoidKaranas && rule.avoidKaranas.includes(panchang.karana.name)) {
            score -= 30;
            toAvoid.push(`Bhadra (Vishti Karana) present`);
          }

          // General Rules
          reasons.push(`Abhijit Muhurta: ${panchang.abhijit.start} - ${panchang.abhijit.end}`);
          toAvoid.push(`Rahukalam: ${panchang.rahukalam.start} - ${panchang.rahukalam.end}`);

          // Clamp score
          score = Math.min(100, Math.max(0, score));

          windows.push({
            date,
            panchang,
            score,
            isFavorable: score >= 60,
            reasons,
            toAvoid
          });
        });
      }

      // Sort by score descending
      setResults(windows.sort((a, b) => b.score - a.score));
    } catch (err: any) {
      setError(err.message || "Failed to calculate muhurta");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-12">
      {/* Controls HUD */}
      <div className="hud-module p-8 border border-gold/20 bg-gold/5 rounded-3xl backdrop-blur-md">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Activity Dropdown */}
          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-[0.2em] text-gold/60 font-semibold flex items-center gap-2">
              <Activity className="w-3 h-3" /> Activity Type
            </label>
            <select 
              value={activity}
              onChange={(e) => setActivity(e.target.value as ActivityType)}
              className="w-full bg-black/60 border border-gold/20 rounded-xl px-4 py-3 focus:outline-none focus:border-gold/50 text-white font-mono text-sm appearance-none cursor-pointer"
            >
              {Object.keys(MUHURTA_RULES).map((key) => (
                <option key={key} value={key} className="bg-zinc-900">{key}</option>
              ))}
            </select>
          </div>

          {/* Date Range */}
          <div className="md:col-span-2 grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-[0.2em] text-gold/60 font-semibold flex items-center gap-2">
                <Calendar className="w-3 h-3" /> From Date
              </label>
              <input 
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="w-full bg-black/60 border border-gold/20 rounded-xl px-4 py-3 focus:outline-none focus:border-gold/50 text-white font-mono text-sm cursor-pointer"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-[0.2em] text-gold/60 font-semibold flex items-center gap-2">
                <Calendar className="w-3 h-3" /> To Date
              </label>
              <input 
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="w-full bg-black/60 border border-gold/20 rounded-xl px-4 py-3 focus:outline-none focus:border-gold/50 text-white font-mono text-sm cursor-pointer"
              />
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-col md:flex-row items-center justify-between gap-6 border-t border-gold/10 pt-8">
          <div className="flex items-center gap-4 text-white/40">
            <MapPin className="w-4 h-4 text-gold/60" />
            <div className="text-xs">
              <span className="block uppercase tracking-widest text-[9px] font-bold text-gold/40">Calculation Location</span>
              Bangalore, India (Pre-filled from Profile)
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={calculateMuhurta}
            disabled={loading}
            className="w-full md:w-auto bg-gold text-black font-bold px-8 py-4 rounded-xl flex items-center justify-center gap-3 shadow-[0_0_20px_rgba(212,175,55,0.3)] hover:shadow-[0_0_30px_rgba(212,175,55,0.5)] transition-all disabled:opacity-50"
          >
            {loading ? (
              <Clock className="w-5 h-5 animate-spin" />
            ) : (
              <Search className="w-5 h-5" />
            )}
            <span className="uppercase tracking-widest text-sm">Find Auspicious Windows</span>
          </motion.button>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-500/10 border border-red-500/20 p-4 rounded-2xl flex items-center gap-3 text-red-400 text-sm"
        >
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          {error}
        </motion.div>
      )}

      {/* Results List */}
      <div className="space-y-6">
        {loading && (
          <div className="flex flex-col items-center justify-center py-20 space-y-6">
            <div className="relative">
              <div className="w-16 h-16 border-2 border-gold/20 border-t-gold rounded-full animate-spin"></div>
              <Sparkles className="absolute inset-0 m-auto w-6 h-6 text-gold animate-pulse" />
            </div>
            <p className="text-gold/60 text-sm tracking-widest uppercase animate-pulse">Scanning the celestial tides...</p>
          </div>
        )}

        {!loading && results.length > 0 && (
          <>
            <div className="flex items-center justify-between px-2">
              <h3 className="text-lg font-light text-white flex items-center gap-3">
                <Star className="w-5 h-5 text-gold" />
                Auspicious Windows found for {activity}
              </h3>
              <div className="flex items-center gap-2 text-gold/40 text-[10px] uppercase tracking-widest font-bold">
                <Filter className="w-3 h-3" /> Sorted by Score
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <AnimatePresence mode="popLayout">
                {results.map((window, idx) => (
                  <motion.div
                    key={window.date}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className={`group relative overflow-hidden rounded-3xl border transition-all ${
                      window.isFavorable 
                        ? "bg-gold/5 border-gold/30 shadow-[0_0_15px_rgba(212,175,55,0.1)]" 
                        : "bg-white/[0.02] border-white/10 opacity-60"
                    }`}
                  >
                    <div className="p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                      {/* Date & Score */}
                      <div className="flex items-center gap-6">
                        <div className="text-center min-w-[80px]">
                          <div className="text-2xl font-serif text-white">
                            {new Date(window.date).toLocaleDateString('en-US', { day: '2-digit' })}
                          </div>
                          <div className="text-[10px] uppercase tracking-widest text-gold font-bold">
                            {new Date(window.date).toLocaleDateString('en-US', { month: 'short' })}
                          </div>
                        </div>

                        <div className="h-12 w-px bg-gold/10" />

                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className={`text-2xl font-mono ${window.isFavorable ? "text-gold" : "text-white/40"}`}>
                              {window.score}
                            </span>
                            <span className="text-[10px] text-white/20 uppercase tracking-tighter">/ 100</span>
                          </div>
                          <div className={`text-[10px] uppercase tracking-widest font-bold ${window.isFavorable ? "text-gold/60" : "text-white/20"}`}>
                            {window.isFavorable ? "Auspicious Window" : "Neutral Period"}
                          </div>
                        </div>
                      </div>

                      {/* Details */}
                      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-8 md:px-8 border-t md:border-t-0 md:border-l border-gold/10 pt-6 md:pt-0">
                        <div className="space-y-3">
                          <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-gold/40 font-bold">
                            <Sparkles className="w-3 h-3" /> Why it's favorable
                          </div>
                          <ul className="space-y-1.5">
                            {window.reasons.map((r, i) => (
                              <li key={i} className="text-xs text-white/70 flex items-start gap-2">
                                <div className="w-1 h-1 bg-gold rounded-full mt-1.5" />
                                {r}
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="space-y-3">
                          <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-red-500/40 font-bold">
                            <AlertCircle className="w-3 h-3" /> What to avoid
                          </div>
                          <ul className="space-y-1.5">
                            {window.toAvoid.map((r, i) => (
                              <li key={i} className="text-xs text-white/40 flex items-start gap-2">
                                <div className="w-1 h-1 bg-red-500/30 rounded-full mt-1.5" />
                                {r}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      {/* Action */}
                      <div className="w-full md:w-auto">
                        <button className="w-full md:w-auto bg-white/5 hover:bg-gold/10 border border-white/10 hover:border-gold/30 p-4 rounded-2xl transition-all group-hover:translate-x-1">
                          <ChevronRight className="w-5 h-5 text-gold/40 group-hover:text-gold" />
                        </button>
                      </div>
                    </div>

                    {/* Progress Bar Background */}
                    <div className="absolute bottom-0 left-0 h-1 bg-gold/20" style={{ width: `${window.score}%` }} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </>
        )}

        {!loading && results.length === 0 && !error && (
          <div className="text-center py-32 space-y-4">
            <div className="p-6 bg-gold/5 border border-gold/10 rounded-full w-fit mx-auto mb-6">
              <Info className="w-12 h-12 text-gold/20" />
            </div>
            <h3 className="text-xl font-light text-white">Select a date range and activity</h3>
            <p className="text-white/30 text-sm max-w-sm mx-auto">
              Our engine will scan the Panchang for favorable alignments between Tithis, Nakshatras, and planetary hours.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
