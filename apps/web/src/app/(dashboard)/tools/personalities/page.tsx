"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Users, Search, Filter, History, 
  Star, Award, Zap, Crown, User,
  Sparkles, Target, Compass, ChevronRight,
  Archive
} from "lucide-react";
import { HISTORICAL_FIGURES, HistoricalFigure } from "@/data/historicalFigures";

const LAGNAS = [
  "All", "Aries", "Taurus", "Gemini", "Cancer", 
  "Leo", "Virgo", "Libra", "Scorpio", 
  "Sagittarius", "Capricorn", "Aquarius", "Pisces"
];

const PLANETS = ["All", "Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn"];

export default function PersonalitiesPage() {
  const [search, setSearch] = useState("");
  const [selectedLagna, setSelectedLagna] = useState("All");
  const [selectedPlanet, setSelectedPlanet] = useState("All");

  const filteredFigures = useMemo(() => {
    return HISTORICAL_FIGURES.filter(f => {
      const matchesSearch = f.name.toLowerCase().includes(search.toLowerCase()) || 
                           f.achievement.toLowerCase().includes(search.toLowerCase());
      const matchesLagna = selectedLagna === "All" || f.lagna === selectedLagna;
      const matchesPlanet = selectedPlanet === "All" || f.dominantPlanet === selectedPlanet;
      return matchesSearch && matchesLagna && matchesPlanet;
    });
  }, [search, selectedLagna, selectedPlanet]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 pb-32 space-y-16">
      {/* CINEMATIC HEADER */}
      <section className="flex flex-col md:flex-row items-center justify-between gap-8 pb-12 border-b border-white/5">
        <div className="space-y-4 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-4">
            <span className="overline-label text-gold/60 tracking-[0.4em]">Karmic Archives</span>
            <div className="h-[1px] w-12 bg-gold/20" />
          </div>
          <h1 className="text-6xl md:text-8xl font-serif text-white tracking-tighter uppercase leading-[0.8]">
            Notable <br /> <span className="text-gold">Personalities</span>
          </h1>
          <div className="flex items-center justify-center md:justify-start gap-3 pt-4">
            <div className="text-[10px] text-zinc-500 font-mono uppercase tracking-widest">Library: Historical Blueprints</div>
            <div className="w-1 h-1 bg-zinc-800 rounded-full" />
            <div className="text-[10px] text-zinc-500 font-mono uppercase tracking-widest">{HISTORICAL_FIGURES.length} Profiles Cached</div>
          </div>
        </div>

        <div className="hidden lg:block">
           <div className="hud-module p-6 border-gold/10 bg-gold/[0.02] space-y-2 max-w-xs text-right">
              <p className="text-[10px] text-zinc-400 leading-relaxed uppercase tracking-widest italic">
                Cross-referencing historical chart structures against modern biological data to refine predictive weights.
              </p>
           </div>
        </div>
      </section>

      {/* FILTER HUD */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-2 relative group">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-700 group-focus-within:text-gold transition-colors" />
          <input 
            type="text"
            placeholder="FILTER BY NAME OR ACHIEVEMENT..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-black/60 border border-white/5 rounded-sm py-5 pl-14 pr-6 text-[10px] font-black uppercase tracking-[0.2em] text-white placeholder:text-zinc-800 focus:outline-none focus:border-gold/30 transition-all"
          />
        </div>

        <div className="relative">
          <select 
            value={selectedLagna}
            onChange={e => setSelectedLagna(e.target.value)}
            className="w-full bg-black/60 border border-white/5 rounded-sm py-5 px-6 text-[10px] font-black uppercase tracking-[0.2em] text-white appearance-none focus:outline-none focus:border-gold/30 transition-all cursor-pointer"
          >
            {LAGNAS.map(l => <option key={l} value={l}>{l === "All" ? "ALL LAGNAS" : l.toUpperCase()}</option>)}
          </select>
          <Filter className="absolute right-6 top-1/2 -translate-y-1/2 w-3 h-3 text-zinc-800 pointer-events-none" />
        </div>

        <div className="relative">
          <select 
            value={selectedPlanet}
            onChange={e => setSelectedPlanet(e.target.value)}
            className="w-full bg-black/60 border border-white/5 rounded-sm py-5 px-6 text-[10px] font-black uppercase tracking-[0.2em] text-white appearance-none focus:outline-none focus:border-gold/30 transition-all cursor-pointer"
          >
            {PLANETS.map(p => <option key={p} value={p}>{p === "All" ? "ALL DOMINANTS" : p.toUpperCase()}</option>)}
          </select>
          <Zap className="absolute right-6 top-1/2 -translate-y-1/2 w-3 h-3 text-zinc-800 pointer-events-none" />
        </div>
      </div>

      {/* ARCHIVE GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <AnimatePresence mode="popLayout">
          {filteredFigures.map((figure, idx) => (
            <motion.div
              layout
              key={figure.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ delay: idx * 0.02 }}
              className="group relative hud-module p-8 space-y-6 hover:border-gold/40 transition-all duration-500 overflow-hidden"
            >
              {/* Background Glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-gold/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

              <div className="flex justify-between items-start relative z-10">
                <div className="p-4 bg-gold/5 border border-gold/10 rounded-sm group-hover:bg-gold/10 transition-all">
                  {figure.dominantPlanet === "Sun" ? <Star className="w-5 h-5 text-gold" /> : 
                   figure.dominantPlanet === "Jupiter" ? <Crown className="w-5 h-5 text-gold" /> :
                   <Zap className="w-5 h-5 text-gold" />}
                </div>
                <div className="text-right space-y-1">
                   <div className="text-[10px] font-black uppercase tracking-[0.2em] text-gold">{figure.lagna}</div>
                   <div className="text-[8px] font-black uppercase tracking-widest text-zinc-700">ASCENDANT PATH</div>
                </div>
              </div>

              <div className="space-y-4 relative z-10">
                <div>
                  <h3 className="text-2xl font-serif text-white tracking-tight group-hover:text-gold transition-colors">{figure.name}</h3>
                  <p className="text-[9px] font-black uppercase tracking-[0.3em] text-zinc-600 mt-1">{figure.period}</p>
                </div>

                <div className="h-px bg-white/5 w-full" />

                <div className="space-y-3">
                   <div className="flex items-center gap-2">
                      <Award className="w-3 h-3 text-gold/40" />
                      <span className="text-[9px] font-black uppercase tracking-widest text-zinc-500">Core Achievement</span>
                   </div>
                   <p className="text-[11px] text-zinc-400 font-medium leading-relaxed italic border-l border-gold/20 pl-4 py-1">
                     "{figure.achievement}"
                   </p>
                </div>

                <div className="bg-black/60 border border-white/5 p-4 space-y-3 rounded-sm">
                   <div className="flex items-center justify-between">
                      <span className="text-[8px] font-black uppercase tracking-widest text-zinc-700">Notable Placement</span>
                      <Sparkles className="w-2 h-2 text-gold/20" />
                   </div>
                   <div className="flex flex-wrap gap-2">
                      <span className="px-2 py-1 bg-gold/5 border border-gold/20 text-[9px] font-black uppercase tracking-widest text-gold">{figure.notablePlacement}</span>
                      <span className="px-2 py-1 bg-white/5 border border-white/10 text-[9px] font-black uppercase tracking-widest text-zinc-400">{figure.dominantPlanet} DOMINANT</span>
                   </div>
                </div>

                <p className="text-[11px] text-zinc-500 leading-relaxed line-clamp-3 group-hover:text-zinc-300 transition-colors">
                  {figure.description}
                </p>
              </div>

              {/* Interaction Hint */}
              <div className="pt-4 opacity-0 group-hover:opacity-100 transition-all flex items-center gap-2 justify-end">
                 <span className="text-[9px] font-black uppercase tracking-widest text-gold/60">Inspect Blueprint</span>
                 <ChevronRight className="w-3 h-3 text-gold/60" />
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filteredFigures.length === 0 && (
        <div className="text-center py-40 space-y-6">
          <div className="relative inline-block">
             <Archive className="w-24 h-24 text-zinc-900 mx-auto" />
             <div className="absolute inset-0 blur-3xl bg-gold/[0.02]" />
          </div>
          <div className="space-y-2">
             <h3 className="text-2xl font-serif text-white uppercase tracking-tight">Archive Mismatch</h3>
             <p className="text-[10px] text-zinc-600 uppercase font-black tracking-[0.3em] max-w-sm mx-auto leading-relaxed">
               No blueprints found in the current temporal slice. Adjust filters to broaden search.
             </p>
          </div>
        </div>
      )}

      <style jsx>{`
        .overline-label {
          @apply text-[10px] font-black uppercase tracking-[0.3em] block;
        }
      `}</style>
    </div>
  );
}
