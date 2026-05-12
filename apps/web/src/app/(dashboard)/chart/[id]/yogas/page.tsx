"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { AlertCircle, RefreshCcw, Zap, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useAstro } from "@/context/AstroContext";

interface Yoga {
  name: string;
  category: "Power" | "Wealth" | "Spiritual" | "Challenging";
  present: boolean;
  strength: string;
  meaning: string;
}

export default function YogasPage() {
  const { id } = useParams<{ id: string }>();
  const { data: astroData } = useAstro();
  const [yogas, setYogas] = useState<Yoga[]>([]);
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchYogas = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const url = `/api/chart/${id}/yogas`;
      const options: RequestInit = id === "me" ? {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chart_data: astroData?.chart }),
      } : {
        method: "GET",
      };

      const response = await fetch(url, options);
      if (!response.ok) throw new Error("Failed to fetch");
      const data = await response.json();
      setYogas(data.yogas);
      setSummary(data.summary);
    } catch (err) {
      console.error(err);
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [id, astroData]);

  useEffect(() => {
    fetchYogas();
  }, [fetchYogas]);

  const getCategoryStyles = (category: Yoga["category"]) => {
    switch (category) {
      case "Power": return "bg-gold/10 text-gold border-gold/30";
      case "Wealth": return "bg-green-500/10 text-green-400 border-green-500/20";
      case "Spiritual": return "bg-blue-400/10 text-blue-300 border-blue-400/20";
      case "Challenging": return "bg-red-500/10 text-red-400 border-red-500/20";
      default: return "bg-gray-500/10 text-gray-400 border-gray-500/20";
    }
  };

  const presentYogas = yogas.filter(y => y.present);
  const absentYogas = yogas.filter(y => !y.present);

  return (
    <div className="min-h-screen bg-black text-white p-4 md:p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-4xl font-serif uppercase tracking-tight text-white">
            Yogas
          </h1>
          <p className="text-gold/60 text-sm italic font-medium uppercase tracking-widest">
            Planetary Combinations
          </p>
        </div>
        {!loading && !error && (
          <div className="hud-module px-6 py-3 bg-gold/5 border border-gold/10">
            <span className="text-xs uppercase tracking-[0.2em] font-bold text-gold">
              {summary}
            </span>
          </div>
        )}
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-64 bg-white/5 border border-gold/10 rounded-sm animate-pulse" />
          ))}
        </div>
      ) : (error || (yogas.length === 0 && id === "me" && !loading)) ? (
        <div className="h-[60vh] flex flex-col items-center justify-center text-center space-y-8 max-w-md mx-auto">
          <div className="relative">
            <div className="absolute inset-0 bg-gold/20 blur-2xl rounded-full animate-pulse" />
            <AlertCircle className="w-16 h-16 text-gold/40 relative z-10" />
          </div>
          
          <div className="space-y-3">
            <h2 className="text-2xl font-serif text-gold uppercase tracking-tight">
              {error ? "Algorithm Recalibrating" : "Yogas Undetected"}
            </h2>
            <p className="text-sm text-gray-500 leading-relaxed">
              {error 
                ? "The yoga detection engine is currently processing cosmic configurations."
                : "Planetary combinations (Yogas) are calculated from your birth blueprint. Initialize your chart to reveal your celestial gifts."}
            </p>
          </div>

          <Link
            href="/new-chart"
            className="px-8 py-3 bg-gold text-black text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-white transition-all rounded-sm shadow-lg shadow-gold/10"
          >
            Generate Your Chart
          </Link>
          
          {error && (
            <button 
              onClick={() => window.location.reload()}
              className="text-[9px] uppercase tracking-widest text-gray-600 hover:text-gold transition-colors"
            >
              Retry Connection →
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-12">
          {/* Present Yogas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {presentYogas.map((yoga, index) => (
              <YogaCard key={yoga.name} yoga={yoga} index={index} />
            ))}
          </div>

          {/* Divider */}
          {absentYogas.length > 0 && (
            <div className="space-y-8">
              <div className="relative">
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                  <div className="w-full border-t border-gold/10"></div>
                </div>
                <div className="relative flex justify-center">
                  <span className="bg-black px-4 text-[10px] uppercase tracking-[0.3em] font-black text-gray-600">
                    Dormant Potentials
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 opacity-60 grayscale-[0.5]">
                {absentYogas.map((yoga, index) => (
                  <YogaCard key={yoga.name} yoga={yoga} index={index + presentYogas.length} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function YogaCard({ yoga, index }: { yoga: Yoga; index: number }) {
  const getCategoryStyles = (category: Yoga["category"]) => {
    switch (category) {
      case "Power": return "bg-gold/10 text-gold border-gold/30";
      case "Wealth": return "bg-green-500/10 text-green-400 border-green-500/20";
      case "Spiritual": return "bg-blue-400/10 text-blue-300 border-blue-400/20";
      case "Challenging": return "bg-red-500/10 text-red-400 border-red-500/20";
      default: return "bg-gray-500/10 text-gray-400 border-gray-500/20";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className={`hud-module p-8 bg-black border ${
        yoga.present ? "border-gold/30" : "border-white/5"
      } relative overflow-hidden group`}
    >
      {yoga.present && (
        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
          <Zap className="w-24 h-24 text-gold" />
        </div>
      )}

      <div className="space-y-6 relative z-10">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <h3 className={`text-2xl font-serif tracking-tight ${yoga.present ? "text-white" : "text-gray-500"}`}>
              {yoga.name}
            </h3>
            <span className={`inline-block text-[9px] px-2 py-0.5 uppercase tracking-widest font-black border rounded-sm ${getCategoryStyles(yoga.category)}`}>
              {yoga.category}
            </span>
          </div>
          <div className={`px-4 py-2 text-[10px] uppercase tracking-widest font-black border ${
            yoga.present 
              ? "bg-gold/10 border-gold text-gold" 
              : "bg-white/5 border-white/10 text-gray-600"
          }`}>
            {yoga.present ? "Present" : "Absent"}
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-gold/40">Potency</span>
            <div className="flex-1 h-px bg-gold/10" />
            <span className={`text-[10px] font-black uppercase tracking-widest ${
              yoga.present ? "text-white" : "text-gray-600"
            }`}>
              {yoga.strength}
            </span>
          </div>

          <p className={`text-sm leading-relaxed ${yoga.present ? "text-gray-300" : "text-gray-600 italic"}`}>
            {yoga.meaning}
          </p>
        </div>

        {yoga.present && (
          <Link
            href={`/ask?q=Tell me about my ${yoga.name} yoga and how it affects my life`}
            className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold text-gold hover:text-white transition-colors pt-2 group/link"
          >
            Ask Raj Jyotishi about this yoga
            <ArrowRight className="w-3 h-3 transition-transform group-hover/link:translate-x-1" />
          </Link>
        )}
      </div>
    </motion.div>
  );
}
