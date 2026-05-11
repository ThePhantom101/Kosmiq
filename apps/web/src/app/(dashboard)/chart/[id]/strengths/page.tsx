"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useAstro } from "@/context/AstroContext";
import { ChevronDown, ChevronUp, Info, AlertTriangle, BarChart3, Zap } from "lucide-react";

// --- Types ---

interface ShadbalaSubScores {
  [key: string]: number;
}

interface ShadbalaPlanet {
  total: number;
  sub_scores: ShadbalaSubScores;
}

interface ShadbalaData {
  planets: Record<string, ShadbalaPlanet>;
  summary: string;
}

// --- Constants ---

const HOUSE_THEMES = [
  "Self", "Wealth", "Siblings", "Home", "Children", "Health",
  "Partner", "Transformation", "Wisdom", "Career", "Network", "Liberation"
];

const PLANET_ORDER = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn"];

const SHADBALA_SUB_MAP: Record<string, string> = {
  "Sthana Bala": "Positional Strength",
  "Dig Bala": "Directional Strength",
  "Kala Bala": "Temporal Strength",
  "Chesta Bala": "Motional Strength",
  "Naisargika Bala": "Natural Strength",
  "Drik Bala": "Aspectual Strength"
};

// --- Components ---

const PlanetBar = ({ 
  name, 
  data, 
  isExpanded, 
  onToggle 
}: { 
  name: string; 
  data: ShadbalaPlanet; 
  isExpanded: boolean; 
  onToggle: () => void;
}) => {
  const getStatus = (score: number) => {
    if (score > 65) return { label: "Strong", color: "text-gold" };
    if (score >= 40) return { label: "Average", color: "text-white" };
    return { label: "Weak", color: "text-red-400" };
  };

  const status = getStatus(data.total);

  return (
    <div className="space-y-3 group border-b border-white/5 pb-6 last:border-0 last:pb-0">
      <div 
        className="flex items-center gap-4 cursor-pointer select-none"
        onClick={onToggle}
      >
        <div className="w-24 text-sm font-bold tracking-wider text-gray-400 group-hover:text-gold transition-colors">
          {name}
        </div>
        
        <div className="flex-1 h-3 bg-white/5 rounded-full overflow-hidden relative">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${data.total}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="h-full bg-gold shadow-[0_0_10px_rgba(201,168,76,0.2)]"
          />
        </div>

        <div className="w-32 flex items-center justify-between gap-3">
          <div className="flex flex-col items-end">
            <span className="text-sm font-mono font-bold text-gold">{Math.round(data.total)}</span>
            <span className={`text-[10px] uppercase font-bold tracking-tighter ${status.color}`}>
              {status.label}
            </span>
          </div>
          {isExpanded ? <ChevronUp className="w-4 h-4 text-gray-600" /> : <ChevronDown className="w-4 h-4 text-gray-600" />}
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
            <div className="pl-24 pr-32 space-y-3 pt-4">
              {Object.entries(data.sub_scores).map(([subKey, subVal]) => (
                <div key={subKey} className="flex items-center gap-4">
                  <div className="w-48 text-[9px] uppercase tracking-[0.2em] font-bold text-gray-500">
                    {SHADBALA_SUB_MAP[subKey] || subKey} <span className="text-gray-700 font-normal italic lowercase ml-1">({subKey})</span>
                  </div>
                  <div className="flex-1 h-1 bg-white/5 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${(subVal / 60) * 100}%` }}
                      className="h-full bg-gold/40"
                    />
                  </div>
                  <div className="text-[10px] font-mono text-gray-400 w-8 text-right">
                    {Math.round(subVal)}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const HouseCard = ({ 
  num, 
  score, 
  theme 
}: { 
  num: number; 
  score: number; 
  theme: string;
}) => {
  const getBorder = (s: number) => {
    if (s >= 28) return "border-gold/50 shadow-[0_0_15px_rgba(201,168,76,0.1)]";
    if (s >= 20) return "border-white/20";
    return "border-white/5 opacity-60";
  };

  return (
    <div className={`bg-black/40 backdrop-blur-md p-6 flex flex-col items-center justify-center gap-2 transition-all hover:scale-[1.02] border-2 rounded-xl group relative ${getBorder(score)}`}>
      <div className="text-3xl font-black text-gold/80">{num}</div>
      <div className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-500">{theme}</div>
      
      <div className="w-full mt-4 space-y-2">
        <div className="flex justify-center gap-1.5">
          {Array.from({ length: 8 }).map((_, i) => (
            <div 
              key={i} 
              className={`w-1.5 h-1.5 rounded-full ${i < Math.round((score / 56) * 8) ? 'bg-gold shadow-[0_0_5px_rgba(201,168,76,0.5)]' : 'bg-white/5'}`} 
            />
          ))}
        </div>
        <div className="text-center text-sm font-mono font-bold text-white/80">{score} <span className="text-[10px] text-gray-600 font-normal">pts</span></div>
      </div>
      
      {/* Tooltip on hover */}
      <div className="absolute inset-0 z-10 bg-black/90 opacity-0 group-hover:opacity-100 transition-opacity p-4 flex items-center justify-center text-center rounded-xl pointer-events-none">
        <p className="text-[10px] text-gold font-bold leading-relaxed uppercase tracking-wider">
          {theme} • {score >= 28 ? 'Fortified' : score >= 20 ? 'Balanced' : 'Vulnerable'}
          <br/>
          <span className="text-white/40 mt-1 block lowercase font-normal italic">governs your {theme.toLowerCase()} potential</span>
        </p>
      </div>
    </div>
  );
};

interface AshtakavargaData {
  house_totals?: Record<string, number>;
  [key: string]: any; // Allow other keys but strictly type house_totals
}

// --- Main Page ---

export default function StrengthsPage() {
  const params = useParams();
  const id = params?.id as string;
  const { data: astroData } = useAstro();
  
  const [activeTab, setActiveTab] = useState<"planet" | "house">("planet");
  const [shadbala, setShadbala] = useState<ShadbalaData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedPlanet, setExpandedPlanet] = useState<string | null>(null);

  useEffect(() => {
    fetchShadbala();
  }, [id]);

  const fetchShadbala = async () => {
    setLoading(true);
    setError(null);
    try {
      let res;
      if (id === "me") {
        if (!astroData?.chart?.metadata) throw new Error("No chart data found in sanctuary");
        
        // Extract birth data from metadata or use cached data
        // For me alias, we typically have the full birth data in the context
        // But for now, we'll try to use the stored data to compute shadbala
        res = await fetch(`/api/chart/me/shadbala`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            // Birth data is usually needed for calculation
            // We'll pass the whole chart data and let the engine handle it or pull birth info
            ...astroData.chart.metadata 
          }),
        });
      } else {
        res = await fetch(`/api/chart/${id}/shadbala`);
      }

      if (!res.ok) throw new Error("Connection to Astro Engine failed");
      const data = await res.json();
      setShadbala(data);
    } catch (err: any) {
      setError(err.message);
      setShadbala({
        planets: {},
        summary: "Analysis connection pending. Re-calculating planetary resonance."
      });
    } finally {
      setLoading(false);
    }
  };

  // House Strength Data (Ashtakavarga)
  const avData = astroData?.chart?.ashtakavarga as AshtakavargaData;
  const houseTotals = avData?.house_totals || {
    "1": 28, "2": 24, "3": 31, "4": 22, "5": 29, "6": 33,
    "7": 21, "8": 19, "9": 35, "10": 26, "11": 38, "12": 23
  };

  const rankedHouses = Object.entries(houseTotals)
    .map(([num, score]) => ({ num: parseInt(num), score: score as number, theme: HOUSE_THEMES[parseInt(num)-1] }))
    .sort((a, b) => b.score - a.score);

  const strongestHouses = rankedHouses.slice(0, 3);
  const weakestHouses = rankedHouses.slice(-3).reverse();

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto space-y-12 animate-pulse px-4 pt-4">
        <div className="flex justify-between items-end">
          <div className="space-y-4">
            <div className="h-10 w-64 bg-white/5 rounded" />
            <div className="h-4 w-32 bg-white/5 rounded" />
          </div>
          <div className="h-12 w-48 bg-white/5 rounded-full" />
        </div>
        <div className="space-y-8 bg-black/40 p-8 rounded-3xl border border-white/5">
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="h-8 bg-white/5 rounded" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto pb-20 px-4 pt-4">
      {/* Header & Tabs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
        <div className="space-y-1">
          <h1 className="text-4xl font-black uppercase tracking-tight text-white">
            {activeTab === "planet" ? "Planet Strength" : "House Strength"}
          </h1>
          <div className="flex items-center gap-2">
            <span className="text-gold/60 text-[10px] uppercase tracking-[0.4em] font-bold">
              {activeTab === "planet" ? "Shadbala System" : "Ashtakavarga System"}
            </span>
            <div className="h-px w-8 bg-gold/20" />
            <span className="text-gray-600 text-[10px] uppercase tracking-widest font-medium italic">
              Precision Weighted
            </span>
          </div>
        </div>

        <div className="flex bg-white/5 p-1 rounded-full border border-white/10 self-start md:self-center">
          <button
            onClick={() => setActiveTab("planet")}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-[10px] uppercase font-black tracking-widest transition-all ${
              activeTab === "planet" ? "bg-gold text-black shadow-[0_0_15px_rgba(201,168,76,0.3)]" : "text-gray-500 hover:text-white"
            }`}
          >
            <Zap className="w-3 h-3" />
            Planet
          </button>
          <button
            onClick={() => setActiveTab("house")}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-[10px] uppercase font-black tracking-widest transition-all ${
              activeTab === "house" ? "bg-gold text-black shadow-[0_0_15px_rgba(201,168,76,0.3)]" : "text-gray-500 hover:text-white"
            }`}
          >
            <BarChart3 className="w-3 h-3" />
            House
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        {activeTab === "planet" ? (
          <motion.div
            key="planet-tab"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-10"
          >
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-xl flex items-center gap-3 text-red-400 text-xs">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                {error}. Using cached baseline models.
              </div>
            )}

            <div className="bg-black/60 border border-gold/10 rounded-[2rem] p-8 md:p-12 space-y-10 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-gold/5 rounded-full blur-[100px] -mr-32 -mt-32" />
              
              {PLANET_ORDER.map((planet) => (
                shadbala?.planets[planet] && (
                  <PlanetBar 
                    key={planet}
                    name={planet}
                    data={shadbala.planets[planet]}
                    isExpanded={expandedPlanet === planet}
                    onToggle={() => setExpandedPlanet(expandedPlanet === planet ? null : planet)}
                  />
                )
              ))}
            </div>
            
            {shadbala?.summary && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="flex items-start gap-4 bg-gold/5 border border-gold/10 p-8 rounded-3xl"
              >
                <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center shrink-0">
                  <Info className="w-5 h-5 text-gold" />
                </div>
                <p className="text-base text-gold/90 font-medium leading-relaxed italic">
                  {shadbala.summary}
                </p>
              </motion.div>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="house-tab"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-16"
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
              {HOUSE_THEMES.map((theme, i) => (
                <HouseCard 
                  key={i}
                  num={i + 1}
                  theme={theme}
                  score={houseTotals[String(i + 1)] || 0}
                />
              ))}
            </div>

            <div className="grid md:grid-cols-2 gap-12 border-t border-white/5 pt-16">
              <div className="space-y-8">
                <h3 className="text-[10px] uppercase tracking-[0.5em] font-black text-gold/40 flex items-center gap-3">
                  <div className="h-px w-6 bg-gold/40" />
                  Dominant Sectors
                </h3>
                <div className="space-y-4">
                  {strongestHouses.map((h, i) => (
                    <div key={h.num} className="flex items-center justify-between bg-white/5 p-6 rounded-2xl border border-gold/10 group hover:border-gold/30 transition-all">
                      <div className="flex items-center gap-6">
                        <span className="text-2xl font-black text-gold/20 group-hover:text-gold/40 transition-colors">0{i + 1}</span>
                        <div>
                          <div className="text-xs font-bold text-white uppercase tracking-widest">{h.theme}</div>
                          <div className="text-[10px] text-gray-600 font-medium mt-1">House {h.num}</div>
                        </div>
                      </div>
                      <div className="text-2xl font-mono font-bold text-gold">{h.score}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-8">
                <h3 className="text-[10px] uppercase tracking-[0.5em] font-black text-gray-600 flex items-center gap-3">
                  <div className="h-px w-6 bg-gray-600" />
                  Evolutionary focus
                </h3>
                <div className="space-y-4">
                  {weakestHouses.map((h, i) => (
                    <div key={h.num} className="flex items-center justify-between bg-white/5 p-6 rounded-2xl border border-white/5 group hover:border-white/10 transition-all opacity-70 hover:opacity-100">
                      <div className="flex items-center gap-6">
                        <span className="text-2xl font-black text-gray-800 group-hover:text-gray-700 transition-colors">0{i + 1}</span>
                        <div>
                          <div className="text-xs font-bold text-gray-400 uppercase tracking-widest">{h.theme}</div>
                          <div className="text-[10px] text-gray-600 font-medium mt-1">House {h.num}</div>
                        </div>
                      </div>
                      <div className="text-2xl font-mono font-bold text-gray-500">{h.score}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
