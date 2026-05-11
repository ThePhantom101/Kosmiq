"use client";

import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { 
  Users, Star, Award, History, 
  TrendingUp, Search, Zap, Crown
} from "lucide-react";
import { useAstro } from "@/context/AstroContext";
import { HISTORICAL_FIGURES, HistoricalFigure } from "@/data/historicalFigures";

const ZODIAC_SIGNS = [
  "Aries", "Taurus", "Gemini", "Cancer", 
  "Leo", "Virgo", "Libra", "Scorpio", 
  "Sagittarius", "Capricorn", "Aquarius", "Pisces"
];

export default function SamhitaMatches() {
  const { data } = useAstro();

  const userChart = useMemo(() => {
    if (!data?.chart) return null;
    
    const ascSign = ZODIAC_SIGNS[Math.floor(data.chart.ascendant / 30) % 12];
    
    // Find strongest planet
    let strongest = "";
    let maxStrength = -1;
    if (data.chart.planetary_strengths) {
      Object.entries(data.chart.planetary_strengths).forEach(([planet, strength]) => {
        if (strength > maxStrength) {
          maxStrength = strength;
          strongest = planet;
        }
      });
    }

    return {
      lagna: ascSign,
      dominantPlanet: strongest || "Sun"
    };
  }, [data]);

  const matches = useMemo(() => {
    if (!userChart) return [];

    return HISTORICAL_FIGURES.map(figure => {
      let score = 0;
      const matchingElements = [];

      if (figure.lagna === userChart.lagna) {
        score += 50;
        matchingElements.push(`${figure.lagna} Lagna`);
      }

      if (figure.dominantPlanet === userChart.dominantPlanet) {
        score += 40;
        matchingElements.push(`${figure.dominantPlanet} Dominant`);
      }

      // Random small jitter for similarity feel
      score += Math.floor(Math.random() * 10);
      score = Math.min(99, score);

      return {
        ...figure,
        score,
        matchingElements
      };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 6);
  }, [userChart]);

  if (!userChart) {
    return (
      <div className="text-center py-32 space-y-4">
        <div className="p-6 bg-gold/5 border border-gold/10 rounded-full w-fit mx-auto mb-6">
          <Search className="w-12 h-12 text-gold/20" />
        </div>
        <h3 className="text-xl font-light text-white">No chart data found</h3>
        <p className="text-white/30 text-sm max-w-sm mx-auto">
          Please calculate your chart first to see your historical matches.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      {/* Header HUD */}
      <div className="hud-module p-8 border border-gold/20 bg-gold/5 rounded-3xl backdrop-blur-md relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <History className="w-32 h-32 text-gold" />
        </div>
        
        <div className="relative z-10 space-y-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gold/20 rounded-2xl border border-gold/40">
              <Users className="w-6 h-6 text-gold" />
            </div>
            <div>
              <h2 className="text-2xl font-light text-white">Karmic Resonance</h2>
              <p className="text-gold/60 text-[10px] uppercase tracking-[0.3em] font-bold">Historical Chart Alignment</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-4">
            <div className="bg-black/40 border border-gold/20 px-4 py-2 rounded-full flex items-center gap-3">
              <span className="text-[10px] uppercase tracking-widest text-white/40">Your Lagna</span>
              <span className="text-xs text-gold font-bold">{userChart.lagna}</span>
            </div>
            <div className="bg-black/40 border border-gold/20 px-4 py-2 rounded-full flex items-center gap-3">
              <span className="text-[10px] uppercase tracking-widest text-white/40">Your Dominant</span>
              <span className="text-xs text-gold font-bold">{userChart.dominantPlanet}</span>
            </div>
          </div>

          <p className="text-white/40 text-sm leading-relaxed max-w-2xl">
            The Samhita (Collection) matches your birth chart signatures against the archives of history's most influential figures. Discover those who shared your cosmic blueprint and how they manifested their potential.
          </p>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {matches.map((figure, idx) => (
          <motion.div
            key={figure.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="group relative bg-white/[0.02] hover:bg-gold/[0.03] border border-white/5 hover:border-gold/30 rounded-3xl p-6 transition-all duration-500 overflow-hidden"
          >
            {/* Background Pattern */}
            <div className="absolute -right-4 -bottom-4 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity">
              <History className="w-32 h-32" />
            </div>

            <div className="flex justify-between items-start mb-6">
              <div className="p-3 bg-gold/10 border border-gold/20 rounded-2xl group-hover:scale-110 transition-transform duration-500">
                {figure.dominantPlanet === "Sun" ? <Star className="w-5 h-5 text-gold" /> : 
                 figure.dominantPlanet === "Jupiter" ? <Crown className="w-5 h-5 text-gold" /> :
                 <Zap className="w-5 h-5 text-gold" />}
              </div>
              <div className="text-right">
                <div className="text-2xl font-mono text-gold mb-1">{figure.score}%</div>
                <div className="text-[9px] uppercase tracking-widest text-white/20 font-bold">Similarity</div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-light text-white mb-1 group-hover:text-gold transition-colors">{figure.name}</h3>
                <p className="text-[10px] uppercase tracking-[0.2em] text-white/40 font-medium">{figure.period}</p>
              </div>

              <div className="h-px bg-white/5 w-full" />

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-gold/60 font-bold">
                  <Award className="w-3 h-3" /> Achievement
                </div>
                <p className="text-xs text-white/70 leading-relaxed italic line-clamp-2">
                  "{figure.achievement}"
                </p>
              </div>

              <div className="bg-black/40 border border-white/5 rounded-2xl p-4 space-y-3">
                <div className="text-[9px] uppercase tracking-widest text-white/20 font-bold">Matching Elements</div>
                <div className="flex flex-wrap gap-2">
                  {figure.matchingElements.map(el => (
                    <span key={el} className="px-2 py-1 bg-gold/10 border border-gold/20 rounded text-[9px] text-gold font-bold">
                      {el}
                    </span>
                  ))}
                  <span className="px-2 py-1 bg-white/5 border border-white/10 rounded text-[9px] text-white/40 font-bold">
                    {figure.notablePlacement}
                  </span>
                </div>
              </div>

              <p className="text-[11px] text-white/30 leading-relaxed line-clamp-3 group-hover:text-white/50 transition-colors">
                {figure.description}
              </p>
            </div>

            <button className="mt-6 w-full py-3 bg-white/5 hover:bg-gold/10 border border-white/10 hover:border-gold/30 rounded-xl text-[10px] uppercase tracking-[0.3em] text-white/40 hover:text-gold font-bold transition-all flex items-center justify-center gap-2">
              Explore Full Chart <TrendingUp className="w-3 h-3" />
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
