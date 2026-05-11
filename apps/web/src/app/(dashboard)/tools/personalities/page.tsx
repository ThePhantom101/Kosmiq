"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Users, Search, Filter, History, 
  Star, Award, Zap, Crown, User
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
    <div className="max-w-7xl mx-auto px-4 py-8 pb-32">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 space-y-4 md:space-y-0 border-b border-white/5 pb-8">
        <div>
          <h1 className="text-4xl font-light tracking-tight text-white mb-1">
            Notable Personalities
          </h1>
          <p className="text-gold text-xs uppercase tracking-[0.4em] font-medium opacity-80">
            Karmic Archives
          </p>
        </div>
        <div className="text-right">
          <p className="text-white/20 text-[10px] uppercase tracking-widest font-bold">Total Archives</p>
          <p className="text-2xl font-mono text-gold">{HISTORICAL_FIGURES.length}</p>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-12">
        <div className="relative group lg:col-span-2">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-gold transition-colors" />
          <input 
            type="text"
            placeholder="Search by name or achievement..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-gold/30 focus:bg-gold/5 transition-all"
          />
        </div>

        <div className="relative group">
          <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-gold transition-colors" />
          <select 
            value={selectedLagna}
            onChange={e => setSelectedLagna(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm text-white appearance-none focus:outline-none focus:border-gold/30 focus:bg-gold/5 transition-all cursor-pointer"
          >
            {LAGNAS.map(l => <option key={l} value={l}>{l === "All" ? "All Lagnas" : l}</option>)}
          </select>
        </div>

        <div className="relative group">
          <Zap className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-gold transition-colors" />
          <select 
            value={selectedPlanet}
            onChange={e => setSelectedPlanet(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm text-white appearance-none focus:outline-none focus:border-gold/30 focus:bg-gold/5 transition-all cursor-pointer"
          >
            {PLANETS.map(p => <option key={p} value={p}>{p === "All" ? "All Dominants" : p}</option>)}
          </select>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence mode="popLayout">
          {filteredFigures.map((figure, idx) => (
            <motion.div
              layout
              key={figure.name}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
              className="group relative bg-white/[0.02] hover:bg-gold/[0.03] border border-white/5 hover:border-gold/30 rounded-3xl p-6 transition-all duration-500 overflow-hidden"
            >
              {/* Background Pattern */}
              <div className="absolute -right-4 -bottom-4 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity">
                <User className="w-32 h-32" />
              </div>

              <div className="flex justify-between items-start mb-6">
                <div className="p-3 bg-gold/10 border border-gold/20 rounded-2xl group-hover:scale-110 transition-transform duration-500">
                  {figure.dominantPlanet === "Sun" ? <Star className="w-5 h-5 text-gold" /> : 
                   figure.dominantPlanet === "Jupiter" ? <Crown className="w-5 h-5 text-gold" /> :
                   <Zap className="w-5 h-5 text-gold" />}
                </div>
                <div className="text-right">
                  <div className="text-[10px] uppercase tracking-widest text-gold font-bold mb-1">{figure.lagna}</div>
                  <div className="text-[9px] uppercase tracking-widest text-white/20 font-bold">Ascendant</div>
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
                  <div className="text-[9px] uppercase tracking-widest text-white/20 font-bold">Notable Placement</div>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-2 py-1 bg-gold/10 border border-gold/20 rounded text-[9px] text-gold font-bold">
                      {figure.notablePlacement}
                    </span>
                    <span className="px-2 py-1 bg-white/5 border border-white/10 rounded text-[9px] text-white/40 font-bold">
                      {figure.dominantPlanet} Dominant
                    </span>
                  </div>
                </div>

                <p className="text-[11px] text-white/30 leading-relaxed line-clamp-3 group-hover:text-white/50 transition-colors">
                  {figure.description}
                </p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filteredFigures.length === 0 && (
        <div className="text-center py-32 space-y-4">
          <div className="p-6 bg-gold/5 border border-gold/10 rounded-full w-fit mx-auto mb-6">
            <Search className="w-12 h-12 text-gold/20" />
          </div>
          <h3 className="text-xl font-light text-white">No archives match your filter</h3>
          <p className="text-white/30 text-sm max-w-sm mx-auto">
            Try adjusting your search criteria or selecting "All" to browse the full collection.
          </p>
        </div>
      )}
    </div>
  );
}
